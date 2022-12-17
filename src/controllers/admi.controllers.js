// CONTROLLERS DEL ADMINISTRADOR
const admiController = {};
const Module = require('../models/Module');
const Users = require('../models/User');



admiController.renderMainViewAdmi = async (req, res) => {
    let modules = await Module.find().sort({ createdAt: 'desc' })
    res.render('viewsAdmi/admi', { modules });
}

admiController.logout = (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash("success_msg", "Sesión cerrada");
        res.redirect("/usersLogin/signin");
    });
}


// MOSTRAR USUARIOS
admiController.showUsers = async (req, res) => {
    const users = await Users.find({rol: "Alumno"}).sort({createdAt: 'desc'});
    res.render('viewsAdmi/showUsers', {users});
}

module.exports = admiController;