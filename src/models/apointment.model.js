const mongoose = require("mongoose");
const { v4 } = require("uuid");

const appointmentSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: v4,
    },
    userId: {
        type: String,
        ref: "User",
        required: true,
    },
    patientName: {
        type: String,
        required: true,
    },
    patientEmail: {
        type: String,
        required: true,
    },
    patientPhone: {
        type: String,
        required: true,
    },
    patientGender: {
        type: String,
        required: true,
    },
    patientAge: {
        type: Number,
        required: true,
    },
    doctorId: {
        type: String,
        ref: "admin_data",
        required: true,
    },
    slot: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        default: "Pending",
    },
}, {
    timestamps: true,
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;