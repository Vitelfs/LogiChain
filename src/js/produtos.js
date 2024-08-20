import { exportClients, addDocuments, editDocuments, deleteDocuments } from "./firebase/firebase_config";

const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#m-nome');
const sFabricante = document.querySelector('#m-cidade');
const sQuantidade = document.querySelector('#m-email');
const sPesoUnd = document.querySelector('#m-telefone');
const sPrecoUnd = document.querySelector('#m-cpf');
const btnSalvar = document.querySelector('#btnSalvar');
const addNew = document.querySelector('#new');

let itemId;

async function openModal(edit = false, id = null) {
  modal.classList.add('active');

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  };

  if (edit && id !== null) {
    const item = await getItemById(id);
    if (item) {
      sNome.value = item.nome;
      sFabricante.value = item.fabricante;
      sQuantidade.value = item.quantidade;
      sPesoUnd.value = item.pesound;
      sPrecoUnd.value = item.precound;
      itemId = id;
    }
  } else {
    sNome.value = '';
    sFabricante.value = '';
    sQuantidade.value = '';
    sPesoUnd.value = '';
    sPrecoUnd.value = '';
    itemId = null;
  }
}

addNew.onclick = () => openModal();

async function editItem(id) {
  openModal(true, id);
}

async function deleteItem(id) {
  if (confirm("Confirmar a remoção?")) {
    await deleteDocuments('produtos', id);
    await loadItens();
  }
}

async function insertItem(item) {
  await addDocuments('produtos', item); 
  await loadItens();
}

async function updateItem(item) {
  await editDocuments('produtos', itemId, item);
  await loadItens();
}

btnSalvar.onclick = async (e) => {
  e.preventDefault();

  if (sNome.value == '' || sFabricante.value == '' || sQuantidade.value == '' || sPesoUnd.value == '' || sPrecoUnd.value == '') {
    return;
  }

  if (!validarCPF(sPrecoUnd.value)) {
    alert('CPF inválido. Por favor, insira um CPF válido.');
    return;
  }

  const newItem = {
    nome: sNome.value,
    fabricante: sFabricante.value,
    quantidade: sQuantidade.value,
    pesound: sPesoUnd.value,
    precound: sPrecoUnd.value
  };

  if (itemId) {
    newItem.id = itemId;
    await updateItem(newItem);
  } else {
    await insertItem(newItem);
  }

  modal.classList.remove('active');
}

async function loadItens() {
  tbody.innerHTML = '';

  const querySnapshot = await exportClients('produtos');
  const itens = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  itens.forEach((item, index) => {
    let tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.fabricante}</td>
      <td>${item.quantidade}</td>
      <td>${item.pesound}</td>
      <td>${item.precound}</td>
      <td class="acao">
        <button class="visuBtn"><i class='bx bx-visu' ></i></button>
      </td>
      <td class="acao">
        <button class="editBtn"><i class='bx bx-edit' ></i></button>
      </td>
      <td class="acao">
        <button class="deleteBtn"><i class='bx bx-trash'></i></button>
      </td>
    `;
    tbody.appendChild(tr);

    tr.querySelector('.visuBtn').addEventListener('click', () => visuItem(item.id));
    tr.querySelector('.editBtn').addEventListener('click', () => editItem(item.id));
    tr.querySelector('.deleteBtn').addEventListener('click', () => deleteItem(item.id));
  });
}

async function getItemById(id) {
  const querySnapshot = await exportClients('produtos');
  const item = querySnapshot.docs.find(doc => doc.id === id);
  return item ? { id: item.id, ...item.data() } : null;
}

loadItens();
