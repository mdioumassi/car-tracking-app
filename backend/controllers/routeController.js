const { Route, Car, Driver, User } = require('../models');
const { validationResult } = require('express-validator');

/**
 * Récupérer toutes les routes
 */
const getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.findAll({
            include: [
                {
                    model: Car,
                    as: 'car',
                    include: [
                        {
                            model: User,
                            as: 'owner',
                            attributes: ['id', 'username', 'firstname', 'lastname']
                        },
                        {
                            model: Driver,
                            as: 'driver',
                            include: {
                                model: User,
                                as: 'user',
                                attributes: ['id', 'username', 'firstname', 'lastname']
                            }
                        }
                    ]
                }
            ]
        });

        res.json({ routes });
    } catch (error) {
        console.error('Erreur lors de la récupération des routes:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Récupérer une route par son ID
 */
const getRouteById = async (req, res) => {
    try {
        const { id } = req.params;
        const route = await Route.findByPk(id, {
            include: [
                {
                    model: Car,
                    as: 'car',
                    include: [
                        {
                            model: User,
                            as: 'owner',
                            attributes: ['id', 'username', 'firstname', 'lastname']
                        },
                        {
                            model: Driver,
                            as: 'driver',
                            include: {
                                model: User,
                                as: 'user',
                                attributes: ['id', 'username', 'firstname', 'lastname']
                            }
                        }
                    ]
                }
            ]
        });

        if (!route) {
            return res.status(404).json({ message: 'Route non trouvée' });
        }

        res.json({ route });
    } catch (error) {
        console.error('Erreur lors de la récupération de la route:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Récupérer les routes d'une voiture
 */
const getRoutesByCar = async (req, res) => {
    try {
        const { car_id } = req.params;

        // Vérifier si la voiture existe
        const car = await Car.findByPk(car_id);
        if (!car) {
            return res.status(404).json({ message: 'Voiture non trouvée' });
        }

        const routes = await Route.findAll({
            where: { car_id },
            order: [['todays_date', 'DESC']]
        });

        res.json({ routes });
    } catch (error) {
        console.error('Erreur lors de la récupération des routes de la voiture:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Créer une nouvelle route
 */
const createRoute = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            pickup_point, destination_point, distance_traveled,
            travel_cost, todays_date, car_id
        } = req.body;

        // Vérifier si la voiture existe
        const car = await Car.findByPk(car_id, {
            include: [{ model: Driver, as: 'driver' }]
        });

        if (!car) {
            return res.status(404).json({ message: 'Voiture non trouvée' });
        }

        // Vérifier les permissions 
        // Un conducteur ne peut créer une route que pour une voiture qui lui est assignée
        if (req.user.type_user === 'conducteur') {
            if (!car.driver || car.driver.driver_id !== req.user.id) {
                return res.status(403).json({
                    message: 'Vous n\'êtes pas le conducteur assigné à cette voiture'
                });
            }
        }
        // Un propriétaire ne peut créer des routes que pour ses propres voitures
        else if (req.user.type_user === 'proprietaire' && car.owner_id !== req.user.id) {
            return res.status(403).json({
                message: 'Vous n\'êtes pas le propriétaire de cette voiture'
            });
        }
    } catch (error) {
        console.error('Erreur lors de la création de la route:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

module.exports = {
    getAllRoutes,
    getRouteById,
    getRoutesByCar,
    createRoute
};


