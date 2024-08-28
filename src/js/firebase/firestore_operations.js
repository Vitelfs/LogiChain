import { db } from './firebase_config.js';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc,
  updateDoc,
  runTransaction,
  Timestamp,
  setDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

export const products = collection(db, "produtos");
export const boxes = collection(db, "box");

export async function updateProductQuantity(productId, quantityToRemove) {
  const productRef = doc(db, "produtos", productId);
  
  try {
    await runTransaction(db, async (transaction) => {
      const productDoc = await transaction.get(productRef);
      if (!productDoc.exists()) {
        throw "O produto não existe!";
      }
      
      const currentQuantity = productDoc.data().quantidade;
      const newQuantity = currentQuantity - quantityToRemove;
      
      if (newQuantity < 0) {
        throw "Quantidade insuficiente de produto!";
      }
      
      transaction.update(productRef, { quantidade: newQuantity });
    });
    console.log(`Quantidade do produto ${productId} atualizada com sucesso.`);
  } catch (error) {
    console.error("Erro ao atualizar a quantidade do produto:", error);
    throw error;
  }
}

export async function exportProducts() {
  const querySnapshot = await getDocs(products);
  return querySnapshot;
}

export function addDocuments(colecao, dados) {
  return addDoc(collection(db, colecao), dados);
}

export function editDocuments(colecao, docId, novosDados) {
  const docRef = doc(db, colecao, docId);
  return setDoc(docRef, novosDados, { merge: true });
}

export function deleteDocuments(colecao, docId) {
  const docRef = doc(db, colecao, docId);
  return deleteDoc(docRef);
}

export async function exportDocs() {
  const querySnapshotProdutos = await getDocs(products);
  return {
    produtos: querySnapshotProdutos,
  };
}

export async function exportBoxes() {
  const querySnapshot = await getDocs(boxes);
  return querySnapshot;
}

export async function createBox(boxData) {
  const { nome, descricao, produtos } = boxData;

  const newBoxRef = await addDoc(boxes, {
    nome,
    descricao,
    status: "pendente",
    produtos: produtos.map((produto) => ({
      id: produto.productId,
      quantidade: produto.quantity,
    })),
  });

  return newBoxRef.id;
}

export { getDoc, doc, Timestamp };