const express = require("express");

const router = express.Router();

const {
    submitAssignment,
    getMySubmissions,
    getLecturerSubmissions,
    updateSubmissionStatus
} = require("../controllers/submissionController");

const protect = require("../middleware/authMiddleware");

// ==========================
// STUDENT
// ==========================

// Submit assignment
router.post("/", protect, submitAssignment);

// View my submissions
router.get("/my", protect, getMySubmissions);


// ==========================
// LECTURER
// ==========================

// View submissions for lecturer's assignments
router.get("/lecturer", protect, getLecturerSubmissions);

// Approve / Reject submission
router.put("/:id/status", protect, updateSubmissionStatus);


module.exports = router;