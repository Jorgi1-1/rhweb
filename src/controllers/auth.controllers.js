import User from "../models/User.js";
import passport from "passport";

export const renderSignUpForm = (req, res) => res.render("auth/signup");

export const signup = async (req, res) => {
  let errors = [];
  const {
    name,
    email,
    password,
    confirm_password,
    role,
    age,
    phone
  } = req.body;

  const normalizedEmail = email?.toLowerCase().trim();

  if (password !== confirm_password) {
    errors.push({ text: "Las contraseñas no coinciden." });
  }

  if (password.length < 4) {
    errors.push({ text: "La contraseña debe contener al menos 4 caracteres." });
  }

  if (!normalizedEmail) {
    errors.push({ text: "Error: Email inválido." });
  }

  if (!["admin", "supervisor", "employee"].includes(role)) {
    errors.push({ text: "Rol inválido." });
  }

  if (errors.length > 0) {
    return res.render("auth/signup", {
      errors,
      name,
      email,
      password,
      confirm_password,
      role,
      age,
      phone,
    });
  }

  const userFound = await User.findOne({ email: normalizedEmail });
  if (userFound) {
    req.flash("error_msg", "El email ya está en uso.");
    return res.redirect("/auth/signup");
  }

  const newUser = new User({
    name,
    email: normalizedEmail,
    password,
    role,
    age,
    phone,
    // Los siguientes campos quedan vacíos por defecto, si aplica:
    payrollInfo: undefined,
    attendanceLogs: [],
    schedule: []
  });

  newUser.password = await newUser.encryptPassword(password);
  await newUser.save();

  // Ya no iniciar sesión automáticamente
  req.flash("success_msg", "Usuario registrado exitosamente.");
  return res.redirect("/admin/users");
};

export const renderSigninForm = (req, res) => res.render("auth/signin");

export const signin = (req, res, next) => {
  req.body.email = req.body.email?.toLowerCase().trim();
  passport.authenticate("local", {
    successRedirect: "/dashboard", 
    failureRedirect: "/auth/signin",
    failureFlash: true,
  })(req, res, next);
};

export const logout = async (req, res, next) => {
  await req.logout((err) => {
    if (err) return next(err);
    req.flash("success_msg", "Sesión cerrada.");
    res.redirect("/auth/signin");
  });
};
