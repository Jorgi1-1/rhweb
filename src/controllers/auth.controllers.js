import User from "../models/User.js";
import passport from "passport";
import { sendQRCodeEmail } from "../libs/emailService.js";

export const renderSignUpForm = (req, res) => res.render("auth/signup");

export const signup = async (req, res) => {
  let errors = [];
  const { name,
    email,
    password,
    confirm_password,
    group,
    role,
    age,
    phone,
    allergies,
    bloodType,
    shirtSize,
    emergency_name,
    emergency_phone } = req.body;

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

  if (errors.length > 0) {
    return res.render("auth/signup", {
      errors,
      name,
      email,
      password,
      confirm_password,
      group,
      role,
      age,
      phone,
      allergies,
      bloodType,
      shirtSize,
      emergency_name,
      emergency_phone,
    });
  }

  // Buscar el email insensible a mayúsculas
  const userFound = await User.findOne({ email: normalizedEmail });
  if (userFound) {
    req.flash("error_msg", "El email ya está en uso.");
    return res.redirect("/auth/signup");
  }

  // Guardar el nuevo usuario
  const newUser = new User({
    name,
    email: normalizedEmail,
    password,
    group,
    role,
    age,
    phone,
    allergies,
    bloodType,
    shirtSize,
    emergencyContact: { name: emergency_name, phone: emergency_phone },
  });
  newUser.password = await newUser.encryptPassword(password);
  await newUser.save();

  await sendQRCodeEmail(newUser.email, newUser.qrCode);

  // Iniciar sesión automáticamente después del registro
  req.login(newUser, (err) => {
    if (err) {
      console.error("Error al iniciar sesión después del registro:", err);
      req.flash("error_msg", "Hubo un problema al iniciar sesión.");
      return res.redirect("/auth/signin");
    }
    req.flash("success_msg", "Registro exitoso.");
    return res.redirect("/infoevento");
  });
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
