const express = require('express');
const router = express.Router();
const { db } = require('./firebase-config'); 
router.get('/boxes', async (req, res) => {
    try {
        const boxesSnapshot = await db.collection('boxes').get();
        const boxes = [];

        boxesSnapshot.forEach((doc) => {
            boxes.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(boxes);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar boxes', error });
    }
});

module.exports = router;

router.post('/boxes/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const boxRef = db.collection('boxes').doc(id);
        await boxRef.update({ status });

        res.status(200).json({ message: 'Status da box atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar o status da box', error });
    }
});
