const express = require('express');

let app = express();
let router = express.Router();

app.set('view engine', 'ejs');


/**
 * GET /tipos
 */
router.get('/', (req, res) => {
    TipoContacto.find()
        .then(resultado => {
            if (resultado.length > 0)
                res.render('lista_tipos', {tiposContacto: resultado});
            else
                res.render('lista_tipos', {tiposContacto: []});
        })
        .catch(error => {
            res.render('lista_tipos', {tiposContacto: []});
        });
});

module.exports = router;