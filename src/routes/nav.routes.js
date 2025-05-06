import { Router } from "express";
import { isAuthenticated } from "../helpers/auth.js"; 

const router = Router();

// Ruta para infoevento - solo accesible si el usuario está autenticado
router.use("/infoevento", isAuthenticated, (req, res) => {
  res.render("wip"); 
});

// Ruta para infohospedaje - solo accesible si el usuario está autenticado
router.use("/infohospedaje", isAuthenticated, (req, res) => {
  res.render("wip"); 
});

export default router;