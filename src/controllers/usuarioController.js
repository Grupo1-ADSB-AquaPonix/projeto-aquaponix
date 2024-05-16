const usuarioModel = require('../models/usuarioModel');
const enderecoModel = require('../models/enderecoModel');

const autenticar = (req, res) => {

    const login = req.body.emailUser;
    const senha = req.body.senhaUser;

    if(login.trim() == ""){
        res.status(400).send('Campo email vazio')
    } else if(senha.trim() == ""){
        res.status(400).send('Campo senha vazio')
    } else{
        
        if(login.indexOf("@") == -1){
            usuarioModel.autenticarEmpresa(login, senha).then((resposta) => {
                if(resposta.length == 0){
                    res.status(400).send('login e/ou senha estão incorretos');
                } else{
                    res.status(203).json(resposta[0]);
                }
            })
        } else{
            usuarioModel.autenticarUsuario(login, senha).then((resposta) => {
                if(resposta.length == 0){
                    res.status(400).send('email e/ou senha estão incorretos');
                } else{
                    res.status(203).json(resposta[0]);
                }
            })
        }
    }
}

const cadastrar = async (req, res) => {

    const razaoSocial = req.body.razaoSocialEmpresa;
    const cnpj = req.body.cnpjEmpresa;
    const telefone1 = req.body.telefone1Empresa;
    const telefone2 = req.body.telefone2Empresa;
    const senha = req.body.senhaEmpresa;
    const cep = req.body.cepEmpresa;
    const numero = req.body.numeroEmpresa;
    const complemento = req.body.complementoEmpresa;

    console.log(razaoSocial);
    console.log(numero);
    console.log(complemento);

    const cnpjEmpresa = await usuarioModel.buscarEmpresa(cnpj).then((empresa) => {
        return empresa[0]
    })

    if (razaoSocial == '' || cnpj == '' || (telefone1 == '' && telefone2 == '') || senha == '' || cep == '' || numero == '' || complemento == '') {
        res.status(400).send('Preencha todos os campos para continuar')
    } else if(cnpj.length != 18){
        res.status(400).send("Este CNPJ é inválido")
    } else if (cnpjEmpresa != undefined){
        res.status(400).send("Já existe uma empresa usando este CNPJ")
    } else{
        
        await enderecoModel.inserirEndereco(cep, numero, complemento);
        const getLastId = await enderecoModel.ultimoRegistro().then((data) => {
            return data[0];
        })

        await usuarioModel.inserirEmpresa(razaoSocial, cnpj, telefone1, telefone2, senha, getLastId.idEndereco).then((data) => {
            res.status(203).json(data);
        })
    }
}


module.exports = {
    autenticar,
    cadastrar
}