const sidebar = document.getElementById('sidebar');
const meobileMenu = document.getElementsByClassName('mobileMenu');
const conteudo = document.getElementById('conteudo');
const menu = document.getElementById('menuBarra');
const barraMobile = document.getElementById('barraMobile');
const logoTitle = document.getElementById('logoTitle');
const express = require('express');
const router = express.Router();
const db = require('../firebase-config');

menu.addEventListener('click', function(e){
    menu.classList.toggle('open');
    if (sidebar.style.width == "330px")
    {
        sidebar.style.width = "10px";
        menu.classList.remove('open');
        logoTitle.style.display = "none";
    }

    else
    {
        sidebar.style.width = "330px";
        setTimeout(appearLogo, 200);
    }

    window.addEventListener('click', function(e){
        if (!sidebar.contains(e.target) && (!document.getElementById('logo').contains(e.target))){
        sidebar.style.width = "10px";
        menu.classList.remove('open');
      } 
    });
});

function appearLogo(){
    logoTitle.style.display = "flex";
}

router.post('/add', async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const productRef = db.collection('products').doc(productId);
        const productSnapshot = await productRef.get();

        if (!productSnapshot.exists) {
            return res.status(400).json({ message: 'Produto não encontrado' });
        }

        const product = productSnapshot.data();

        if (product.quantity < quantity) {
            return res.status(400).json({ message: 'Quantidade insuficiente' });
        }

        await productRef.update({
            quantity: product.quantity - quantity
        });

        res.status(200).json({ message: 'Produto adicionado à box com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar produto', error });
    }
});

router.post('/remove', async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const productRef = db.collection('products').doc(productId);
        const productSnapshot = await productRef.get();

        if (!productSnapshot.exists) {
            return res.status(400).json({ message: 'Produto não encontrado' });
        }

        const product = productSnapshot.data();

        await productRef.update({
            quantity: product.quantity + quantity
        });

        res.status(200).json({ message: 'Produto removido da box com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover produto', error });
    }
});

module.exports = router;
