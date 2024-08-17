import { auth, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged } from "../js/firebase/firebase_config.js";

function logout() {
    signOut(auth).then(() => {
        window.location.href = "../../index.html";
    }).catch((error) => {
        console.log(error);
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
            return true;
        }
    });
}



function login (email, password) {

    signInWithEmailAndPassword(auth, email, password) 
        .then((userCredential) => {
            const user = userCredential.user;
            
            alert("Login efetuado com sucesso!");

            window.location.href = "./src/pages/main_screen.html";
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

function resetarSenha(email){
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("Email enviado com sucesso!");
        });
}

export { login, logout, resetarSenha, verificarUser }