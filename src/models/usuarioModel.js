var database = require("../database/config")

const autenticarUsuario = (email, senha) => {

    const script = `SELECT * FROM funcionario WHERE email = '${email}' AND senha = '${senha}'`;
    return database.executar(script);
}

const autenticarEmpresa = (cnpj, senha) => {

    const script = `SELECT * FROM empresa WHERE cnpj = '${cnpj}' AND senha = '${senha}'`;
    return database.executar(script);
}

const buscarEmpresa = (cnpj) => {

    const script = `SELECT * FROM empresa WHERE cnpj = '${cnpj}'`;
    return database.executar(script);
}

const inserirEmpresa = (razaoSocial, cnpj, telefone1, telefone2, senha, fkEndereco) => {

    const script = `INSERT INTO empresa VALUES (default, '${razaoSocial}', '${cnpj}', '${telefone1}', '${telefone2}', '${senha}', ${fkEndereco})`;
    return database.executar(script);
}

const inserirFuncionario = (fkEmpresa, nome, email, telefone, senha) => {

    const script = `INSERT INTO funcionario VALUES ('${fkEmpresa}','${nome}', '${email}', '${telefone}', '${senha}')`;
    return database.executar(script);
}

const buscarFuncionarios = (idEmpresa) => {
    const script = `SELECT idfuncionario FROM funcionario where fkEmpresa = ${idEmpresa}`;
    return database.executar(script);
}


module.exports = {
    autenticarUsuario,
    autenticarEmpresa,
    buscarEmpresa,
    inserirEmpresa,
    inserirFuncionario,
    buscarFuncionarios
};