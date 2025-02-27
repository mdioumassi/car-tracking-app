const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware pour vérifier si l'utilisateur est authentifié
 */
const authenticate = async (req, res, next) => {
    try {
        // Vérifier si le token est présent
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Accès non autorisé. Token manquant' });
        }

        // Extraire et vérifier le token
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Vérifier si l'utilisateur existe toujours
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        // Ajouter l'utilisateur à la requête
        req.user = {
            id: user.id,
            username: user.username,
            type_user: user.type_user
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token invalide' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expiré' });
        }
        console.error('Erreur d\'authentification:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = { authenticate };