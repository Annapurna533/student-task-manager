
const Assignment = require("../models/Assignment");
const Notification = require("../models/Notification");
const User = require("../models/User");
const Submission = require("../models/Submission");

// ========================================
// CREATE ASSIGNMENT
// ========================================

const createAssignment = async (req, res) => {
    try {
        // Only lecturers can create assignments
        if (req.user.role !== "lecturer") {
            return res.status(403).json({
                message: "Only lecturers can create assignments"
            });
        }

        const {
            title,
            description,
            subject,
            deadline
        } = req.body;

        // Validate input
        if (
            !title ||
            !description ||
            !subject ||
            !deadline
        ) {
            return res.status(400).json({
                message:
                    "Title, description, subject and deadline are required"
            });
        }

        // Automatically determine status
        const assignmentStatus =
            new Date(deadline) > new Date()
                ? "active"
                : "closed";

        // Create assignment
        const assignment = await Assignment.create({
            title,
            description,
            subject,
            deadline,
            createdBy: req.user.id,
            status: assignmentStatus
        });

        console.log(
            "Assignment created:",
            assignment._id
        );

        // Find all students
        const students = await User.find({
            role: "student"
        });

        // Create notifications
        if (students.length > 0) {
            const notifications = students.map(
                (student) => ({
                    user: student._id,
                    message: `New assignment: ${title}`,
                    type: "assignment",
                    isRead: false
                })
            );

            await Notification.insertMany(
                notifications
            );
        }

        res.status(201).json({
            message: "Assignment created successfully",
            assignment
        });

    } catch (error) {
        console.log(
            "Create Assignment Error:",
            error
        );

        res.status(500).json({
            message: "Failed to create assignment",
            error: error.message
        });
    }
};


// ========================================
// GET ALL ASSIGNMENTS
// ========================================

const getAssignments = async (req, res) => {
    try {
        const assignments =
            await Assignment.find()
                .populate(
                    "createdBy",
                    "name email"
                );

        const now = new Date();

        // Automatically update status
        for (const assignment of assignments) {

            if (
                new Date(assignment.deadline) < now &&
                assignment.status !== "closed"
            ) {
                assignment.status = "closed";
                await assignment.save();
            }

            else if (
                new Date(assignment.deadline) >= now &&
                assignment.status !== "active"
            ) {
                assignment.status = "active";
                await assignment.save();
            }
        }

        res.status(200).json({
            assignments
        });

    } catch (error) {
        console.log(
            "Get Assignments Error:",
            error
        );

        res.status(500).json({
            message: "Failed to get assignments",
            error: error.message
        });
    }
};


// ========================================
// GET ASSIGNMENT BY ID
// ========================================

const getAssignmentById = async (req, res) => {
    try {
        const assignment =
            await Assignment.findById(
                req.params.id
            ).populate(
                "createdBy",
                "name email"
            );

        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        // Automatically update status
        if (
            new Date(assignment.deadline) < new Date() &&
            assignment.status !== "closed"
        ) {
            assignment.status = "closed";
            await assignment.save();
        }

        else if (
            new Date(assignment.deadline) >= new Date() &&
            assignment.status !== "active"
        ) {
            assignment.status = "active";
            await assignment.save();
        }

        res.status(200).json({
            assignment
        });

    } catch (error) {
        console.log(
            "Get Assignment Error:",
            error
        );

        res.status(500).json({
            message: "Failed to get assignment",
            error: error.message
        });
    }
};


// ========================================
// SUBMIT ASSIGNMENT
// ========================================

const submitAssignment = async (req, res) => {
    try {
        // Only students can submit
        if (req.user.role !== "student") {
            return res.status(403).json({
                message:
                    "Only students can submit assignments"
            });
        }

        const { answer } = req.body;

        // Validate answer
        if (!answer || !answer.trim()) {
            return res.status(400).json({
                message: "Answer is required"
            });
        }

        // Find assignment
        const assignment =
            await Assignment.findById(
                req.params.id
            );

        if (!assignment) {
            return res.status(404).json({
                message: "Assignment not found"
            });
        }

        // Check deadline
        if (
            new Date() >
            new Date(assignment.deadline)
        ) {
            // Update status to closed
            assignment.status = "closed";
            await assignment.save();

            return res.status(400).json({
                message:
                    "Assignment deadline has passed"
            });
        }

        // Make sure assignment is active
        assignment.status = "active";
        await assignment.save();

        // Check duplicate submission
        const existingSubmission =
            await Submission.findOne({
                assignment: assignment._id,
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
                assignment: assignment._id,
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
        console.log(
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


// ========================================
// UPDATE ASSIGNMENT
// ========================================

const updateAssignment = async (req, res) => {
    try {
        // Only lecturers can update
        if (req.user.role !== "lecturer") {
            return res.status(403).json({
                message:
                    "Only lecturers can update assignments"
            });
        }

        const {
            title,
            description,
            subject,
            deadline
        } = req.body;

        // Find assignment
        const assignment =
            await Assignment.findById(
                req.params.id
            );

        if (!assignment) {
            return res.status(404).json({
                message:
                    "Assignment not found"
            });
        }

        // Check lecturer owns assignment
        if (
            assignment.createdBy.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message:
                    "You can only update your own assignments"
            });
        }

        // Validate
        if (
            !title ||
            !description ||
            !subject ||
            !deadline
        ) {
            return res.status(400).json({
                message:
                    "Title, description, subject and deadline are required"
            });
        }

        // Determine status from new deadline
        const assignmentStatus =
            new Date(deadline) > new Date()
                ? "active"
                : "closed";

        // Update
        assignment.title = title;
        assignment.description = description;
        assignment.subject = subject;
        assignment.deadline = deadline;
        assignment.status = assignmentStatus;

        await assignment.save();

        res.status(200).json({
            message:
                "Assignment updated successfully",
            assignment
        });

    } catch (error) {
        console.log(
            "Update Assignment Error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update assignment",
            error: error.message
        });
    }
};


// ========================================
// DELETE ASSIGNMENT
// ========================================

const deleteAssignment = async (req, res) => {
    try {
        // Only lecturers can delete
        if (req.user.role !== "lecturer") {
            return res.status(403).json({
                message:
                    "Only lecturers can delete assignments"
            });
        }

        // Find assignment
        const assignment =
            await Assignment.findById(
                req.params.id
            );

        if (!assignment) {
            return res.status(404).json({
                message:
                    "Assignment not found"
            });
        }

        // Check lecturer owns assignment
        if (
            assignment.createdBy.toString() !==
            req.user.id
        ) {
            return res.status(403).json({
                message:
                    "You can only delete your own assignments"
            });
        }

        // Delete assignment
        await Assignment.findByIdAndDelete(
            req.params.id
        );

        // Delete related submissions
        await Submission.deleteMany({
            assignment: req.params.id
        });

        res.status(200).json({
            message:
                "Assignment deleted successfully"
        });

    } catch (error) {
        console.log(
            "Delete Assignment Error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to delete assignment",
            error: error.message
        });
    }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
    createAssignment,
    getAssignments,
    getAssignmentById,
    submitAssignment,
    updateAssignment,
    deleteAssignment
};

