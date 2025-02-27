

/**
 * Middleware pour vérifier le rôle de l'utilisateur
 */
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Accès non autorisé' });
        }

        const { type_user } = req.user;

        if (!allowedRoles.includes(type_user)) {
            return res.status(403).json({
                message: 'Accès interdit. Vous n\'avez pas les droits nécessaires'
            });
        }

        next();
    };
};

module.exports = { checkRole };