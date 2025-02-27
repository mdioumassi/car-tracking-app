const { Car, User, Driver } = require('../models');
const { validationResult } = require('express-validator');

/**
 * Récupérer toutes les voitures
 */
const getAllCars = async (req, res) => {
    try {
        const cars = await Car.findAll({
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
        });

        res.json({ cars });
    } catch (error) {
        console.error('Erreur lors de la récupération des voitures:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Récupérer une voiture par son ID
 */
const getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.findByPk(id, {
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
        });

        if (!car) {
            return res.status(404).json({ message: 'Voiture non trouvée' });
        }

        res.json({ car });
    } catch (error) {
        console.error('Erreur lors de la récupération de la voiture:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Récupérer les voitures d'un propriétaire
 */
const getCarsByOwner = async (req, res) => {
    try {
        const { owner_id } = req.params;

        const cars = await Car.findAll({
            where: { owner_id },
            include: [
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
        });

        res.json({ cars });
    } catch (error) {
        console.error('Erreur lors de la récupération des voitures du propriétaire:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Créer une nouvelle voiture
 */
const createCar = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            registration_number, marque, model, car_insurance,
            car_gray, driver_id, owner_id
        } = req.body;

        // Vérifier si le propriétaire existe et est de type 'proprietaire'
        const owner = await User.findByPk(owner_id);
        if (!owner) {
            return res.status(404).json({ message: 'Propriétaire non trouvé' });
        }

        if (owner.type_user !== 'proprietaire' && owner.type_user !== 'admin') {
            return res.status(400).json({
                message: 'L\'utilisateur doit être de type propriétaire ou admin'
            });
        }

        // Vérifier si le conducteur existe (si fourni)
        if (driver_id) {
            const driver = await Driver.findByPk(driver_id);
            if (!driver) {
                return res.status(404).json({ message: 'Conducteur non trouvé' });
            }
        }

        // Vérifier si le numéro d'immatriculation n'est pas déjà utilisé
        const existingCar = await Car.findOne({ where: { registration_number } });
        if (existingCar) {
            return res.status(400).json({
                message: 'Ce numéro d\'immatriculation est déjà utilisé'
            });
        }

        // Créer la voiture
        const car = await Car.create({
            registration_number,
            marque,
            model,
            car_insurance: car_insurance || 0,
            car_gray: car_gray || 0,
            driver_id,
            owner_id
        });

        res.status(201).json({
            message: 'Voiture créée avec succès',
            car
        });
    } catch (error) {
        console.error('Erreur lors de la création de la voiture:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Mettre à jour une voiture
 */
const updateCar = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const {
            registration_number, marque, model, car_insurance,
            car_gray, driver_id
        } = req.body;

        // Vérifier si la voiture existe
        const car = await Car.findByPk(id);
        if (!car) {
            return res.status(404).json({ message: 'Voiture non trouvée' });
        }

        // Vérifier les permissions (propriétaire ou admin uniquement)
        if (req.user.type_user === 'proprietaire' && car.owner_id !== req.user.id) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        // Vérifier le conducteur (si fourni)
        if (driver_id) {
            const driver = await Driver.findByPk(driver_id);
            if (!driver) {
                return res.status(404).json({ message: 'Conducteur non trouvé' });
            }
        }

        // Mettre à jour la voiture
        const updateData = {};
        if (registration_number) updateData.registration_number = registration_number;
        if (marque) updateData.marque = marque;
        if (model) updateData.model = model;
        if (car_insurance !== undefined) updateData.car_insurance = car_insurance;
        if (car_gray !== undefined) updateData.car_gray = car_gray;
        if (driver_id !== undefined) updateData.driver_id = driver_id;

        await car.update(updateData);

        res.json({
            message: 'Voiture mise à jour avec succès',
            car
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la voiture:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Supprimer une voiture
 */
const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si la voiture existe
        const car = await Car.findByPk(id);
        if (!car) {
            return res.status(404).json({ message: 'Voiture non trouvée' });
        }

        // Vérifier les permissions
        if (req.user.type_user === 'proprietaire' && car.owner_id !== req.user.id) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        await car.destroy();
        res.json({ message: 'Voiture supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la voiture:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    getAllCars,
    getCarById,
    getCarsByOwner,
    createCar,
    updateCar,
    deleteCar
};