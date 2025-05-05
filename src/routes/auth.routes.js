import { Router } from "express";
import {
  renderSignUpForm,
  signup,
  renderSigninForm,
  signin,
  logout,
} from "../controllers/auth.controllers.js";

const router = Router();

// Routes
// Ruta de registro
router.get("/auth/signup", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");  // Si ya está logueado, redirige al inicio
  }
  res.render("auth/signup");  // Si no, muestra la página de registro
});

router.post("/auth/signup", signup);

// Ruta de inicio de sesión
router.get("/auth/signin", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");  // Si ya está logueado, redirige al inicio
  }
  res.render("auth/signin");  // Si no, muestra la página de login
});

router.post("/auth/signin", signin);

router.get("/auth/logout", logout);

export default router;
