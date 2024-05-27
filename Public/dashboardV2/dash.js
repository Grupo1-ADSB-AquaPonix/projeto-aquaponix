window.onload = exibirAquariosDoUsuario();

function exibirAquariosDoUsuario() {

    const graficos = JSON.parse(sessionStorage.LOCAIS);

    var cont = 1;
    for(var i = 0; i < graficos.length; i++){
        
        var local = graficos[i];
        if(local.tipo == "Tanque"){
            document.getElementById('graficos').innerHTML += `
                <div class="especificacoes-grafico">
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
        } else if(local.tipo == "Horta"){
            document.getElementById('graficos').innerHTML += `
                <div class="especificacoes-grafico">
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

        if(tipo == "Tanque"){
            dadosGrafico.datasets[0].data.push(dadosLocal[i].valor);
            dadosGrafico.datasets[1].data.push(29);
            dadosGrafico.datasets[2].data.push(24);
        } else if(tipo == "Horta"){
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
    if(tipo == "Tanque"){
        vlMin = 15;
        vlMax = 35;
    } else if(tipo == "Horta"){
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

    setTimeout(() => atualizarGrafico(idLocal, dadosGrafico, myChart), 2000);
}

function atualizarGrafico(idLocal, dados, myChart) {

    fetch(`/medidas/ultima-medida/${idLocal}`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (novoRegistro) {

                // obterDadosGrafico(idLocal);
                // alertar(novoRegistro, idLocal);
                console.log(`Dados recebidos: ${JSON.stringify(novoRegistro)}`);
                console.log(`Dados atuais do gráfico:`);
                console.log(dados);

                // let avisoCaptura = document.getElementById(`avisoCaptura${idLocal}`)
                // avisoCaptura.innerHTML = ""


                if (novoRegistro[0].valor == dados.labels[dados.labels.length - 1]) {
                    console.log("---------------------------------------------------------------")
                    console.log("Como não há dados novos para captura, o gráfico não atualizará.")
                    // avisoCaptura.innerHTML = "<i class='fa-solid fa-triangle-exclamation'></i> Foi trazido o dado mais atual capturado pelo sensor. <br> Como não há dados novos a exibir, o gráfico não atualizará."
                    console.log("Horário do novo dado capturado:")
                    console.log(novoRegistro[0].valor)
                    console.log("Horário do último dado capturado:")
                    console.log(dados.labels[dados.labels.length - 1])
                    console.log("---------------------------------------------------------------")
                } else {
                    // tirando e colocando valores no gráfico
                    dados.labels.shift(); // apagar o primeiro momento
                    dados.labels.push(novoRegistro[0].data_coleta); // incluir um novo momento

                    dados.datasets[0].data.shift();  // apaga o primeiro registro da medida
                    dados.datasets[0].data.push(novoRegistro[0].valor); // incluir uma nova medida de umidade
                    
                    dados.datasets[1].data.push(29); // adiciona a linha vermelha que representa o valor maximo
                    dados.datasets[2].data.push(24); // adiciona a linha azul que representa o valor minimo
                    
                    myChart.update();
                }

                // Altere aqui o valor em ms se quiser que o gráfico atualize mais rápido ou mais devagar
                proximaAtualizacao = setTimeout(() => atualizarGrafico(idLocal, dados, myChart), 2000);
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