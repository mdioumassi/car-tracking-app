const { Position } = require('../models');

const positionController = {
    async create(req, res) {
        try {
            const position = await Position.create(req.body);
            res.status(201).json(position);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async findAll(req, res) {
        try {
            const positions = await Position.findAll();
            res.json(positions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async findOne(req, res) {
        try {
            const position = await Position.findByPk(req.params.id);
            if (position) {
                res.json(position);
            } else {
                res.status(404).json({ message: 'Position not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const [updated] = await Position.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedPosition = await Position.findByPk(req.params.id);
                res.json(updatedPosition);
            } else {
                res.status(404).json({ message: 'Position not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Position.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Position not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = positionController;