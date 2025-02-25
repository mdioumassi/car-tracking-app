const { Owner } = require('../models');

const ownerController = {
    async create(req, res) {
        try {
            const owner = await Owner.create(req.body);
            res.status(201).json(owner);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async findAll(req, res) {
        try {
            const owners = await Owner.findAll();
            res.json(owners);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async findOne(req, res) {
        try {
            const owner = await Owner.findByPk(req.params.id);
            if (owner) {
                res.json(owner);
            } else {
                res.status(404).json({ message: 'Owner not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const [updated] = await Owner.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedOwner = await Owner.findByPk(req.params.id);
                res.json(updatedOwner);
            } else {
                res.status(404).json({ message: 'Owner not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Owner.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Owner not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ownerController;