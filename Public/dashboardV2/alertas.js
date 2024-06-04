var alertas = [];

function alertar(resposta, idLocal, tipo) {
    var valor = resposta[resposta.length - 1].valor;

    var grauDeAviso = '';

    var limites = {
        muito_alto: 29,
        alto: 27,
        ideal: 26,
        baixo: 25,
        muito_baixo: 24
    };

    if (tipo == 'horta') {
        limites.muito_alto = 400,
            limites.alto = 300,
            limites.ideal = 250,
            limites.baixo = 201,
            limites.muito_baixo = 101
    }

    var classe_temperatura = 'cor-alerta';

    if (temp >= limites.muito_alto) {
        classe_temperatura = 'cor-alerta perigo-quente';
        grauDeAviso = 'perigo quente'
        grauDeAvisoCor = 'cor-alerta perigo-quente'
        exibirAlerta(temp, idLocal, grauDeAviso, grauDeAvisoCor)
    }
    else if (temp < limites.muito_alto && temp >= limites.alto) {
        classe_temperatura = 'cor-alerta alerta-quente';
        grauDeAviso = 'alerta quente'
        grauDeAvisoCor = 'cor-alerta alerta-quente'
        exibirAlerta(temp, idLocal, grauDeAviso, grauDeAvisoCor)
    }
    else if (temp < limites.alto && temp > limites.baixo) {
        classe_temperatura = 'cor-alerta ideal';
        removerAlerta(idLocal);
    }
    else if (temp <= limites.baixo && temp > limites.muito_baixo) {
        classe_temperatura = 'cor-alerta alerta-frio';
        grauDeAviso = 'alerta frio'
        grauDeAvisoCor = 'cor-alerta alerta-frio'
        exibirAlerta(temp, idLocal, grauDeAviso, grauDeAvisoCor)
    }
    else if (temp <= limites.muito_baixo) {
        classe_temperatura = 'cor-alerta perigo-frio';
        grauDeAviso = 'perigo frio'
        grauDeAvisoCor = 'cor-alerta perigo-frio'
        exibirAlerta(temp, idLocal, grauDeAviso, grauDeAvisoCor)
    }

    var card;

    if (document.getElementById(`temp_aquario_${idLocal}`) != null) {
        document.getElementById(`temp_aquario_${idLocal}`).innerHTML = temp + "°C";
    }
    if (document.getElementById(`card_${idLocal}`)) {
        card = document.getElementById(`card_${idLocal}`)
        card.className = classe_temperatura;
    }
}

function exibirAlerta(temp, idLocal, grauDeAviso, grauDeAvisoCor) {
    var indice = alertas.findIndex(item => item.idLocal == idLocal);

    if (indice >= 0) {
        alertas[indice] = { idLocal, temp, grauDeAviso, grauDeAvisoCor }
    } else {
        alertas.push({ idLocal, temp, grauDeAviso, grauDeAvisoCor });
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

function transformarEmDiv({ idLocal, temp, grauDeAviso, grauDeAvisoCor }) {

    var descricao = JSON.parse(sessionStorage.AQUARIOS).find(item => item.id == idLocal).descricao;
    return `
    <div class="mensagem-alarme">
        <div class="informacao">
            <div class="${grauDeAvisoCor}">&#12644;</div> 
            <h3>${descricao} está em estado de ${grauDeAviso}!</h3>
            <small>Temperatura capturada: ${temp}°C.</small>   
        </div>
        <div class="alarme-sino"></div>
    </div>
    `;
}
