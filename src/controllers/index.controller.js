import User from "../models/User.js"; 

export const renderInfo = (req, res) => {
  res.render("schedule");
};

export const renderIndex = (req, res) => {
  res.render("index");
};

export const renderAbout = (req, res) => {
  res.render("about");
};

export const renderScanner = (req, res) => {
  res.render("scanner");
};

export const renderRegistro = (req, res) => {
  res.render("admin/userCreate"); 
};

export const renderUsers = async (req, res) => {
  try {
    const users = await User.find().lean(); // .lean() convierte los documentos de Mongoose a objetos planos
    res.render("admin/users", { users });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    req.flash("error_msg", "No se pudieron cargar los usuarios.");
    res.redirect("/dashboard");
  }
};
export const renderDashboard = async (req, res) => {
  try {
    const role = req.user.role;

    if (role === "admin") {
      const users = await User.find().lean();

      const employees = users.filter(u => u.role === "employee");
      const supervisors = users.filter(u => u.role === "supervisor");

      const currentMonth = new Date().getMonth();
      let totalPayments = 0;

      const payrollByEmployee = [];

      employees.forEach(emp => {
        const payroll = emp.payrollInfo || {};
        const base = Number(payroll.baseSalary) || 0;
        const bonuses = Number(payroll.bonuses) || 0;
        const deductions = Number(payroll.deductions) || 0;
        const net = base + bonuses - deductions;
        totalPayments += net;

        payrollByEmployee.push({ name: emp.name, payment: net });
      });

      res.render("dashboard", {
        user: req.user,
        metrics: {
          totalEmployees: employees.length,
          totalPayments,
          activeSupervisors: supervisors.length,
        },
        chartData: JSON.stringify(payrollByEmployee), // para usar en la gráfica
      });
    } else if (role === "supervisor") {
      const employees = await User.find({ role: "employee" }).lean();
    
      const currentWeekStart = new Date();
      currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay()); // domingo
    
      let attendanceCount = 0;
    
      employees.forEach(emp => {
        (emp.attendanceLogs || []).forEach(log => {
          const logDate = new Date(log.date);
          if (logDate >= currentWeekStart) {
            attendanceCount++;
          }
        });
      });
    
      const teamSchedules = employees.map(emp => ({
        name: emp.name,
        status: (emp.schedule?.length ?? 0) > 0 ? "Asignada" : "Sin agenda"
      }));
    
      res.render("dashboard", {
        user: req.user,
        metrics: {
          attendanceThisWeek: attendanceCount
        },
        teamSchedules
      });
    } else if (role === "employee") {
      const logs = req.user.attendanceLogs || [];
    
      const uniqueDays = new Set();
      let totalHours = 0;
    
      logs.forEach(log => {
        const date = new Date(log.date).toDateString();
        uniqueDays.add(date);
        totalHours += log.hoursWorked || 0;
      });

      const now = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (6 - i));
        return d.toDateString();
      });

      const attendanceLogs = req.user.attendanceLogs || [];

      const attendanceChart = last7Days.map(day => {
        const log = attendanceLogs.find(l => new Date(l.date).toDateString() === day);
        return {
          day: day.slice(0, 10),
          hours: log?.hoursWorked || 0,
        };
      });
    
      res.render("dashboard", {
        user: req.user,
        metrics: {
          daysPresent: uniqueDays.size,
          totalHoursWorked: totalHours.toFixed(2),
        },
        userSchedule: req.user.schedule || [],
        employeeAttendanceChartData: JSON.stringify(attendanceChart),
      });
    }
  } catch (err) {
    console.error("Error al renderizar dashboard:", err);
    req.flash("error_msg", "No se pudo cargar el panel.");
    res.redirect("/");
  }
};

// Muestra el perfil de un usuario específico
export const renderUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
      req.flash("error_msg", "Usuario no encontrado.");
      return res.redirect("/admin/users");
    }

    res.render("admin/userProfile", { user });
  } catch (error) {
    console.error("Error al cargar perfil:", error);
    req.flash("error_msg", "Error al cargar el perfil del usuario.");
    res.redirect("/admin/users");
  }
};

// Elimina a un usuario
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Usuario eliminado correctamente.");
    res.redirect("/admin/users");
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    req.flash("error_msg", "No se pudo eliminar el usuario.");
    res.redirect("/admin/users");
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    const { name, email, phone, age, role, baseSalary, bonuses, deductions } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      req.flash("error_msg", "Usuario no encontrado.");
      return res.redirect("/admin/users");
    }

    // Actualizar datos generales
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.age = age;
    user.role = role;

    // Actualizar información de pago
    if (!user.payrollInfo) {
      user.payrollInfo = {};
    }

    user.payrollInfo.baseSalary = baseSalary || 0;
    user.payrollInfo.bonuses = bonuses || 0;
    user.payrollInfo.deductions = deductions || 0;

    await user.save();

    req.flash("success_msg", "Información del usuario actualizada correctamente.");
    res.redirect(`/user/${user._id}`);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    req.flash("error_msg", "Error al actualizar la información del usuario.");
    res.redirect("/admin/users");
  }
};

export const updateUserSchedule = async (req, res) => {
  try {
    let { existingDays = [], startTimes = [], endTimes = [], deleteDays = [], newDay, newStartTime, newEndTime } = req.body;

    existingDays = Array.isArray(existingDays) ? existingDays : existingDays ? [existingDays] : [];
    startTimes = Array.isArray(startTimes) ? startTimes : startTimes ? [startTimes] : [];
    endTimes = Array.isArray(endTimes) ? endTimes : endTimes ? [endTimes] : [];

    // Asegurar que deleteDays sea un array
    if (typeof deleteDays === "string") {
      deleteDays = [deleteDays];
    } else if (!Array.isArray(deleteDays)) {
      deleteDays = [];
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash("error_msg", "Usuario no encontrado.");
      return res.redirect("/admin/users");
    }

    const scheduleMap = {};

    // Procesar días existentes con forEach para evitar inconsistencias de índice
    existingDays.forEach((day, index) => {
      if (!deleteDays.includes(day)) {
        scheduleMap[day] = {
          day,
          startTime: startTimes[index] || "",
          endTime: endTimes[index] || "",
        };
      }
    });

    // Agregar nuevo día si no está repetido
    if (newDay && newStartTime && newEndTime && !scheduleMap[newDay]) {
      scheduleMap[newDay] = {
        day: newDay,
        startTime: newStartTime,
        endTime: newEndTime,
      };
    }

    user.schedule = Object.values(scheduleMap);
    await user.save();

    req.flash("success_msg", "Agenda actualizada correctamente.");
    res.redirect(`/user/${user._id}`);
  } catch (error) {
    console.error("Error al actualizar agenda:", error);
    req.flash("error_msg", "No se pudo actualizar la agenda.");
    res.redirect("/admin/users");
  }
};

export const renderEmployeeProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) {
      req.flash("error_msg", "Usuario no encontrado.");
      return res.redirect("/dashboard");
    }

    res.render("profile", {
      user,
      attendanceLogs: user.attendanceLogs || [],
      schedule: user.schedule || [],
      payrollInfo: user.payrollInfo || {},
    });
  } catch (error) {
    console.error("Error al cargar perfil del empleado:", error);
    req.flash("error_msg", "No se pudo cargar tu perfil.");
    res.redirect("/dashboard");
  }
};

export const renderAttendanceEditor = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).lean();
    res.render("attendance", { employees });
  } catch (error) {
    console.error("Error al cargar empleados:", error);
    req.flash("error_msg", "No se pudo cargar la asistencia.");
    res.redirect("/dashboard");
  }
};

export const submitAttendance = async (req, res) => {
  try {
    const { date, checkIn = {}, checkOut = {} } = req.body;

    const employeeIds = Object.keys(checkIn);
    console.log("Datos recibidos:", req.body);

    for (let id of employeeIds) {
      const inTime = checkIn[id];
      const outTime = checkOut[id];
    
      // Si no hay hora de entrada o salida, no guardar nada
      if (!inTime && !outTime) continue;
    
      const user = await User.findById(id);
      if (!user) continue;
    
      const attendanceDate = new Date(date);
      const existingLog = user.attendanceLogs.find(log =>
        new Date(log.date).toDateString() === attendanceDate.toDateString()
      );
    
      if (existingLog) {
        if (inTime) existingLog.checkIn = inTime;
        if (outTime) existingLog.checkOut = outTime;
    
        if (existingLog.checkIn && existingLog.checkOut) {
          const [inHour, inMin] = existingLog.checkIn.split(":").map(Number);
          const [outHour, outMin] = existingLog.checkOut.split(":").map(Number);
          const worked = (outHour * 60 + outMin - (inHour * 60 + inMin)) / 60;
          existingLog.hoursWorked = Math.max(worked, 0);
        }
      } else {
        let hoursWorked = 0;
        if (inTime && outTime) {
          const [inHour, inMin] = inTime.split(":").map(Number);
          const [outHour, outMin] = outTime.split(":").map(Number);
          hoursWorked = Math.max((outHour * 60 + outMin - (inHour * 60 + inMin)) / 60, 0);
        }
    
        user.attendanceLogs.push({
          date: attendanceDate,
          checkIn: inTime,
          checkOut: outTime,
          hoursWorked,
        });
      }
    
      await user.save();
    }

    req.flash("success_msg", "Asistencia guardada correctamente.");
    res.redirect("/attendance");
  } catch (error) {
    console.error("Error al guardar asistencia:", error);
    req.flash("error_msg", "Error al registrar la asistencia.");
    res.redirect("/dashboard");
  }
};

export const renderEmployeeAttendance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) {
      req.flash("error_msg", "No se pudo cargar tu historial.");
      return res.redirect("/dashboard");
    }

    res.render("employee/attendance", {
      attendanceLogs: user.attendanceLogs || [],
    });
  } catch (error) {
    console.error("Error al mostrar asistencia del empleado:", error);
    req.flash("error_msg", "Error al cargar tu historial.");
    res.redirect("/dashboard");
  }
};