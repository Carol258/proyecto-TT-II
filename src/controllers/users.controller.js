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
    // const errors = []
    const { name, surname, password } = req.body;

    // if (password != confirm_password) {
    //     errors.push({ text: 'Las contraseñas no coinciden.' });
    // }
    // if (password.length < 4) {
    //     errors.push({ text: 'La contraseña debe tener más de 4 caracteres.' });
    // }

    // if (errors.length > 0) {
    //     return res.render('viewsUser/update', {
    //         errors,
    //         nameUser,
    //         surnameUser,
    //         email,
    //         passwordUser,
    //         confirm_password
    //     });
    // } else {
    //     const salt = await brcrypt.genSalt(10);
    //     const encryptPassword = await brcrypt.hash(passwordUser, salt);
    //     await User.findByIdAndUpdate(req.params.id, { name: nameUser, surname: surnameUser, password: encryptPassword });
    //     req.flash('success_msg', 'Usuario actualizado exitosamente.');
    //     console.log(req.user);
    //     res.redirect('/viewsUser/user');
    // }

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