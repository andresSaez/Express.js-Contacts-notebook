const mongoose = require('mongoose');

let contactoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true,
        match: /^\d{9}$/
    },
    edad: {
        type: Number,
        min: 18,
        max: 120,
        required: true
    },
    tipo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tipos',
        required: true
    },
    imagen: {
        type: String,
        required: false
    }
});

let Contacto = mongoose.model('contactos', contactoSchema);

module.exports = Contacto;