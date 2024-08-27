
import { } from '../js/firebase/firebase_cfg.js';

const db = firebase.firestore();

async function getProdutoReferenciado(boxId) {
try {
    // Recupere o documento da coleção 'box'
    const boxRef = db.collection('box').doc(boxId);
    const boxDoc = await boxRef.get();

    if (!boxDoc.exists) {
    console.log('Nenhum documento encontrado na coleção box.');
    return;
    }

    // Acesse o campo de referência
    const produtoRef = boxDoc.data().produtos; // Substitua 'produtoReferencia' pelo nome do campo de referência

    if (produtoRef) {
    // Recupere o documento referenciado
    const produtoDoc = await produtoRef.get();

    if (!produtoDoc.exists) {
        console.log('Nenhum documento encontrado na coleção produtos.');
        return;
    }

    // Acesse os dados do documento referenciado
    console.log('Dados do Produto:', produtoDoc.data());
    } else {
    console.log('Nenhuma referência encontrada no documento box.');
    }
} catch (error) {
    console.error('Erro ao acessar os dados do produto referenciado:', error);
}
}

// Exemplo de uso
console.log(getProdutoReferenciado("UF6cUKOXzwHe6h7HqNra"));
