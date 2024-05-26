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
            cont++
        }
    }
    obterDadosGrafico(graficos[0], graficos[1]);
}

async function obterDadosGrafico(dataTanque, dataHorta) {

    await fetch(`/medidas/buscar/${dataTanque.idLocal}/1`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                resposta.reverse();

                plotarGrafico(resposta, dataTanque.tipo, dataTanque.idLocal);
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    });
    await fetch(`/medidas/buscar/${dataHorta.idLocal}/2`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {
                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                resposta.reverse();
                console.log(resposta)

                console.log()
                plotarGrafico(resposta, dataHorta.tipo, dataHorta.idLocal);
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
    new Chart(
        grafico,
        configChart
    );

    // setTimeout(() => atualizarGrafico(idAquario, dados, myChart), 2000);
}