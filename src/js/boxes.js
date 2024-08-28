import {
  exportProducts,
  createBox,
  products,
  updateProductQuantity,
  getDoc,
  doc
} from "../js/firebase/firestore_operations.js";
import { db } from "../js/firebase/firebase_config.js";

const createBoxBtn = document.getElementById("create-box-btn");
const modal = document.getElementById("create-box-modal");
const closeBtn = document.querySelector(".close-btn");
const createBoxForm = document.getElementById("create-box-form");
const modalProductList = document.getElementById("modal-product-list");
let selectedProducts = [];

const productList = document.getElementById("product-list");
const productSearch = document.getElementById("product-search");
const productFilter = document.getElementById("product-filter");

// Função para abrir o modal
createBoxBtn.addEventListener("click", async () => {
  modal.style.display = "block";
  await loadProductsIntoModal();
});

// Função para fechar o modal
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Função para carregar produtos no modal
async function loadProductsIntoModal() {
  const productsSnapshot = await exportProducts();
  modalProductList.innerHTML = `<h3>Produtos Disponíveis</h3><table>
        <thead>
            <tr>
                <th>Nome do Produto</th>
                <th>Quantidade Disponível</th>
                <th>Quantidade</th>
                <th>Ação</th>
            </tr>
        </thead>
        <tbody id="modal-product-list-body"></tbody>
    </table>`;

  const productListBody = document.getElementById("modal-product-list-body");

  productsSnapshot.forEach((doc) => {
    const product = doc.data();
    const productRow = document.createElement("tr");

    productRow.innerHTML = `
            <td>${product.nome}</td>
            <td>${product.quantidade}</td>
            <td><input type="number" id="qty-${doc.id}" min="0" max="${product.quantidade}" value="0"></td>
            <td><button class="add-to-box-btn" data-id="${doc.id}">Adicionar</button></td>
        `;

    productListBody.appendChild(productRow);
  });

  document.querySelectorAll(".add-to-box-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.target.getAttribute("data-id");
      const quantityInput = document.getElementById(`qty-${productId}`);
      const quantity = parseInt(quantityInput.value, 10);

      if (quantity > 0 && quantity <= parseInt(quantityInput.max, 10)) {
        const existingProductIndex = selectedProducts.findIndex(
          (p) => p.productId === productId
        );

        if (existingProductIndex !== -1) {
          selectedProducts[existingProductIndex].quantity += quantity;
        } else {
          selectedProducts.push({ productId, quantity });
        }

        quantityInput.value = "1";
        quantityInput.max = parseInt(quantityInput.max, 10) - quantity;
        e.target.textContent = "Adicionado";
        e.target.disabled = true;
      } else {
        alert("Quantidade inválida!");
      }
    });
  });
}

// Função para finalizar a criação da box
createBoxForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const boxName = document.getElementById("box-name").value;
  const boxDescription = document.getElementById("box-description").value;

  if (boxName && boxDescription && selectedProducts.length > 0) {
    try {
      const boxData = {
        nome: boxName,
        descricao: boxDescription,
        produtos: selectedProducts
      };
      const newBoxId = await createBox(boxData);
      
      // Atualizar as quantidades dos produtos no Firebase
      for (const product of selectedProducts) {
        await updateProductQuantity(product.productId, product.quantity);
      }
      
      alert("Box criada com sucesso! ID: " + newBoxId);
      modal.style.display = "none";
      // Limpar os campos e a lista de produtos selecionados
      document.getElementById("box-name").value = "";
      document.getElementById("box-description").value = "";
      selectedProducts = [];
      // Recarregar os produtos no modal
      await loadProductsIntoModal();
    } catch (error) {
      console.error("Erro ao criar a box ou atualizar quantidades:", error);
      alert("Erro ao criar a box ou atualizar quantidades: " + error.message);
    }
  } else {
    alert(
      "Por favor, preencha todos os campos e adicione pelo menos um produto."
    );
  }
});

// Função para carregar produtos na tela principal
async function loadAvailableProducts() {
  const productsSnapshot = await exportProducts();
  productList.innerHTML = "";

  productsSnapshot.forEach((doc) => {
    const product = doc.data();
    const productRow = document.createElement("tr");

    productRow.innerHTML = `
      <td>${product.nome}</td>
      <td>${product.quantidade}</td>
      <td><button class="view-product-btn" data-id="${doc.id}">Ver Detalhes</button></td>
    `;

    productList.appendChild(productRow);
  });

  // Adicionar event listeners para os botões "Ver Detalhes"
  document.querySelectorAll('.view-product-btn').forEach(button => {
    button.addEventListener('click', viewProductDetails);
  });
}

// Função para exibir detalhes do produto
async function viewProductDetails(event) {
  const productId = event.target.getAttribute('data-id');
  const productDoc = await getDoc(doc(db, "produtos", productId));
  
  if (productDoc.exists()) {
    const productData = productDoc.data();
    alert(`Detalhes do Produto:
Nome: ${productData.nome}
Quantidade: ${productData.quantidade}
Descrição: ${productData.descricao || 'Não disponível'}
Preço: R$ ${productData.preco || 'Não disponível'}
`);
  } else {
    alert("Produto não encontrado!");
  }
}

// Função para filtrar produtos
function filterProducts() {
  const searchTerm = productSearch.value.toLowerCase();
  const filterValue = productFilter.value;

  const rows = productList.getElementsByTagName("tr");

  for (const row of rows) {
    const productName = row.cells[0].textContent.toLowerCase();
    const quantity = parseInt(row.cells[1].textContent);

    const matchesSearch = productName.includes(searchTerm);
    const matchesFilter = 
      filterValue === "all" ||
      (filterValue === "in-stock" && quantity > 0) ||
      (filterValue === "out-of-stock" && quantity === 0);

    row.style.display = matchesSearch && matchesFilter ? "" : "none";
  }
}

// Adicionar event listeners para pesquisa e filtro
productSearch.addEventListener("input", filterProducts);
productFilter.addEventListener("change", filterProducts);

// Carregar produtos disponíveis ao iniciar a página
document.addEventListener("DOMContentLoaded", loadAvailableProducts);
