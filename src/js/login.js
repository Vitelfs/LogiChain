import { auth, signInWithEmailAndPassword, sendPasswordResetEmail } from "./firebase/firebase_config.js"; //Importa as funções do arquivo firebase_config



//Função de login
function login () {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password) //Autenticar o login com base nas contas registradas no auth
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            
            alert("Login efetuado com sucesso!");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            if(errorCode == "auth/wrong-password"){
                alert("Senha Incorreta!");
            }
            if(errorCode == "auth/user-not-found"){
                alert("Usuário não encontrado!");
            }
        });
}

const form = document.querySelector('#form-login');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    login();
})

//Redefinir senha

const esqueceu_btn = document.querySelector('#forgot_password');

esqueceu_btn.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    if(email != ""){
        sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Email enviado com sucesso!");
        });
    }
})