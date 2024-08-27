import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc,
  runTransaction,
  Timestamp 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3U7YjxCDJCmjv_WeCmRr-MWk3m8PRi2Q",
  authDomain: "logichain-8a4e5.firebaseapp.com",
  projectId: "logichain-8a4e5",
  storageBucket: "logichain-8a4e5.appspot.com",
  messagingSenderId: "940006643520",
  appId: "1:940006643520:web:e932b7d8b591c40be18ca5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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

export const products = collection(db, "produtos");

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

export const boxes = collection(db, "box");

export async function exportBoxes() {
  const querySnapshot = await getDocs(boxes);
  return querySnapshot;
}

export async function createBox(boxData) {
  const { nome, descricao, produtos } = boxData;

  // Cria a box no Firebase com todos os dados necessários
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
