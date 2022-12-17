
// CONFIGURANDO LAS VARIABLES DE ENTORNO (SOLO PARA LA PRUEBA)
require('dotenv').config();

// ARRANCANDO EL SERVIDOR
const app = require('./server');


// LLAMANDO LA CONFIGURACIÓN DE CONEXION A LA BASE DE DATOS
require('./database.js');
 
// PONIENDO EN MODO ESCUCHA EL SERVIDOR
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
})