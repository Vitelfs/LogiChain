import { login, resetarSenha, auth } from "./auth_function.js"
import { onAuthStateChanged } from "./firebase/firebase_config.js"

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

function verificarUser() {
    
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            if (window.location.pathname !== "/index.html") {
                window.location.href = "../../index.html";
            }
        } else {
            console.log("Usuário autenticado:", user.email);
            window.location.href = "./src/pages/products.html";
        }
    });
}
verificarUser();