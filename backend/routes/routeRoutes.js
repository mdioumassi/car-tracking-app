const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

router.post('/', routeController.create);
router.get('/', routeController.findAll);
router.get('/:id', routeController.findOne);
router.put('/:id', routeController.update);
router.delete('/:id', routeController.delete);

module.exports = router;