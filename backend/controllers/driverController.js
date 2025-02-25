const { Driver } = require('../models');

const driverController = {
    async create(req, res) {
        try {
            const driver = await Driver.create(req.body);
            res.status(201).json(driver);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async findAll(req, res) {
        try {
            const drivers = await Driver.findAll();
            res.json(drivers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async findOne(req, res) {
        try {
            const driver = await Driver.findByPk(req.params.id);
            if (driver) {
                res.json(driver);
            } else {
                res.status(404).json({ message: 'Driver not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const [updated] = await Driver.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedDriver = await Driver.findByPk(req.params.id);
                res.json(updatedDriver);
            } else {
                res.status(404).json({ message: 'Driver not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Driver.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Driver not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = driverController;