const database = require('../database/config');

const inserirEndereco = (cep, numero, complemento) => {

    const script = `INSERT INTO  endereco VALUES (default, '${cep}', '${numero}', '${complemento}')`;
    return database.executar(script);
}

const ultimoRegistro = () => {

    const script = `SELECT idEndereco FROM endereco ORDER BY idEndereco DESC LIMIT 1`;
    return database.executar(script);
}

module.exports = {
    inserirEndereco,
    ultimoRegistro
}