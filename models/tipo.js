const mongoose = require('mongoose');

let tipoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    }
});

let Tipo = mongoose.model('tipos', tipoSchema);

module.exports = Tipo;

