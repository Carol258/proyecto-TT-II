const helpers = {};



// AUTENTICACIÓN DE LA SESIÓN
helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Usuario no autorizado');
    res.redirect('/usersLogin/signin');
}



module.exports = helpers;