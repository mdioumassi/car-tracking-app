// Définition des fonctions liées aux conducteurs
const { Driver, User, Car } = require('../models');
const { validationResult } = require('express-validator');

/**
 * Récupérer tous les conducteurs
 */
const getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.findAll({
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'firstname', 'lastname', 'phone', 'email']
                }
            ]
        });

        res.json({ drivers });
    } catch (error) {
        console.error('Erreur lors de la récupération des conducteurs:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Récupérer un conducteur par son ID
 */
const getDriverById = async (req, res) => {
    try {
        const { id } = req.params;
        const driver = await Driver.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'firstname', 'lastname', 'phone', 'email']
                },
                {
                    model: Car,
                    as: 'assignedCars'
                }
            ]
        });

        if (!driver) {
            return res.status(404).json({ message: 'Conducteur non trouvé' });
        }

        res.json({ driver });
    } catch (error) {
        console.error('Erreur lors de la récupération du conducteur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Créer un profil de conducteur
 */
const createDriver = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { permis, current_position, driver_id } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(driver_id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier si un profil de conducteur existe déjà pour cet utilisateur
        const existingDriver = await Driver.findOne({ where: { driver_id } });
        if (existingDriver) {
            return res.status(400).json({ message: 'Ce profil de conducteur existe déjà' });
        }

        // Créer le profil de conducteur
        const driver = await Driver.create({
            permis,
            current_position,
            driver_id
        });

        // Mettre à jour le type d'utilisateur si nécessaire
        if (user.type_user !== 'conducteur') {
            await user.update({ type_user: 'conducteur' });
        }

        res.status(201).json({
            message: 'Profil de conducteur créé avec succès',
            driver
        });
    } catch (error) {
        console.error('Erreur lors de la création du profil de conducteur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Mettre à jour un profil de conducteur
 */
const updateDriver = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { permis, current_position } = req.body;

        // Vérifier si le conducteur existe
        const driver = await Driver.findByPk(id);
        if (!driver) {
            return res.status(404).json({ message: 'Conducteur non trouvé' });
        }

        // Vérifier les permissions
        if (req.user.type_user === 'conducteur' && driver.driver_id !== req.user.id) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        // Mise à jour du profil de conducteur
        await driver.update({
            permis: permis || driver.permis,
            current_position: current_position || driver.current_position
        });

        res.json({
            message: 'Profil de conducteur mis à jour avec succès',
            driver
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil de conducteur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Supprimer un profil de conducteur
 */
const deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si le conducteur existe
        const driver = await Driver.findByPk(id);
        if (!driver) {
            return res.status(404).json({ message: 'Conducteur non trouvé' });
        }

        await driver.destroy();
        res.json({ message: 'Profil de conducteur supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du profil de conducteur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    getAllDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver
};