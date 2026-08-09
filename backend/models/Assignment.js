const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    deadline: {
        type: Date,
        required: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    status: {
        type: String,
        enum: ["active", "closed"],
        default: "active"
    }
});

module.exports = mongoose.model("Assignment", assignmentSchema);