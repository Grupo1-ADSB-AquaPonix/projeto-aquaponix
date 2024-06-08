window.onload = exibirAquariosDoUsuario();

function filtrarLocal() {
    var id = Number(inp_idLocal.value);
    var local = `idLocal${id}`;

    console.log(id);

    var locais = JSON.parse(sessionStorage.LOCAIS);
    var tamanho_lista = locais.length / 2;
    var ultimo_id = document.querySelector(`div[id="${local}"]`);

    if (id <= 0) {
        span_locais.innerHTML = `Todos`;

        document.getElementById('graficos').innerHTML = ``;
        exibirAquariosDoUsuario();
    } else if (ultimo_id == null) {
        span_locais.innerHTML = `Não Encontrado!`;

        document.getElementById('graficos').style.justifyContent = 'flex-start';
        document.getElementById('graficos').innerHTML = `<h1>O tanque e horta de número ${id} não existe ou não foi encontrado!</h1>`;
    } else {
        span_locais.innerHTML = id;

        for (var i = 1; i <= tamanho_lista; i++) {

            var charts = document.querySelectorAll(`div[id="idLocal${i}"]`);
            for (var index = 0; index < 2; index++) {
                if (charts[index].id == local) {
                    continue;
                } else {
                    charts[index].style.display = 'none';
                }
            }
        }
    }
}

function exibirAquariosDoUsuario() {

    const graficos = JSON.parse(sessionStorage.LOCAIS);
    const razaoSocial = sessionStorage.RAZAO_SOCIAL;


    document.getElementById('razao-social').innerHTML = `${razaoSocial}`
    var cont = 1;
    for (var i = 0; i < graficos.length; i++) {

        var local = graficos[i];
        if (local.tipo == "Tanque") {
            document.getElementById('graficos').innerHTML += `
                <div class="especificacoes-grafico" id="idLocal${cont}">
                    <div class="box-informacoes">
                        <div class="tanque">
                            <h4>${local.tipo} ${cont}</h4>
                        </div>
                        <div class="extras-tanque">
                            <span>Peixe: ${local.especie}</span>
                            <span>Quantidade de peixes: ${local.qtdEspecie}</span>
                        </div>
                    </div>
                    <div class="grafico-linha">
                        <!-- Gráfico aparece dentro dessa tag -->
                        <canvas id="graficoLinha${local.idLocal}"></canvas>
                    </div>
                </div>
            `;
            obterDadosGrafico(local);
        } else if (local.tipo == "Horta") {
            document.getElementById('graficos').innerHTML += `
                <div class="especificacoes-grafico" id="idLocal${cont}">
                    <div class="box-informacoes">
                        <div class="tanque">
                            <h4>${local.tipo} ${cont}</h4>
                        </div>
                        <div class="extras-tanque">
                            <span>Planta: ${local.especie}</span>
                            <span>Quantidade de plantas: ${local.qtdEspecie}</span>
                        </div>
                    </div>
                    <div class="grafico-linha">
                        <!-- Gráfico aparece dentro dessa tag -->
                        <canvas id="graficoLinha${local.idLocal}"></canvas>
                    </div>
                </div>
            `;
            obterDadosGrafico(local);
            cont++
        }
    }
}

async function obterDadosGrafico(dataLocal) {

    await fetch(`/medidas/buscar/${dataLocal.idLocal}`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                resposta.reverse();

                plotarGrafico(resposta, dataLocal.tipo, dataLocal.idLocal);
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    });
}

function plotarGrafico(dadosLocal, tipo, idLocal) {

    console.log('iniciando plotagem do gráfico...');

    // Criando estrutura para plotar gráfico - dados
    let dadosGrafico = {
        labels: [],
        datasets: [
            {
                label: tipo == "Tanque" ? "Temperatura" : "Luminosidade",
                data: [],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                // dados que a linha vai se basear para percorrer o gráfico
                data: [],
                borderColor: "#FF0000",
                backgroundColor: "#FF0000",
                label: 'Máximo'
            },
            {
                // dados que a linha vai se basear para percorrer o gráfico
                data: [],
                borderColor: "#2400FF",
                backgroundColor: "#2400FF",
                label: 'Minímo'
            }
        ]
    };

    console.log('----------------------------------------------')
    console.log('Estes dados foram recebidos pela funcao "obterDadosGrafico" e passados para "plotarGrafico":')
    console.log(dadosGrafico)

    // Inserindo valores recebidos em estrutura para plotar o gráfico
    for (i = 0; i < dadosLocal.length; i++) {

        dadosGrafico.labels.push(dadosLocal[i].data_coleta);

        if (tipo == "Tanque") {
            dadosGrafico.datasets[0].data.push(dadosLocal[i].valor);
            dadosGrafico.datasets[1].data.push(29);
            dadosGrafico.datasets[2].data.push(22);
        } else if (tipo == "Horta") {
            dadosGrafico.datasets[0].data.push(dadosLocal[i].valor);
            dadosGrafico.datasets[1].data.push(400);
            dadosGrafico.datasets[2].data.push(101);
        }
    }

    console.log('----------------------------------------------')
    console.log('O gráfico será plotado com os respectivos valores:')
    console.log('Dados:')
    console.log(dadosGrafico.datasets[0].data);
    console.log('----------------------------------------------')

    var vlMin = 0;
    var vlMax = 0;
    if (tipo == "Tanque") {
        vlMin = 10;
        vlMax = 40;
    } else if (tipo == "Horta") {
        vlMin = 50;
        vlMax = 450;
    }

    // Criando estrutura para plotar gráfico - config
    const configChart = {
        type: 'line',
        data: dadosGrafico,
        options: {
            responsive: true,
            // scale defini o valor minimo e máximo do eixo Y
            scale: {
                y: {
                    min: vlMin,
                    max: vlMax
                }
            }
        }
    };

    // Adicionando gráfico criado em div na tela
    const grafico = document.getElementById(`graficoLinha${idLocal}`);
    grafico.width = '100%';
    let myChart = new Chart(
        grafico,
        configChart
    );

    setTimeout(() => atualizarGrafico(idLocal, dadosGrafico, myChart, tipo), 2000);
}

function atualizarGrafico(idLocal, dados, myChart, tipo) {

    fetch(`/medidas/ultima-medida/${idLocal}`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (novoRegistro) {

                // obterDadosGrafico(idLocal);
                // alertar(novoRegistro, idLocal);
                console.log(`Dados recebidos: ${JSON.stringify(novoRegistro)}`);
                console.log(`Dados atuais do gráfico:`);
                console.log(dados);

                // este if serve para fazer uma comparacao com a data de coleta, se a data de coleta do ultimo registro for igual ao valor que esta salvo na label, ele não atualizará o grafico
                if (novoRegistro[0].data_coleta == dados.labels[dados.labels.length - 1]) {
                    console.log("---------------------------------------------------------------")
                    console.log("Como não há dados novos para captura, o gráfico não atualizará.")
                    // avisoCaptura.innerHTML = "<i class='fa-solid fa-triangle-exclamation'></i> Foi trazido o dado mais atual capturado pelo sensor. <br> Como não há dados novos a exibir, o gráfico não atualizará."
                    console.log("Horário do novo dado capturado:")
                    console.log(novoRegistro[0].data_coleta)
                    console.log("Horário do último dado capturado:")
                    console.log(dados.labels[dados.labels.length - 1])
                    console.log("---------------------------------------------------------------")
                } else {
                    // tirando e colocando valores no gráfico
                    dados.labels.shift(); // apagar o primeiro momento
                    dados.labels.push(novoRegistro[0].data_coleta); // incluir um novo momento

                    dados.datasets[0].data.shift();  // apaga o primeiro registro da medida
                    dados.datasets[0].data.push(novoRegistro[0].valor); // incluir uma nova medida de umidade

                    myChart.update();
                }

                // Altere aqui o valor em ms se quiser que o gráfico atualize mais rápido ou mais devagar
                proximaAtualizacao = setTimeout(() => {
                    alertar(novoRegistro, idLocal, tipo)
                    atualizarGrafico(idLocal, dados, myChart, tipo)
                }, 2000);
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
            // Altere aqui o valor em ms se quiser que o gráfico atualize mais rápido ou mais devagar
            proximaAtualizacao = setTimeout(() => atualizarGrafico(idLocal, dados, myChart), 2000);
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });

}

var alertas = [];

function alertar(resposta, idLocal, tipo) {
    var valor = Number(resposta[resposta.length - 1].valor);
    console.log(tipo)
    var grauDeAviso = '';

    var limites = {
        muito_alto: 29,
        alto: 27.5,
        ideal: 26,
        baixo: 24,
        muito_baixo: 22
    };

    if (tipo == 'Horta') {
        limites.muito_alto = 400,
            limites.alto = 350,
            limites.ideal = 250,
            limites.baixo = 150,
            limites.muito_baixo = 101
    }

    var classe_temperatura = 'cor-alerta';
    if (valor >= limites.muito_alto) {
        if (tipo == 'Tanque') {
            grauDeAviso = 'perigo quente'
        } else {
            grauDeAviso = 'perigo com muita claridade'
        }
        classe_temperatura = 'cor-alerta perigo-quente';
        grauDeAvisoCor = 'cor-alerta perigo-quente'
        exibirAlerta(valor, idLocal, grauDeAviso, grauDeAvisoCor)
    }
    else if (valor >= limites.alto) {
        if (tipo == 'Tanque') {
            grauDeAviso = 'alerta quente'
        } else {
            grauDeAviso = 'alerta com claridade'
        }
        classe_temperatura = 'cor-alerta alerta-quente';
        grauDeAvisoCor = 'cor-alerta alerta-quente'
        exibirAlerta(valor, idLocal, grauDeAviso, grauDeAvisoCor)
    }
    else if (valor > limites.baixo) {
        removerAlerta(idLocal)
    }
    else if (valor <= limites.muito_baixo) {
        if (tipo == 'Tanque') {
            grauDeAviso = 'perigo frio'
        } else {
            grauDeAviso = 'perigo muito escuro'
        }
        classe_temperatura = 'cor-alerta perigo-frio';
        grauDeAvisoCor = 'cor-alerta perigo-frio'
        exibirAlerta(valor, idLocal, grauDeAviso, grauDeAvisoCor)
    }
    else if (valor <= limites.baixo) {
        if (tipo == 'Tanque') {
            grauDeAviso = 'alerta frio'
        } else {
            grauDeAviso = 'alerta pouca claridade'
        }
        classe_temperatura = 'cor-alerta alerta-frio';
        grauDeAvisoCor = 'cor-alerta alerta-frio'
        exibirAlerta(valor, idLocal, grauDeAviso, grauDeAvisoCor)
    }

    var card;

    if (document.getElementById(`temp_aquario_${idLocal}`) != null) {
        document.getElementById(`temp_aquario_${idLocal}`).innerHTML = valor + "°C";
    }
    if (document.getElementById(`card_${idLocal}`)) {
        card = document.getElementById(`card_${idLocal}`)
        card.className = classe_temperatura;
    }
}

function exibirAlerta(valor, idLocal, grauDeAviso, grauDeAvisoCor) {
    var indice = alertas.findIndex(item => item.idLocal == idLocal);

    if (indice >= 0) {
        alertas[indice] = { idLocal, valor, grauDeAviso, grauDeAvisoCor }
    } else {
        alertas.push({ idLocal, valor, grauDeAviso, grauDeAvisoCor });
    }

    exibirCards();
}

function removerAlerta(idLocal) {
    alertas = alertas.filter(item => item.idLocal != idLocal);
    exibirCards();
}

function exibirCards() {
    alerta.innerHTML = '';

    for (var i = 0; i < alertas.length; i++) {
        var mensagem = alertas[i];
        alerta.innerHTML += transformarEmDiv(mensagem);
    }
}

function transformarEmDiv({ idLocal, valor, grauDeAviso, grauDeAvisoCor }) {
    var dadosLocal = JSON.parse(sessionStorage.LOCAIS).find(item => item.idLocal == idLocal);
    var descricao = dadosLocal.tipo;
    var tipoDado = '';
    var unidadeMedida = '';

    if (descricao == 'Tanque') {
        tipoDado = 'Temperatura';
        unidadeMedida = 'ºC';
        if (idLocal > 1) {
            idLocal -= 1;
        }
    } else if (descricao == 'Horta') {
        tipoDado = 'Luminosidade';
        unidadeMedida = 'Lux';
        if (idLocal > 1) {
            idLocal -= 1;
        }
    }


    return `
    <div class="mensagem-alarme" style="background-color: ${Bakgroundcolor}">
        <div class="informacao">
            <div class="${grauDeAvisoCor}">&#12644;</div> 
            <h3>${descricao} ${idLocal} está em estado de ${grauDeAviso}!</h3>
            <small>${tipoDado} capturada: ${valor} ${unidadeMedida}.</small>   
        </div>
        <div class="alarme-sino"></div>
    </div>
    `;
}
