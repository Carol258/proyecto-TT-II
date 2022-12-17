// RUTAS USUARIO
const { Router } = require("express");
const { renderMainViewUser, renderUpdateForm, updateUser, showProgress, logout } = require("../controllers/users.controller");
const router = Router();
const { isAuthenticated } = require('../helpers/auth');



// PÁGINA DE INICIO
router.get('/viewsUser/user', isAuthenticated, renderMainViewUser);

router.get('/users/logout', logout);



// ACTUALIZAR DATOS
router.get('/viewsUser/update', isAuthenticated, renderUpdateForm);

router.put('/viewsUser/update/:id', isAuthenticated, updateUser);



// MOSTRAR AVANCES
router.get('/viewsUser/showProgress', isAuthenticated, showProgress);



module.exports = router;