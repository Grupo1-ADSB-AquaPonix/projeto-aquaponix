var express = require("express");
var router = express.Router();

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.get('/', (req, res) => {
    res.render('home')
})

module.exports = router;