import { verificarUser, logout } from "./auth_function.js" //Importa as funções do arquivo firebase_config

const pesquisa_input = document.getElementById("search");

pesquisa_input.addEventListener("click", (event) => {
    const popup = document.querySelector('.popup-search');
    popup.style.display = 'block';
    const button = document.querySelector('#btn_search');
    button.style.zIndex = '1001';
});

window.addEventListener("click", (event) => {
    const popup = document.querySelector(".popup-search");
    if (event.target === popup) {
        popup.style.display = "none";
    }
});


//Logout

const logout_btn = document.getElementById("btn_deslogar");

logout_btn.addEventListener("click", (event) => {
    
    if(confirm("Tem certeza que deseja sair?")) 
        logout();

});

verificarUser();