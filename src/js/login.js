import { login, verificarUser, resetarSenha } from "./auth_function.js" //Importa as funções do arquivo firebase_config



//Função de login

const form = document.querySelector('#form-login');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
})

//Redefinir senha

const esqueceu_btn = document.querySelector('#forgot_password');

esqueceu_btn.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;

    resetarSenha(email);
});

//Verificar user
if(verificarUser()) {
    window.location.href = "./src/pages/main_screen.html";
}