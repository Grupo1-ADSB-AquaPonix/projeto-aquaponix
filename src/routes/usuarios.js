var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.post("/cadastrar", (req, res) => {
    usuarioController.cadastrar(req, res);
})

router.post("/cadastrarFuncionario", (req, res) => {
    usuarioController.cadastrarFuncionario(req, res);
})

module.exports = router;