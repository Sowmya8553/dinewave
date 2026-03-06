const Reservation = require('../models/Reservation');

exports.getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ date: 1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createReservation = async (req, res) => {
    try {
        const newReservation = new Reservation(req.body);
        const savedReservation = await newReservation.save();
        res.status(201).json(savedReservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
