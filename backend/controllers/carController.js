const { Car, Owner, Driver } = require('../models');

const carController = {
    async create(req, res) {
        try {
            const car = await Car.create(req.body);
            res.status(201).json(car);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async findAll(req, res) {
        try {
            const cars = await Car.findAll({
                include: [
                    { model: Owner, as: 'owner' },
                    { model: Driver, as: 'driver' }
                ]
            });
            res.json(cars);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async findOne(req, res) {
        try {
            const car = await Car.findByPk(req.params.id, {
                include: [
                    { model: Owner, as: 'owner' },
                    { model: Driver, as: 'driver' }
                ]
            });
            if (car) {
                res.json(car);
            } else {
                res.status(404).json({ message: 'Car not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const [updated] = await Car.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedCar = await Car.findByPk(req.params.id);
                res.json(updatedCar);
            } else {
                res.status(404).json({ message: 'Car not found' });
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await Car.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Car not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = carController;