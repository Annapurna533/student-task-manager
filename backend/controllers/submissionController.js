
const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");
const Notification = require("../models/Notification");

// ==========================
// SUBMIT ASSIGNMENT
// ==========================
const submitAssignment = async (req, res) => {
    try {
        // Only students can submit
        if (req.user.role !== "student") {
            return res.status(403).json({
                message:
                    "Only students can submit assignments"
            });
        }

        const {
            assignmentId,
            answer
        } = req.body;

        // Validate input
        if (
            !assignmentId ||
            !answer ||
            !answer.trim()
        ) {
            return res.status(400).json({
                message:
                    "Assignment ID and answer are required"
            });
        }

        // Find assignment
        const assignment =
            await Assignment.findById(
                assignmentId
            );

        if (!assignment) {
            return res.status(404).json({
                message:
                    "Assignment not found"
            });
        }

        // Check deadline
        if (
            new Date() >
            new Date(assignment.deadline)
        ) {
            // Automatically close assignment
            assignment.status = "closed";

            await assignment.save();

            return res.status(400).json({
                message:
                    "Assignment deadline has passed"
            });
        }

        // Assignment is still active
        assignment.status = "active";

        await assignment.save();

        // Check duplicate submission
        const existingSubmission =
            await Submission.findOne({
                assignment: assignmentId,
                student: req.user.id
            });

        if (existingSubmission) {
            return res.status(400).json({
                message:
                    "You have already submitted this assignment"
            });
        }

        // Create submission
        const submission =
            await Submission.create({
                assignment: assignmentId,
                student: req.user.id,
                answer: answer.trim()
            });

        console.log(
            "Submission created:",
            submission._id
        );

        res.status(201).json({
            message:
                "Assignment submitted successfully",
            submission
        });

    } catch (error) {
        console.error(
            "Submit Assignment Error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to submit assignment",
            error: error.message
        });
    }
};


// ==========================
// GET MY SUBMISSIONS
// ==========================
const getMySubmissions = async (req, res) => {
    try {
        // Only students
        if (req.user.role !== "student") {
            return res.status(403).json({
                message:
                    "Only students can view their submissions"
            });
        }

        const submissions =
            await Submission.find({
                student: req.user.id
            })
                .populate(
                    "assignment",
                    "title subject deadline status"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            submissions
        });

    } catch (error) {
        console.error(
            "Get My Submissions Error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to get submissions",
            error: error.message
        });
    }
};


// ==========================
// GET LECTURER SUBMISSIONS
// ==========================
const getLecturerSubmissions = async (req, res) => {
    try {
        // Only lecturers
        if (req.user.role !== "lecturer") {
            return res.status(403).json({
                message:
                    "Only lecturers can view submissions"
            });
        }

        // Find assignments created by lecturer
        const assignments =
            await Assignment.find({
                createdBy: req.user.id
            });

        const assignmentIds =
            assignments.map(
                (assignment) =>
                    assignment._id
            );

        // Find submissions
        const submissions =
            await Submission.find({
                assignment: {
                    $in: assignmentIds
                }
            })
                .populate(
                    "student",
                    "name email"
                )
                .populate(
                    "assignment",
                    "title subject deadline status"
                )
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            submissions
        });

    } catch (error) {
        console.error(
            "Get Lecturer Submissions Error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to get submissions",
            error: error.message
        });
    }
};


// ==========================
// APPROVE / REJECT SUBMISSION
// ==========================
const updateSubmissionStatus = async (
    req,
    res
) => {
    try {
        // Only lecturers
        if (req.user.role !== "lecturer") {
            return res.status(403).json({
                message:
                    "Only lecturers can review submissions"
            });
        }

        const {
            status,
            feedback
        } = req.body;

        // Validate status
        if (
            ![
                "approved",
                "rejected"
            ].includes(status)
        ) {
            return res.status(400).json({
                message:
                    "Status must be approved or rejected"
            });
        }

        // Find submission
        const submission =
            await Submission.findById(
                req.params.id
            ).populate(
                "assignment"
            );

        if (!submission) {
            return res.status(404).json({
                message:
                    "Submission not found"
            });
        }

        // Make sure assignment exists
        if (!submission.assignment) {
            return res.status(404).json({
                message:
                    "Assignment not found"
            });
        }

        // Check lecturer owns assignment
        if (
            submission.assignment.createdBy.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message:
                    "You cannot review this submission"
            });
        }

        // Update submission
        submission.status = status;

        submission.feedback =
            feedback
                ? feedback.trim()
                : "";

        await submission.save();

        // ==========================
        // STUDENT NOTIFICATION
        // ==========================

        const notificationType =
            status === "approved"
                ? "approval"
                : "rejection";

        let notificationMessage;

        if (status === "approved") {

            notificationMessage =
                `Your assignment "${submission.assignment.title}" has been approved.`;

        } else {

            notificationMessage =
                `Your assignment "${submission.assignment.title}" has been rejected.`;

        }

        // Add feedback to notification
        if (
            feedback &&
            feedback.trim()
        ) {
            notificationMessage +=
                ` Feedback: ${feedback.trim()}`;
        }

        await Notification.create({
            user: submission.student,
            message: notificationMessage,
            type: notificationType,
            isRead: false
        });

        // Populate response
        await submission.populate(
            "student",
            "name email"
        );

        await submission.populate(
            "assignment",
            "title subject deadline status"
        );

        res.status(200).json({
            message:
                `Submission ${status} successfully`,
            submission
        });

    } catch (error) {
        console.error(
            "Update Submission Status Error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update submission",
            error: error.message
        });
    }
};


// ==========================
// EXPORT
// ==========================

module.exports = {
    submitAssignment,
    getMySubmissions,
    getLecturerSubmissions,
    updateSubmissionStatus
};

