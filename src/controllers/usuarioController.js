const usuarioModel = require('../models/usuarioModel');
const enderecoModel = require('../models/enderecoModel');
const medidasModel = require('../models/medidasModels');

const autenticar = (req, res) => {

    const login = req.body.loginUser;
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
                    
                    medidasModel.buscarLocaisEmpresa(resposta[0].idEmpresa).then((tanques) => {

                        if(tanques.length > 0){
                            res.json({
                                idEmpresa: resposta[0].idEmpresa,
                                razaoSocial: resposta[0].razaoSocial,
                                cnpj: resposta[0].cnpj,
                                tanques: tanques
                            });
                        } else{
                            res.json({
                                empresa: resposta[0],
                                tanques: []
                            })
                        }
                    })
                }
            })
        } else{
            usuarioModel.autenticarUsuario(login, senha).then((resposta) => {
                if(resposta.length == 0){
                    res.status(400).send('email e/ou senha estão incorretos');
                } else{
                    medidasModel.buscarLocaisEmpresa(resposta[0].fkEmpresa).then((tanques) => {

                        if(tanques.length > 0){
                            res.json({
                                idFuncionario: resposta[0].idFuncionario,
                                fkEmpresa: resposta[0].fkEmpresa,
                                nome: resposta[0].nome,
                                email: resposta[0].email,
                                tanques: tanques
                            });
                        } else{
                            res.json({
                                empresa: resposta[0],
                                tanques: []
                            })
                        }
                    })
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

const cadastrarFuncionario = async (req, res) => {

    const fkEmpresa = req.body.idEmpresa;
    const nome = req.body.nomeFuncionario;
    const email = req.body.emailFuncionario;
    const telefone = req.body.telefoneFuncionario;
    const senha = req.body.senhaFuncionario;

    if (nome == '' || email == '' || telefone == '' || senha == '') {
        res.status(400).send('Preencha todos os campos para continuar')
    } else if(email.indexOf('@') == -1){
        res.status(400).send("Este Email é inválido")
    } else if (senha.length < 6){
        res.status(400).send("Senha precisa conter no minimo 6 caracteres")
    } else{
        
        const idFuncionario = await usuarioModel.buscarFuncionarios(fkEmpresa).then((data) => {
            return data.length == 0 ? 1 : data.length + 1;
        })

        await usuarioModel.inserirFuncionario(idFuncionario, fkEmpresa, nome, email, telefone, senha).then((data) => {
            res.status(203).json(data);
        })
    }
}



module.exports = {
    autenticar,
    cadastrar,
    cadastrarFuncionario
}