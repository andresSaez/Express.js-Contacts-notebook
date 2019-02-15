const express = require('express');
const mongoose = require("mongoose");

let Tipos = require('../models/tipo');

let app = express();
let router = express.Router();

app.set('view engine', 'ejs');

/**
 * GET /
 */
router.get('/', (req, res) => {
       res.render('index');
});

/**
 * GET /nuevo_contacto
 */
router.get('/nuevo_contacto', (req, res) => {
    res.render('nuevo_contacto');
});

/**
 * GET /filtrar_contacto
 */
router.get('/filtrar_contactos', (req, res) => {
    res.render('filtrar_contactos');
})

module.exports = router;