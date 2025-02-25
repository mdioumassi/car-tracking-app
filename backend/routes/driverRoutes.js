const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

router.post('/', driverController.create);
router.get('/', driverController.findAll);
router.get('/:id', driverController.findOne);
router.put('/:id', driverController.update);
router.delete('/:id', driverController.delete);

module.exports = router;