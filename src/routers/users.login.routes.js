// RUTAS SIGNUP Y SIGNIN (LOGIN)
const { Router } = require('express');
const router = Router();
const { renderSignIn, signIn, renderSignUpForm, signUp, logout } = require('../controllers/users.login.controllers');



// CREAR CUENTA
router.get('/usersLogin/signup', renderSignUpForm);
router.post('/usersLogin/signup', signUp);



// INICIAR SESIÓN
router.get('/usersLogin/signin', renderSignIn);
router.post('/usersLogin/signin', signIn, function (req, res) {
    const rol = req.user.rol;
    if (rol == 'Alumno') {
        res.redirect('/viewsUser/user');
    } else {
        res.redirect('/viewsAdmi/admi');
    }
});



// CERRAR SESIÓN
router.get('/users/logout', logout);



module.exports = router;