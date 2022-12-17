usersLoginController = {};
// LLAMANDO AL MODELO DE USUARIOS
const User = require('../models/User');

const passport = require('passport');

// Registrar sus datos
usersLoginController.renderSignUpForm =  (req, res) => {
    res.render('usersLogin/signup');
};

// REGISTRAR DATOS
usersLoginController.signUp = async (req, res) => {
    const errors = [];
    const {name, surname, email, password, confirm_password} = req.body;

    if (password != confirm_password) {
        errors.push({text: 'Las contraseñas no coinciden'});
    }
     if (password.length < 4) {
        errors.push({text: 'La contraseña debe tener por lo menos 4 caracteres'});
    }

    if(errors.length > 0) {
        return res.render('usersLogin/signup', {errors,
            name,
            surname,
            email,
            password,
            confirm_password
        });
    } else {
       const emailUser = await User.findOne({email: email});

       if(emailUser) {
            req.flash("error_msg", "El correo electrónico ya está registrado");
            res.redirect('/usersLogin/signup')
       } else {
            const newUser = new User({name, surname, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Usuario registrado');
            res.redirect('/usersLogin/signin');
        }
    }
};


// Ingresar con contrasena y correo
usersLoginController.renderSignIn = (req, res) => {
    res.render('usersLogin/signin');
};

usersLoginController.signIn = passport.authenticate('local', {
    failureRedirect: '/usersLogin/signin',
    // successRedirect: '/viewsUser/userWelcome',
    failureFlash: true
});



// Logout
usersLoginController.logout = (req, res) => {
    req.logout( (err) => {
        if (err) { return next(err); }
        req.flash( "success_msg" , "Sessión cerrada" );
        res.redirect( "/usersLogin/signin" );
    });
};


module.exports = usersLoginController;