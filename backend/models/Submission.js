const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
    {
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment",
            required: true
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        answer: {
            type: String,
            required: true
        },

        submittedAt: {
            type: Date,
            default: Date.now
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },

        feedback: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;