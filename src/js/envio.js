import { } from './firebase/firebase_cfg.js';

const db = firebase.firestore();

async function showBoxes(box, id) {
    const box_ul = document.querySelector('.box-ul');
    
    const li = document.createElement('li');
    li.setAttribute('data-id', id); // Atribuir ID ao li para fácil identificação

    const nome = document.createElement('span');
    nome.textContent = box.nome;
    li.appendChild(nome);

    const div = document.createElement('div');

    //const i = document.createElement('i');
    //i.setAttribute('class', 'fas fa-eye');
    //i.addEventListener('click', () => showBox(id));

    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('class', 'box-checkbox'); // Atribuir uma classe para fácil seleção

    //div.appendChild(i);
    div.appendChild(checkbox);
    li.appendChild(div);
    box_ul.appendChild(li);
}

async function showBox(boxId) {
    alert("EPA");
}

// Mover as LIs para a ul de resumo ao clicar no botão "Adicionar"
document.getElementById('add_box').addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.box-checkbox:checked'); 
    const resumo_ul = document.getElementById('resumo-ul');

    checkboxes.forEach((checkbox) => {
        const li = checkbox.closest('li'); 
        
        const deleteIcon = document.createElement('i');
        deleteIcon.setAttribute('class', 'fas fa-times delete-icon'); 
        deleteIcon.addEventListener('click', () => moveBackToOriginal(li)); 

        const div = checkbox.parentNode;
        div.replaceChild(deleteIcon, checkbox);
        
        resumo_ul.appendChild(li); 
    });
});

function moveBackToOriginal(li) {
    const box_ul = document.querySelector('.box-ul');
    
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('class', 'box-checkbox'); 

    const deleteIcon = li.querySelector('.delete-icon');
    const div = deleteIcon.parentNode;
    div.replaceChild(checkbox, deleteIcon); 

    box_ul.appendChild(li); 
}

db.collection("box").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added" && change.doc.data().status === 'pendente') {
            console.log("Novo documento adicionado: ", change.doc.data());
            showBoxes(change.doc.data(), change.doc.id);
        }
    });
});

document.getElementById('encomenda-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const origin = document.getElementById('origem').textContent.trim();
    const destination = document.getElementById('destino').textContent.trim();

    if (origin === '' || destination === '') {
        alert('Selecione uma origem e um destino');
        return;
    }
    if (origin === destination) {
        alert('Origem e destino iguais');
        return;
    }

    if(!document.querySelectorAll('#resumo-ul li').length) {
        alert('Selecione pelo menos um box');
        return;
    }

    const boxes = [];
    document.querySelectorAll('#resumo-ul li').forEach(li => {
        const boxId = li.getAttribute('data-id');
        if (boxId) {
            boxes.push(boxId);
        }
    });

    const informacoes = {
        nome_motorista: document.getElementById('nome_motorista').value,
        placa_veiculo: document.getElementById('placa-veiculo').value,
        empresa: document.getElementById('empresa').value,
        cpf_motorista: document.getElementById('cpf-motorista').value,
        data_envio: document.getElementById('data-motorista').value,
        destinatario: document.getElementById('destinatario').value,
        origem: origin,
        link_rota: document.getElementById('link-rota').value,
        destino: destination,
        boxes: boxes 
    };

    console.log("Informações da encomenda: ");
    console.log(informacoes);

    const db = firebase.firestore();

    try {
        await db.collection("envios").add(informacoes);
        alert("Encomenda enviada com sucesso");

        // Atualizar status das boxes para 'enviado'
        const updatePromises = boxes.map(boxId => 
            db.collection("box").doc(boxId).update({
                status: 'enviado'
            })
        );

        await Promise.all(updatePromises);
        console.log("Todas as boxes foram atualizadas para 'enviado'.");

    } catch (error) {
        console.error("Erro ao enviar encomenda ou atualizar boxes: ", error);
        alert("Erro ao enviar encomenda. Tente novamente.");
    }
});
