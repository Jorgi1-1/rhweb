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
    
    res.json(user);   // Devuelve los datos del usuario
  } catch (error) {
    res.status(500).json({ message: 'Error al recuperar los datos del usuario', error });
  }
});

// routes/admin.js o similar
router.get('/admin/users', async (req, res) => {
  try {
    const users = await User.find(); // puedes aplicar filtros si lo deseas
    res.render('admin/users', { users });
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    res.status(500).send('Error interno al cargar los usuarios');
  }
});

export default router;