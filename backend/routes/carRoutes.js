const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.post('/', carController.create);
router.get('/', carController.findAll);
router.get('/:id', carController.findOne);
router.put('/:id', carController.update);
router.delete('/:id', carController.delete);

module.exports = router;