const express = require('express');
const router = express.Router();
const positionController = require('../controllers/positionController');

router.post('/', positionController.create);
router.get('/', positionController.findAll);
router.get('/:id', positionController.findOne);
router.put('/:id', positionController.update);
router.delete('/:id', positionController.delete);

module.exports = router;