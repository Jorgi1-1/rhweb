export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // Si el usuario está autenticado, pasa a la siguiente middleware o ruta
  } else {
    req.flash("error_msg", "Por favor, inicie sesión para continuar.");
    res.redirect("/auth/signin"); // Redirige a la página de login si no está autenticado
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    return next(); // Si el usuario es admin, pasa a la siguiente middleware o ruta
  } else {
    req.flash("error_msg", "No tienes permisos para acceder a esta página.");
    res.redirect("/"); // Redirige a la página principal si no es admin
  }
};