const { Schema, model } = require('mongoose');
const brcrypt = require('bcryptjs');
const bcrypt = require('bcryptjs/dist/bcrypt');



// mÓDULO DE USUARIOS
const UserSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, default: "Alumno" },
    avances: { type: Array, default: [] }
}, {
    timestamps: true
});



// MÉTODOS DEL MÓDELO
UserSchema.methods.encryptPassword = async password => {
    // ENCRIPTAR CONTRASEÑAS
    const salt = await brcrypt.genSalt(10);
    return await brcrypt.hash(password, salt);
};

// COMPRABANDO CONTRASEÑAS
UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};



module.exports = model('User', UserSchema);