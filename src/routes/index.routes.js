import { Router } from "express";
import { renderIndex, renderAbout, renderInfo, renderScanner, 
         renderDashboard, renderRegistro, renderUsers, deleteUser, 
         updateUserInfo, renderUserProfile, updateUserSchedule} from "../controllers/index.controller.js";
import { isAuthenticated, isAdmin } from "../helpers/auth.js";

const router = Router();

router.get("/", renderIndex);
router.get("/about", renderAbout);

// Rutas privadas (requieren autenticación)
router.get("/scanner", isAuthenticated, isAdmin, renderScanner);
router.get("/infoevento", isAuthenticated, isAdmin, renderInfo); 
router.get("/dashboard", isAuthenticated, renderDashboard);
router.get("/registerUser", isAuthenticated, isAdmin, renderRegistro);
router.get("/admin/users", isAuthenticated, isAdmin, renderUsers);
router.get("/user/:id", isAuthenticated, isAdmin, renderUserProfile);
router.post("/user/:id/delete", isAuthenticated, isAdmin, deleteUser);
router.post("/user/:id/update", isAuthenticated, isAdmin, updateUserInfo);
router.post("/user/:id/schedule/update", isAuthenticated, isAdmin, updateUserSchedule);

export default router;
