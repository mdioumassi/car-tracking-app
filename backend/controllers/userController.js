const { User, Driver } = require('../models');
const { validationResult } = require('express-validator');

/**
 * Récupérer tous les utilisateurs (admin uniquement)
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });

        res.json({ users });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Récupérer un utilisateur par son ID
 */
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Mettre à jour un utilisateur
 */
const updateUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier les permissions (un utilisateur ne peut modifier que son propre profil, sauf l'admin)
        if (req.user.type_user !== 'admin' && req.user.id !== parseInt(id)) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        // Données à mettre à jour
        const {
            username, password, civility, type_user, firstname,
            lastname, phone, email, address, country
        } = req.body;

        // Mise à jour de l'utilisateur
        const updateData = {};
        if (username) updateData.username = username;
        if (password) updateData.password = password;
        if (civility) updateData.civility = civility;
        if (type_user && req.user.type_user === 'admin') updateData.type_user = type_user;
        if (firstname) updateData.firstname = firstname;
        if (lastname) updateData.lastname = lastname;
        if (phone) updateData.phone = phone;
        if (email) updateData.email = email;
        if (address) updateData.address = address;
        if (country) updateData.country = country;

        await user.update(updateData);

        res.json({
            message: 'Utilisateur mis à jour avec succès',
            user: {
                id: user.id,
                username: user.username,
                type_user: user.type_user
            }
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Supprimer un utilisateur
 */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si l'utilisateur existe
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        await user.destroy();
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};