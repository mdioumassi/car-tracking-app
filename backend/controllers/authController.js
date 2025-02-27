const { User } = require('../models');
const { generateToken } = require('../utils/jwtHelper');
const { validationResult } = require('express-validator');

/**
 * Inscription d'un nouvel utilisateur
 */
const register = async (req, res) => {
    try {
        // Vérifier les erreurs de validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            username, password, civility, type_user, firstname,
            lastname, phone, email, address, country
        } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
        }

        // Vérifier si le type d'utilisateur est valide
        if (!['admin', 'proprietaire', 'conducteur'].includes(type_user)) {
            return res.status(400).json({
                message: 'Type d\'utilisateur invalide. Doit être admin, proprietaire ou conducteur'
            });
        }

        // Créer l'utilisateur
        const user = await User.create({
            username,
            password,
            civility,
            type_user,
            firstname,
            lastname,
            phone,
            email,
            address,
            country
        });

        // Générer le token
        const token = generateToken(user);

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            token,
            user: {
                id: user.id,
                username: user.username,
                type_user: user.type_user
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Connexion d'un utilisateur
 */
const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        // Rechercher l'utilisateur
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // Générer le token
        const token = generateToken(user);

        res.json({
            message: 'Connexion réussie',
            token,
            user: {
                id: user.id,
                username: user.username,
                type_user: user.type_user
            }
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/**
 * Récupérer les informations du profil de l'utilisateur
 */
const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    register,
    login,
    getProfile
};