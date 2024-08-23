import { auth, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged } from "../js/firebase/firebase_config.js";

function logout() {
    signOut(auth).then(() => {
        window.location.href = "../../index.html";
    }).catch((error) => {
        console.error("Erro ao deslogar: ", error);
    });
}

function verificarUser() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            if (window.location.pathname !== "/index.html") {
                window.location.href = "../../index.html";
            }
        } else {
            console.log("Usuário autenticado:", user.email);
            document.getElementById("user-name").textContent = user.email;
        }
    });
}

function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Login efetuado com sucesso!");
            window.location.href = "./src/pages/main_screen.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === "auth/wrong-password") {
                alert("Senha Incorreta!");
            } else if (errorCode === "auth/user-not-found") {
                alert("Usuário não encontrado!");
            } else {
                alert("Erro ao efetuar login: " + error.message);
            }
        });
}

function resetarSenha(email) {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Email enviado com sucesso!");
        })
        .catch((error) => {
            alert("Erro ao enviar email de redefinição: " + error.message);
        });
}

export { login, logout, resetarSenha, verificarUser };
