const express = require('express');
const mongoose = require("mongoose");

let Contacto = require('../models/contacto.js');

let app = express();
let router = express.Router();

app.set('view engine', 'ejs');

/**
 * GET /contactos
 */
router.get('/', (req, res) => {
    Contacto.find()
        .then(resultado => {
            if (resultado.length > 0)
                res.render('lista_contactos', {contactos: resultado, error: false });
            else
                res.render('lista_contactos', {contactos: [], error: true, mensajeError: "No hay contactos que mostrar" });
        })
        .catch(error => {
            res.render('lista_contactos', {contactos: [], error: true, mensajeError: "Error: " + error });
        });
});

/**
 * Método que discrimina si el id de la ruta es de un contacto o de un tipo de contacto
 * GET /contactos/:id o GET /contactos/:idTipo
 */
router.get('/:id', (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        Contacto.find({ $or: [ { _id: req.params.id }, { tipo: req.params.id } ]}).populate('tipo').then(resultado => {
            
            if (resultado.length > 0) {
                if (resultado[0]._id == req.params.id) {
                    res.render('ficha_contacto', {contactos: resultado[0], error: false});
                } else {
                    res.render('lista_contactos', {contactos: resultado, error: false});
                }
            }     
            else
                res.render('error', {contactos: [], error: true, mensajeError: "No se ha encontrado contactos del tipo especificado" });
        }).catch(error => {
            res.render('error', { contactos: [], error: true, mensajeError: "No se ha encontrado contactos: "+ error });
        });
    } else {
        res.render('error', { contactos: [], error: true, mensajeError: "El id especificado no es válido" });
    }  
});

/**
 * GET /contactos/editar/:id ESTE ROUTER NO SE PIDE EN EL EJERCICIO
 */
router.get('/editar/:id', (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        Contacto.findById(req.params.id)
            .then(resultado => {
                if (resultado) res.render('editar_contacto', { contactos: resultado });
                else
                    res.render('error', {
                        error: true,
                        mensajeError: "No se han encontrado contactos"
                    });
            })
            .catch(error => {
                res.render('error', {
                    error: true,
                    mensajeError: "Error buscando el contacto indicado: " + error
                });
            });
    } else {
        res.render('error', { error: true, mensajeError: "El id especificado no es válido" });
    }
    
});

/**
 * GET /contactos/:edad/:telefono
 */
router.get('/:edad/:telefono', (req, res) => {
    if (!isNaN(+req.params.edad) && !isNaN(+req.params.telefono)) {
        if (+req.params.edad < 0 || +req.params.telefono < 0) 
            res.render('lista_contactos', {contactos: [], error: true, mensajeError: "Los parámetros especificados no pueden ser negativos" });
        else {
            let edad = +req.params.edad === 0 ? 120 : req.params.edad;
            let telf = +req.params.telefono === 0 ? "" : req.params.telefono;
            Contacto.find({ edad: { $lte: edad },
                telefono: { $regex: telf+".*" } }).then(resultado => {
                if (resultado.length > 0) {
                    res.render('lista_contactos', {contactos: resultado, error: false});
                }
                else
                    res.render('lista_contactos', {contactos: [], error: true, mensajeError: "No se ha encontrado contactos con los criterios especificados" });
            }).catch(error => {
                res.render('lista_contactos', { contactos: [], error: true, mensajeError: "Error: " + error})
            });
        }
    } else {
        res.render('lista_contactos', { contactos: [], error: true, mensajeError: "La edad o el télefono especificados no son números" })
    }
});


/**
 * POST /contactos
 */
router.post('/', (req, res) =>{
    let nuevoContacto = new Contacto({
        nombre: req.body.nombre,
        telefono: req.body.telefono,
        edad: req.body.edad,
        tipo: req.body.tipo,
    });

    let d = new Date();
    let idUnico = d.getTime();

    if (!req.files.fichero) {
        nuevoContacto.save().then(resultado => {
            res.render('nuevo_contacto', { error: false, resultado: resultado, mensajeOk: true });
        }).catch(error => {
            let errorEspecifico = "";
            if (req.body.nombre === "") errorEspecifico = "El nombre no puede quedar vacío";
            if (!isNaN(req.body.edad) && (req.body.edad <18 || req.body.edad > 120)) errorEspecifico = "La edad debe ser un número entre 18 y 120";
            if (/^\d{9}$/.test(req.body.telefono)) errorEspecifico = "El teléfono no es válido";
            res.render('nuevo_contacto', { error: true, mensajeError: "Error añadiendo el contacto: " + errorEspecifico + ". " + error });
        });
    } else {  
        nuevoContacto.imagen = '/public/uploads/' + idUnico + req.files.fichero.name;
        nuevoContacto.save().then(resultado => {
            req.files.fichero.mv('./public/uploads/' + idUnico + req.files.fichero.name, (err) => {
                if (err) {
                    res.render('nuevo_contacto', { error: true, mensajeOk: true, mensajeError: "Contacto guardado pero Error al subir la imagen: " + err});
                } else {
                    res.render('nuevo_contacto', { error: false, mensajeOk: true, resultado: resultado });
                }
            });
        }).catch(error => {
            let errorEspecifico = "";
            if (req.body.nombre === "") errorEspecifico = "El nombre no puede quedar vacío";
            if (!isNaN(req.body.edad) && (req.body.edad <18 || req.body.edad > 120)) errorEspecifico = "La edad debe ser un número entre 18 y 120";
            if (/^\d{9}$/.test(req.body.telefono)) errorEspecifico = "El teléfono no es válido";
            res.render('nuevo_contacto', { error: true, mensajeError: "Error añadiendo el contacto: " + errorEspecifico + ". " + error });
        });
    }
});

/**
 * PUT /contactos
 */
router.put('/:id', (req, res) => {
    let d = new Date();
    let idUnico = d.getTime();

    if (!req.files) {
        Contacto.findByIdAndUpdate(req.params.id, {$set: {
            nombre: req.body.nombre,
            telefono: req.body.telefono,
            edad: req.body.edad,
            tipo: req.body.tipo
        }}, {new:true}).then(resultado => {
            res.render('editar_contacto', { error: false, contactos: resultado, mensajeOk: true });
        }).catch(error => {
            let errorEspecifico = "";
            if (req.body.nombre === "") errorEspecifico = "El nombre no puede quedar vacío";
            if (!isNaN(req.body.edad) && (req.body.edad <18 || req.body.edad > 120)) errorEspecifico = "La edad debe ser un número entre 18 y 120";
            if (/^\d{9}$/.test(req.body.telefono)) errorEspecifico = "El teléfono no es válido";
            res.render('editar_contacto', { error: true, mensajeError: "Error añadiendo el contacto: " + errorEspecifico + ". " + error });
        });
    } else {  
        let imagen = '/public/uploads/' + idUnico + req.files.fichero.name;

        Contacto.findByIdAndUpdate(req.params.id, {$set: {
            nombre: req.body.nombre,
            telefono: req.body.telefono,
            edad: req.body.edad,
            tipo: req.body.tipo,
            imagen: imagen
        }}, {new:true}).then(resultado => {
            req.files.fichero.mv('./public/uploads/' + idUnico + req.files.fichero.name, (err) => {
                if (err) {
                   res.render('editar_contacto', { error: true, contactos: resultado, mensajeError: "Contacto actualizado pero Error al subir la imagen: " + err});
                } else {
                    res.render('editar_contacto', { error: false, contactos: resultado });
                }
            });
        }).catch(error => {
            let errorEspecifico = "";
            if (req.body.nombre === "") errorEspecifico = "El nombre no puede quedar vacío";
            if (!isNaN(req.body.edad) && (req.body.edad <18 || req.body.edad > 120)) errorEspecifico = "La edad debe ser un número entre 18 y 120";
            if (/^\d{9}$/.test(req.body.telefono)) errorEspecifico = "El teléfono no es válido";
            res.render('editar_contacto', { error: true, mensajeError: "Error añadiendo el contacto: " + errorEspecifico + ". " + error });
        });
    }
});

/**
 * DELETE /contactos/:id
 */
router.delete('/:id', (req, res) => {
    Contacto.findByIdAndRemove(req.params.id)
        .then(resultado => {
            res.send( {error: false, resultado: resultado });
        })
        .catch(error => {
            res.send({
                error: true,
                mensajeError: "Error borrando el contacto"
            });
        });
});

module.exports = router;


