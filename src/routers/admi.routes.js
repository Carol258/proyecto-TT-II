// RUTAS ADMINISTRADOR
const { Router } = require("express");
const { renderMainViewAdmi, logout, showUsers } = require('../controllers/admi.controllers');
const router = Router();
const { isAuthenticated } = require('../helpers/auth');



// INICIO DE SESIÓN
router.get('/viewsAdmi/admi', isAuthenticated, renderMainViewAdmi);


// MOSTRAR USUARIOS REGISTRADOS
router.get('/viewsAdmi/showUsers', isAuthenticated, showUsers);


// CERRAR SESIÓN
router.get('/users/logout', logout);



module.exports = router;