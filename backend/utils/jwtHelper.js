const jwt = require('jsonwebtoken');

/**
 * Génère un token JWT
 * @param {Object} user - Objet utilisateur
 * @returns {String} Token JWT
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            type_user: user.type_user
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    );
};

module.exports = { generateToken };