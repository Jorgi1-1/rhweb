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
