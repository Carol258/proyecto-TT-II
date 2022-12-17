const {Schema, model} = require('mongoose');


// MODELO DE MÓDULOS
const ResourceScheme = new Schema({
    nameResource: {type: String, require: true},
    resourceURL: {type: String, require: true}
    
}, {
    timestamps: true
});

module.exports = model('Resource', ResourceScheme);