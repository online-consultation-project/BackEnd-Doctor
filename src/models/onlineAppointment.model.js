const mongoose = require("mongoose");
const { v4 } = require("uuid");

const zoomMeetingSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: v4,
    },
    userId: {
        type: String,
        required: true,
    },
    doctorId: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
    },
    startTime: {
        type: String,
    },
    duration: {
        type: Number,
    },
    joinUrl: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    doctorFirstName: {
        type: String,
        required: true,
    },
    doctorLastName: {
        type: String,
        required: true,
    },
    doctorCategory: {
        type: String,
        required: true,
    },
    doctorEmail: {
        type: String,
        required: true,
    },
    slot: {
        type: String,
    },
    date: {
        type: String,
    },
    status: {
        type: String,
        default: "Pending",
    },
    patientName: {
        type: String,
        required: true,
    },
    patientEmail: {
        type: String,
        required: true,
    },
    patientConsult: {
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
    payment: {
        type: String,

    },
}, {
    timestamps: true,
});

const ZoomMeeting = mongoose.model("ZoomMeeting", zoomMeetingSchema);

module.exports = ZoomMeeting;