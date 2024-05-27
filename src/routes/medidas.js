var express = require('express');
var router = express.Router();

var dashController = require('../controllers/medidasController');

router.get('/buscar/:idLocal', (req, res) => {
    dashController.buscarUltimasMedidas(req, res);
})

router.get('/ultima-medida/:idLocal', (req, res) => {
    dashController.buscarMedidasEmTempoReal(req, res);
})

module.exports = router;