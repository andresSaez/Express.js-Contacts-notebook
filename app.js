const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const contactos = require('./routes/contactos');
const index = require('./routes/index');
let Tipos = require('./models/tipo');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/contactos', { useNewUrlParser: true });

let app = express();
app.set('view engine', 'ejs');

app.use(async (req, res, next) => {
    res.locals.error = null;
    res.locals.mensajeError = null;
    res.locals.resultado = null;
    res.locals.mensajeOk = null;
    resultado = await Tipos.find();
        if (resultado.length > 0)
            res.locals.tipos = resultado;
        else
            res.locals.tipos = [];
    next();
});

app.use(bodyParser.json());
app.use(fileUpload());
app.use('/public', express.static('./public'));
app.use('/contactos', contactos);
app.use('/', index);

app.listen(8081);
