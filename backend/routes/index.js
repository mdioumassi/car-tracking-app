const express = require('express');
const router = express.Router();


const driverRoutes = require('./driverRoutes');
const carRoutes = require('./carRoutes');
const routeRoutes = require('./routeRoutes');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');


router.use('/drivers', driverRoutes);
router.use('/cars', carRoutes);
router.use('/routes', routeRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);


module.exports = router;
