const express = require('express');
const router = express.Router();

const ownerRoutes = require('./ownerRoutes');
const driverRoutes = require('./driverRoutes');
const carRoutes = require('./carRoutes');
const routeRoutes = require('./routeRoutes');
const positionRoutes = require('./positionRoutes');

router.use('/owners', ownerRoutes);
router.use('/drivers', driverRoutes);
router.use('/cars', carRoutes);
router.use('/routes', routeRoutes);
router.use('/positions', positionRoutes);

module.exports = router;
