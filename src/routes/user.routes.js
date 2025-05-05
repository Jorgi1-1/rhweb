import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get('/user/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      res.json(user);  // Devuelve los datos del usuario
    } catch (error) {
      res.status(500).json({ message: 'Error al recuperar los datos del usuario', error });
    }
  });

export default router;