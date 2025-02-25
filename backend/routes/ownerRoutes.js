const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');

router.post('/', ownerController.create);
router.get('/', ownerController.findAll);
router.get('/:id', ownerController.findOne);
router.put('/:id', ownerController.update);
router.delete('/:id', ownerController.delete);

module.exports = router;