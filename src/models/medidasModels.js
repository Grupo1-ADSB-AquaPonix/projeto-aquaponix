var database = require("../database/config");

function buscarUltimasMedidas(idLocal, limite_linhas) {

    var instrucaoSql = `SELECT idDado,
	valor, 
    DATE_FORMAT(dtColeta,'%H:%i:%s') AS 'data_coleta'
    FROM dadoscapturados
    WHERE fkLocal = ${idLocal}
    ORDER BY idDado DESC LIMIT ${limite_linhas}`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMedidasEmTempoReal(idLocal) {

    var instrucaoSql = `SELECT idDado,
	valor, 
    DATE_FORMAT(dtColeta,'%H:%i:%s') AS 'data_coleta'
    FROM dadoscapturados
    WHERE fkLocal = ${idLocal}
    ORDER BY idDado DESC LIMIT 1`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarLocaisEmpresa(idEmpresa) {

    var instrucaoSql = `SELECT * FROM local WHERE fkEmpresa = ${idEmpresa};`;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarUltimasMedidas,
    buscarMedidasEmTempoReal,
    buscarLocaisEmpresa
}
