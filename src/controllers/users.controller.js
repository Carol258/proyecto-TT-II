const userController = {};

// IMPORTANDO MÓDULOS
const User = require('../models/User');
const brcrypt = require('bcryptjs');
const Module = require('../models/Module');


// PÁGINA DE INICIO DEL USUARIO
userController.renderMainViewUser = async (req, res) => {
    const modules = await Module.find({category: "Hardware"}).sort({ createdAt: 'desc' });
    res.render('viewsUser/user', { modules , hardware: true, software: false, dudas: false});
}

// CERRAR SESIÓN
userController.logout = (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash("success_msg", "Session cerrada");
        res.redirect("/usersLogin/signin");
    });
}



// ACTUALIZAR DATOS DE USUARIO
userController.renderUpdateForm = (req, res) => {
    const user = req.user;
    res.render('viewsUser/update', { user });
}

userController.updateUser = async (req, res) => {
    const { name, surname, password } = req.body;

    const salt = await brcrypt.genSalt(10);
    const encryptPassword = await brcrypt.hash(password, salt);
    await User.findByIdAndUpdate(req.params.id, { name: name, surname: surname, password: encryptPassword });
    req.flash('success_msg', 'Usuario actualizado exitosamente.');
    console.log(req.user);
    res.redirect('/viewsUser/user');
}



// MOSTRAR AVANCES
userController.showProgress = async (req, res) => {
    const user = await User.findById(req.user._id);
    let progress = user.avances;
    res.render('viewsUser/showProgress', { progress });
}



// 
userController.aboutCourses = (req, res) => {
    res.render('about/aboutCourses');
}

module.exports = userController;