import { Router } from "express";
import { renderIndex, renderAbout, renderInfo, renderScanner, renderDashboard, renderRegistro} from "../controllers/index.controller.js";
import { isAuthenticated, isAdmin } from "../helpers/auth.js";

const router = Router();

router.get("/", renderIndex);
router.get("/about", renderAbout);

// Rutas privadas (requieren autenticación)
router.get("/scanner", isAuthenticated, isAdmin, renderScanner);
router.get("/infoevento", isAuthenticated, isAdmin, renderInfo); 
router.get("/dashboard", isAuthenticated, renderDashboard);
router.get("/registerUser", isAuthenticated, isAdmin, renderRegistro);

  
export default router;
