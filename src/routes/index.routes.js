import { Router } from "express";
import { renderIndex, renderAbout, renderInfo, renderScanner, renderDashboard, renderHospedaje} from "../controllers/index.controller.js";
import { isAuthenticated, isAdmin } from "../helpers/auth.js";

const router = Router();

router.get("/", renderIndex);
router.get("/about", renderAbout);

// Rutas privadas (requieren autenticación)
router.get("/scanner", isAuthenticated, isAdmin, renderScanner);
router.get("/infoevento", isAuthenticated, isAdmin, renderInfo); //moverla de admin a general antes del evento
router.get("/dashboard", isAuthenticated, renderDashboard);

// QUITAR
router.get("/infohospedaje", isAuthenticated, renderHospedaje)
// QUITAR

  
export default router;
