window.onload = acessoUserIA();

function acessoUserIA(){

    if(sessionStorage.ID_USUARIO != undefined){
        div_formularioSuporte.style.display = 'none';
        div_mensagemIA.style.display = 'none';
    } else{
        div_formularioSuporte.innerHTML = `
            <h1>CONVERSE COM NOSSO SUPORTE - Bob IA</h1>
            <div class="box-formulario">
                <input type="text" class="txt-mensagem" placeholder="Digite sua mensagem/dúvida">
                <button class="btn-enviar">ENVIAR</button>
            </div>
        `;
        div_mensagemIA.innerHTML = `
            <span class="span-resposta-ia">
                <!-- A resposta que a IA for gerar irá aparecer aqui -->
                A resposta aparecerá aqui &uparrow;
            </span>
        `;
    }
}