const sidebar = document.getElementById('sidebar');
const meobileMenu = document.getElementsByClassName('mobileMenu');
const conteudo = document.getElementById('conteudo');
const menu = document.getElementById('menuBarra');
const barraMobile = document.getElementById('barraMobile');
const logoTitle = document.getElementById('logoTitle');

menu.addEventListener('click', function(e){
    menu.classList.toggle('open');
    if (sidebar.style.width == "330px")
    {
        sidebar.style.width = "10px";
        menu.classList.remove('open');
        logoTitle.style.display = "none";
    }

    else
    {
        sidebar.style.width = "330px";
        setTimeout(appearLogo, 200);
    }

    window.addEventListener('click', function(e){
        if (!sidebar.contains(e.target) && (!document.getElementById('logo').contains(e.target))){
        sidebar.style.width = "10px";
        menu.classList.remove('open');
      } 
    });
});

function appearLogo(){
    logoTitle.style.display = "flex";
}