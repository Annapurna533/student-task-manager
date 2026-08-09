const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// ==========================
// IMPORT ROUTES
// ==========================
const authRoutes = require("./routes/authRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// ==========================
// CREATE APP
// ==========================
const app = express();

// ==========================
// MIDDLEWARE
// ==========================
app.use(cors());
app.use(express.json());

// ==========================
// ROUTES
// ==========================
app.use("/api/auth", authRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/notifications", notificationRoutes);

// ==========================
// HOME ROUTE
// ==========================
app.get("/", (req, res) => {
    res.send("Student Assignment Task Manager API is running!");
});

// ==========================
// MONGODB
// ==========================
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed");
        console.log(error.message);
    });