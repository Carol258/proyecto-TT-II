const {Schema, model} = require('mongoose');



// MODELO DE MÓDULOS
const ModuleScheme = new Schema({
    nameModule: {type: String, require: true},
    nameAuthor: {type: String, require: true},
    descriptionModule: {type: String, require: true},
    referenceURLs: {type: Array, require: true},
    nameVideos: {type: Array},
    dataVideos: {type: Array},
    img: {type: String},
    test: {type: Array},
    category: {type: String}
}, {
    timestamps: true
});



module.exports = model('Module', ModuleScheme);