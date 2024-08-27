import { } from './firebase/firebase_cfg.js';


const db = firebase.firestore();

async function showBoxes(box,id) {
    
    const box_ul = document.querySelector('.box-ul');
    
    const li = document.createElement('li');

    const nome = document.createElement('span');
    nome.textContent = box.nome;
    li.appendChild(nome);

    const div = document.createElement('div');

    const i = document.createElement('i');
    i.setAttribute('class', 'fas fa-eye');
    i.addEventListener('click', () => showBox(id));

    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');

    div.appendChild(i);
    div.appendChild(checkbox);
    li.appendChild(div);
    box_ul.appendChild(li);
    
}

async function showBox(boxId) {
    alert("EPA")
}


db.collection("box").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added" && change.doc.data().status === 'pendente') {
            console.log("Novo documento adicionado: ", change.doc.data());
            showBoxes(change.doc.data(), change.doc.id);
        }
    });
});