async function validaLogin() {
    var email = document.getElementById('input_email').value;
    var senha = document.getElementById('input_senha').value;

    // if((email.indexOf('@') == -1 || email.indexOf(".") == -1) || senha.length < 6){
    //     alert('Email ou senha incorretos')
    // }
    if(email == "" || senha == ""){
        alert('Preencha todos os campos para continuar')
    }
    else {

        let url = "/usuarios/autenticar";
        await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                emailUser: email,
                senhaUser: senha
            })
        }).then((res) => {

            if(res.ok){
                res.json().then((data) => {
                    console.log(data)
                })

                // setTimeout(() => {
                //     window.location.href = ('../dashboard/painel.html')
                // }, 3000)
            } else{
                res.text().then((err) => {
                    console.error(err);
                })
            }
        })

    }
}