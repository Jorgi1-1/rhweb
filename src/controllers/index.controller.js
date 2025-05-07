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

export const renderDashboard = (req, res) => {
  const role = req.user.role;

  // Datos de ejemplo — deberías reemplazarlos con datos reales de tu base
  const metrics = {
    totalEmployees: 58,
    totalPayments: 120000,
    activeSupervisors: 6,
    attendanceThisWeek: 45,
    daysPresent: 18,
  };

  const teamSchedules = [
    { name: "Juan Pérez", status: "Completada" },
    { name: "Ana Ruiz", status: "Pendiente" },
  ];

  const userSchedule = [
    { date: "2025-05-06", task: "Reunión de equipo" },
    { date: "2025-05-07", task: "Tarea asignada" },
  ];

  res.render("dashboard", {
    user: req.user,
    metrics,
    teamSchedules: role === "supervisor" ? teamSchedules : null,
    userSchedule: role === "employee" ? userSchedule : null,
  });
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