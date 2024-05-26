var dashModels = require("../models/medidasModels");

function buscarUltimasMedidas(req, res) {

    const limite_linhas = 7;

    var idLocal = req.params.idLocal;
    var idSensor = req.params.idSensor;

    console.log(`Recuperando as ultimas ${limite_linhas} medidas`);

    dashModels.buscarUltimasMedidas(idLocal, limite_linhas, idSensor).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as ultimas medidas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}


function buscarMedidasEmTempoReal(req, res) {

    var idLocal = req.params.idLocal;
    var idSensor = req.params.idSensor;

    console.log(`Recuperando medidas em tempo real`);

    dashModels.buscarMedidasEmTempoReal(idLocal, idSensor).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as ultimas medidas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    buscarUltimasMedidas,
    buscarMedidasEmTempoReal

}