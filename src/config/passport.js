const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');


// VALIDANDO EL CORREO Y CONTRASEÑA
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    // BUSCAR SI EXISTE EL USUARIO
    const user = await User.findOne({email});
    if (!user) {
        return done(null, false, { message: 'Usuario no registrado.'});
    }else {
        // COMPARANDO LA CONTRASEÑA
        const match = await user.matchPassword(password);
        if(match) {
            return done(null, user)
        } else {
            return done(null, false, {message: 'Contraseña incorrecta.'});
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id, user.rol);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    })
});
