async function validaLogin() {
    var email = document.getElementById('input_email').value;
    var senha = document.getElementById('input_senha').value;

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

                setTimeout(() => {
                    window.location.href = ('../dashboardTanque/dashboardTanque.html')
                }, 2000)
            } else{
                res.text().then((err) => {
                    console.error(err);
                })
            }
        })

    }
}