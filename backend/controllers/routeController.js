const { Route, Car, Position } = require('../models');

const routeController = {
    async create(req, res) {
        try {
            const route = await Route.create(req.body);
            res.status(201).json(route);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async findAll(req, res) {
        try {
            const routes = await Route.findAll({
                include: [
                    { model: Car, as: 'car' },
                    { model: Position, as: 'position' }
                ]
            });
            res.json(routes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async findOne(req, res) {
        try {
            const route = await Route.findByPk(req.params.id, {
                include: [
                    { model: Car, as: 'car' },
                    { model: Position, as: 'position' }
                ]
            });
            if (route) {
                res.json(route);
            } else {
                res.status(404).json({ message: 'Route not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const [updated] = await Route.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedRoute = await Route.findByPk(req.params.id);
                res.json(updatedRoute);
            } else {
                res.status(404).json({ message: 'Route not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Route.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Route not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = routeController;