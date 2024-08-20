import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, deleteDoc  } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyC3U7YjxCDJCmjv_WeCmRr-MWk3m8PRi2Q",
  authDomain: "logichain-8a4e5.firebaseapp.com",
  projectId: "logichain-8a4e5",
  storageBucket: "logichain-8a4e5.appspot.com",
  messagingSenderId: "940006643520",
  appId: "1:940006643520:web:e932b7d8b591c40be18ca5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export { signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signOut }

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
  const querySnapshotClientes = await getDocs(clients);
  return {
      clientes: querySnapshotClientes
  };
}
