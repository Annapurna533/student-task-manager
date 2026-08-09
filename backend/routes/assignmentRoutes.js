
const express = require("express");

const router = express.Router();

const {
    createAssignment,
    getAssignments,
    getAssignmentById,
    submitAssignment,
    updateAssignment,
    deleteAssignment
} = require("../controllers/assignmentController");

const protect = require("../middleware/authMiddleware");

// ==========================
// CREATE ASSIGNMENT
// ==========================

router.post(
    "/",
    protect,
    createAssignment
);

// ==========================
// GET ALL ASSIGNMENTS
// ==========================

router.get(
    "/",
    protect,
    getAssignments
);

// ==========================
// SUBMIT ASSIGNMENT
// ==========================

router.post(
    "/:id/submit",
    protect,
    submitAssignment
);

// ==========================
// GET ONE ASSIGNMENT
// ==========================

router.get(
    "/:id",
    protect,
    getAssignmentById
);

// ==========================
// UPDATE ASSIGNMENT
// ==========================

router.put(
    "/:id",
    protect,
    updateAssignment
);

// ==========================
// DELETE ASSIGNMENT
// ==========================

router.delete(
    "/:id",
    protect,
    deleteAssignment
);

module.exports = router;

