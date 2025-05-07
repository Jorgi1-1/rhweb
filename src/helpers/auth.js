export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // Si el usuario está autenticado, pasa a la siguiente middleware o ruta
  } else {
    req.flash("error_msg", "Por favor, inicie sesión para continuar.");
    res.redirect("/auth/signin"); // Redirige a la página de login si no está autenticado
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next(); // Si el rol es admin, continúa
  } else {
    req.flash("error_msg", "No tienes permisos para acceder a esta página.");
    return res.redirect("/dashboard"); // Redirige al dashboard u otra ruta segura
  }
};