// EXPORTANDO MODULOS
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const fileUpload = require('express-fileupload');
require('./config/passport');


// EJECUTANDO EL MODULO EXPRESS
const app = express();



// CONFIGURACIONES
// Estableciendo el puerto dado por el sistema o uno por defecto
app.set('port', process.env.PORT || 4000);
// Estableciendo donde se encuentran las vistas
app.set('views', path.join(__dirname, 'views'));
// Configurando los handlebars
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main', 
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        'isAdmin': function(rol) {
            return rol == 'Admi'
        },
        'isAlum': function(rol) {
            return rol == 'Alumno'
        },
        'resultado': function(promedio) {
            return promedio > 80;
        },
        'eliminarEspacios': function(nombre) {
            return nombre.replace(/\s+/g, '');
        },
        'eliminarPuntoFinal': function(nombreVideo) {
            return nombreVideo.replace('.mp4', '');
        },
        'promedioDecimales': function(promedio) {
            return promedio.toFixed(2);
        }
    }
}));
app.set('view engine', '.hbs');



// MIDDLEWARES
app.use(morgan('dev'));
// Estableciendo que el servidor reciba informacion en formato JSON
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
// guardar mensajes en el servidor
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(fileUpload());



// GLOBAL VARIABLES
app.use((req, res, next) => {
    res.locals.success_msg =  req.flash('success_msg');
    res.locals.error_msg =  req.flash('error_msg');
    res.locals.error =  req.flash('error');
    res.locals.user = req.user || null;
    next();
});



// ROUTES
// Index
app.use(require('./routers/index.routes'));
// Login
app.use(require('./routers/users.login.routes'));
// Vistas user
app.use(require('./routers/users.routes'));
app.use(require('./routers/admi.routes'));
// Modules
app.use(require('./routers/modules.routes'))



// STATIC VIEWS
app.use(express.static(path.join(__dirname, 'public')));



// EXPORTANDO EL INICIALIZADOR DEL SERVIDOR
module.exports = app;