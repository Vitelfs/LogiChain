
document.querySelector('.back-button').addEventListener('click', () => {
    const popup = document.querySelector('.popup-box');
    popup.style.display = 'block';
})
window.addEventListener("click", (event) => {
    const popup = document.querySelector(".popup-box");
    if (event.target === popup) {
        popup.style.display = "none";
    }
});
document.getElementById("close").addEventListener("click", () => {
    const popup = document.querySelector('.popup-box');
    popup.style.display = 'none';
});
