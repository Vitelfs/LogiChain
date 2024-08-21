import { Timestamp, exportProducts, addDocuments, editDocuments, deleteDocuments } from "./firebase/firebase_config.js";

const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#m-nome');
const sFabricante = document.querySelector('#m-fabricante');
const sQuantidade = document.querySelector('#m-quantidade');
const sPesoUnd = document.querySelector('#m-pesound');
const sPrecoUnd = document.querySelector('#m-precound');
const sValidade = document.querySelector('#m-validade');
const sDesc = document.querySelector('#m-desc');
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
      const dataValidade = item.validade;

      if (dataValidade && dataValidade.seconds !== undefined) {
        const data = new Date(dataValidade.seconds * 1000);
        const dataFormatada = data.toISOString().split('T')[0];
        
        sNome.value = item.nome;
        sFabricante.value = item.fabricante;
        sQuantidade.value = item.quantidade;
        sPesoUnd.value = item.pesound;
        sPrecoUnd.value = item.precound;
        sValidade.value = dataFormatada;
        sDesc.value = item.descricao;
      } else {
        console.error('Campo validade está incorreto:', dataValidade);
        sValidade.value = '';
      }
      itemId = id;
    }
  } else {
    sNome.value = '';
    sFabricante.value = '';
    sQuantidade.value = '';
    sPesoUnd.value = '';
    sPrecoUnd.value = '';
    sValidade.value = '';
    sDesc.value = '';
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

  if (sNome.value === '' || sFabricante.value === '' || sQuantidade.value === '' || sPesoUnd.value === '' || sPrecoUnd.value === '' || sValidade.value === '' || sDesc.value === '') {
    return;
  }

  const dataSelecionada = sValidade.value;
  const data = new Date(dataSelecionada);
  const dataTimestamp = Timestamp.fromDate(data);

  const newItem = {
    nome: sNome.value,
    fabricante: sFabricante.value,
    quantidade: sQuantidade.value,
    pesound: sPesoUnd.value,
    precound: sPrecoUnd.value,
    validade: dataTimestamp,
    descricao: sDesc.value
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

  const querySnapshot = await exportProducts();
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
        <button class="editBtn"><img class="icon-prod" src="../img/eye.png"/></button>
      </td>
      <td class="acao">
        <button class="deleteBtn"><i class='bx bx-trash'></i></button>
      </td>
    `;
    tbody.appendChild(tr);

    tr.querySelector('.editBtn').addEventListener('click', () => editItem(item.id));
    tr.querySelector('.deleteBtn').addEventListener('click', () => deleteItem(item.id));
  });
}

async function getItemById(id) {
  const querySnapshot = await exportProducts();
  const item = querySnapshot.docs.find(doc => doc.id === id);
  return item ? { id: item.id, ...item.data() } : null;
}

loadItens();
