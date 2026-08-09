
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function LecturerDashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // ================================
    // CREATE ASSIGNMENT
    // ================================

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [subject, setSubject] = useState("");
    const [deadline, setDeadline] = useState("");
    const [creating, setCreating] = useState(false);

    // ================================
    // EDIT ASSIGNMENT
    // ================================

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editSubject, setEditSubject] = useState("");
    const [editDeadline, setEditDeadline] = useState("");
    const [updating, setUpdating] = useState(false);

    // ================================
    // DELETE
    // ================================

    const [deletingId, setDeletingId] = useState(null);

    // ================================
    // REVIEW SUBMISSION
    // ================================

    const [reviewingId, setReviewingId] = useState(null);
    const [feedback, setFeedback] = useState("");

    // ================================
    // LOAD DASHBOARD
    // ================================

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token) {
            navigate("/login");
            return;
        }

        if (!storedUser) {
            navigate("/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);

            if (parsedUser.role !== "lecturer") {
                navigate("/student");
                return;
            }

            setUser(parsedUser);

            loadAssignments(parsedUser.id);
            loadSubmissions();
        } catch (err) {
            console.error("User parsing error:", err);
            setError("Failed to load user information.");
            setLoading(false);
        }
    }, [navigate]);

    // ================================
    // LOAD ASSIGNMENTS
    // ================================

    const loadAssignments = async (lecturerId) => {
        try {
            const response = await API.get("/assignments");

            const allAssignments =
                response.data.assignments ||
                response.data ||
                [];

            const myAssignments = allAssignments.filter(
                (assignment) => {
                    const creator = assignment.createdBy;

                    if (!creator) {
                        return false;
                    }

                    if (typeof creator === "string") {
                        return creator === lecturerId;
                    }

                    return creator._id === lecturerId;
                }
            );

            setAssignments(myAssignments);
        } catch (err) {
            console.error("LOAD ASSIGNMENTS ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load assignments"
            );
        }
    };

    // ================================
    // LOAD SUBMISSIONS
    // ================================

    const loadSubmissions = async () => {
        try {
            const response = await API.get(
                "/submissions/lecturer"
            );

            setSubmissions(
                response.data.submissions || []
            );
        } catch (err) {
            console.error("LOAD SUBMISSIONS ERROR:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load submissions"
            );
        } finally {
            setLoading(false);
        }
    };

    // ================================
    // CREATE ASSIGNMENT
    // ================================

    const createAssignment = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (
            !title.trim() ||
            !description.trim() ||
            !subject.trim() ||
            !deadline
        ) {
            setError(
                "Please fill all assignment fields."
            );
            return;
        }

        try {
            setCreating(true);

            await API.post("/assignments", {
                title: title.trim(),
                description: description.trim(),
                subject: subject.trim(),
                deadline: deadline
            });

            setMessage(
                "Assignment created successfully!"
            );

            setTitle("");
            setDescription("");
            setSubject("");
            setDeadline("");

            await loadAssignments(user.id);
        } catch (err) {
            console.error(
                "CREATE ASSIGNMENT ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to create assignment"
            );
        } finally {
            setCreating(false);
        }
    };

    // ================================
    // START EDIT
    // ================================

    const startEdit = (assignment) => {
        setError("");
        setMessage("");

        setEditingId(assignment._id);

        setEditTitle(
            assignment.title || ""
        );

        setEditDescription(
            assignment.description || ""
        );

        setEditSubject(
            assignment.subject || ""
        );

        if (assignment.deadline) {
            const date = new Date(
                assignment.deadline
            );

            const localDate = new Date(
                date.getTime() -
                date.getTimezoneOffset() * 60000
            )
                .toISOString()
                .slice(0, 16);

            setEditDeadline(localDate);
        } else {
            setEditDeadline("");
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // ================================
    // CANCEL EDIT
    // ================================

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
        setEditDescription("");
        setEditSubject("");
        setEditDeadline("");
    };

    // ================================
    // UPDATE ASSIGNMENT
    // ================================

    const updateAssignment = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (
            !editTitle.trim() ||
            !editDescription.trim() ||
            !editSubject.trim() ||
            !editDeadline
        ) {
            setError(
                "Please fill all assignment fields."
            );
            return;
        }

        try {
            setUpdating(true);

            await API.put(
                `/assignments/${editingId}`,
                {
                    title: editTitle.trim(),
                    description: editDescription.trim(),
                    subject: editSubject.trim(),
                    deadline: editDeadline
                }
            );

            setMessage(
                "Assignment updated successfully!"
            );

            cancelEdit();

            await loadAssignments(user.id);
        } catch (err) {
            console.error(
                "UPDATE ASSIGNMENT ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update assignment"
            );
        } finally {
            setUpdating(false);
        }
    };

    // ================================
    // DELETE ASSIGNMENT
    // ================================

    const deleteAssignment = async (assignmentId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this assignment?\n\nAll submissions for this assignment will also be deleted."
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");
            setDeletingId(assignmentId);

            await API.delete(
                `/assignments/${assignmentId}`
            );

            setMessage(
                "Assignment deleted successfully!"
            );

            if (editingId === assignmentId) {
                cancelEdit();
            }

            await loadAssignments(user.id);
            await loadSubmissions();
        } catch (err) {
            console.error(
                "DELETE ASSIGNMENT ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to delete assignment"
            );
        } finally {
            setDeletingId(null);
        }
    };

    // ================================
    // REVIEW SUBMISSION
    // ================================

    const updateStatus = async (
        submissionId,
        status
    ) => {
        try {
            setError("");
            setMessage("");

            await API.put(
                `/submissions/${submissionId}/status`,
                {
                    status,
                    feedback
                }
            );

            setFeedback("");
            setReviewingId(null);

            setMessage(
                `Submission ${status} successfully!`
            );

            await loadSubmissions();
        } catch (err) {
            console.error(
                "UPDATE SUBMISSION ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update submission"
            );
        }
    };

    // ================================
    // LOGOUT
    // ================================

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    // ================================
    // LOADING
    // ================================

    if (loading) {
        return (
            <div className="dashboard-loading">
                Loading lecturer dashboard...
            </div>
        );
    }

    // ================================
    // MAIN PAGE
    // ================================

    return (
        <div className="dashboard">

            {/* ================= NAVBAR ================= */}

            <nav className="dashboard-nav">

                <div className="brand">
                    Student Task Manager
                </div>

                <div className="nav-user">

                    <span>
                        👨‍🏫{" "}
                        {user?.name || "Lecturer"}
                    </span>

                    <button onClick={logout}>
                        Logout
                    </button>

                </div>

            </nav>

            {/* ================= MAIN CONTENT ================= */}

            <main className="dashboard-content">

                {/* ================= WELCOME ================= */}

                <section className="welcome-section">

                    <p className="small-title">
                        LECTURER DASHBOARD
                    </p>

                    <h1>
                        Welcome,{" "}
                        {user?.name || "Lecturer"} 👋
                    </h1>

                    <p>
                        Create assignments, manage
                        assignments and review student
                        submissions.
                    </p>

                </section>

                {/* ================= ERROR ================= */}

                {error && (
                    <div className="dashboard-error">
                        {error}
                    </div>
                )}

                {/* ================= SUCCESS ================= */}

                {message && (
                    <div className="success">
                        {message}
                    </div>
                )}

                {/* ================= CREATE / EDIT ================= */}

                <section className="glass-panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                {editingId
                                    ? "✏️ Edit Assignment"
                                    : "➕ Create Assignment"
                                }
                            </h2>

                            <p>
                                {editingId
                                    ? "Update your assignment details."
                                    : "Create a new assignment for students."
                                }
                            </p>

                        </div>

                    </div>

                    <form
                        onSubmit={
                            editingId
                                ? updateAssignment
                                : createAssignment
                        }
                        className="submission-form"
                    >

                        <input
                            type="text"
                            placeholder="Assignment title"
                            value={
                                editingId
                                    ? editTitle
                                    : title
                            }
                            onChange={(e) =>
                                editingId
                                    ? setEditTitle(
                                        e.target.value
                                    )
                                    : setTitle(
                                        e.target.value
                                    )
                            }
                        />

                        <textarea
                            rows="5"
                            placeholder="Assignment description"
                            value={
                                editingId
                                    ? editDescription
                                    : description
                            }
                            onChange={(e) =>
                                editingId
                                    ? setEditDescription(
                                        e.target.value
                                    )
                                    : setDescription(
                                        e.target.value
                                    )
                            }
                        />

                        <input
                            type="text"
                            placeholder="Subject"
                            value={
                                editingId
                                    ? editSubject
                                    : subject
                            }
                            onChange={(e) =>
                                editingId
                                    ? setEditSubject(
                                        e.target.value
                                    )
                                    : setSubject(
                                        e.target.value
                                    )
                            }
                        />

                        <label>
                            Deadline
                        </label>

                        <input
                            type="datetime-local"
                            value={
                                editingId
                                    ? editDeadline
                                    : deadline
                            }
                            onChange={(e) =>
                                editingId
                                    ? setEditDeadline(
                                        e.target.value
                                    )
                                    : setDeadline(
                                        e.target.value
                                    )
                            }
                        />

                        <div
                            style={{
                                display: "flex",
                                gap: "12px",
                                justifyContent: "flex-end",
                                flexWrap: "wrap"
                            }}
                        >

                            <button
                                type="submit"
                                disabled={
                                    creating ||
                                    updating
                                }
                            >
                                {editingId
                                    ? updating
                                        ? "Updating..."
                                        : "Update Assignment"
                                    : creating
                                        ? "Creating..."
                                        : "Create Assignment"
                                }
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    disabled={updating}
                                    style={{
                                        background:
                                            "rgba(255,255,255,0.10)"
                                    }}
                                >
                                    Cancel Edit
                                </button>
                            )}

                        </div>

                    </form>

                </section>

                {/* ================= MY ASSIGNMENTS ================= */}

                <section className="glass-panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                📚 My Assignments
                            </h2>

                            <p>
                                Manage assignments created
                                by you.
                            </p>

                        </div>

                    </div>

                    {assignments.length === 0 ? (

                        <div className="empty-state">

                            <span>
                                📭
                            </span>

                            <p>
                                You have not created any
                                assignments yet.
                            </p>

                        </div>

                    ) : (

                        <div className="assignment-list">

                            {assignments.map(
                                (assignment) => (

                                    <div
                                        className="assignment-card"
                                        key={assignment._id}
                                    >

                                        <div>

                                            <h3>
                                                {
                                                    assignment.title
                                                }
                                            </h3>

                                            <p>
                                                {
                                                    assignment.description ||
                                                    "No description"
                                                }
                                            </p>

                                            <small>
                                                Subject:{" "}
                                                {
                                                    assignment.subject ||
                                                    "Not specified"
                                                }
                                            </small>

                                        </div>

                                        <div className="assignment-actions">

                                            <div className="deadline">

                                                <span>
                                                    Deadline
                                                </span>

                                                <strong>
                                                    {
                                                        assignment.deadline
                                                            ? new Date(
                                                                assignment.deadline
                                                            ).toLocaleString()
                                                            : "No deadline"
                                                    }
                                                </strong>

                                            </div>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "8px",
                                                    flexWrap: "wrap",
                                                    justifyContent:
                                                        "flex-end"
                                                }}
                                            >

                                                <button
                                                    className="view-assignment-button"
                                                    onClick={() =>
                                                        startEdit(
                                                            assignment
                                                        )
                                                    }
                                                >
                                                    ✏️ Edit
                                                </button>

                                                <button
                                                    className="view-assignment-button"
                                                    onClick={() =>
                                                        deleteAssignment(
                                                            assignment._id
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        assignment._id
                                                    }
                                                    style={{
                                                        background:
                                                            "linear-gradient(135deg, #ff4d6d, #ff758f)"
                                                    }}
                                                >
                                                    {deletingId ===
                                                    assignment._id
                                                        ? "Deleting..."
                                                        : "🗑️ Delete"
                                                    }
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

                {/* ================= STATISTICS ================= */}

                <section className="stats-grid">

                    <div className="stat-card">

                        <span className="stat-icon">
                            📚
                        </span>

                        <div>

                            <h2>
                                {assignments.length}
                            </h2>

                            <p>
                                My Assignments
                            </p>

                        </div>

                    </div>

                    <div className="stat-card">

                        <span className="stat-icon">
                            📝
                        </span>

                        <div>

                            <h2>
                                {submissions.length}
                            </h2>

                            <p>
                                Total Submissions
                            </p>

                        </div>

                    </div>

                    <div className="stat-card">

                        <span className="stat-icon">
                            ⏳
                        </span>

                        <div>

                            <h2>
                                {
                                    submissions.filter(
                                        (item) =>
                                            item.status ===
                                            "pending"
                                    ).length
                                }
                            </h2>

                            <p>
                                Pending Reviews
                            </p>

                        </div>

                    </div>

                </section>

                {/* ================= STUDENT SUBMISSIONS ================= */}

                <section className="glass-panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                📚 Student Submissions
                            </h2>

                            <p>
                                Review and manage student
                                assignment submissions.
                            </p>

                        </div>

                    </div>

                    {submissions.length === 0 ? (

                        <div className="empty-state">

                            <span>
                                📭
                            </span>

                            <h3>
                                No submissions found
                            </h3>

                            <p>
                                Student submissions will
                                appear here after a student
                                submits an assignment.
                            </p>

                        </div>

                    ) : (

                        <div className="submission-list">

                            {submissions.map(
                                (submission) => (

                                    <div
                                        key={
                                            submission._id
                                        }
                                        className="submission-card"
                                    >

                                        {/* STUDENT */}

                                        <h3>
                                            👤{" "}
                                            {
                                                submission.student
                                                    ?.name ||
                                                "Student"
                                            }
                                        </h3>

                                        <p>
                                            📧{" "}
                                            {
                                                submission.student
                                                    ?.email ||
                                                "No email"
                                            }
                                        </p>

                                        {/* ASSIGNMENT */}

                                        <h3>
                                            📚{" "}
                                            {
                                                submission.assignment
                                                    ?.title ||
                                                "Assignment"
                                            }
                                        </h3>

                                        <p>
                                            Subject:{" "}
                                            {
                                                submission.assignment
                                                    ?.subject ||
                                                "Not specified"
                                            }
                                        </p>

                                        {/* ANSWER */}

                                        <h4>
                                            📝 Student Answer
                                        </h4>

                                        <div className="answer-box">
                                            {
                                                submission.answer ||
                                                "No answer provided"
                                            }
                                        </div>

                                        {/* STATUS */}

                                        <p>
                                            Status:{" "}
                                            <span
                                                className={`status-badge ${
                                                    submission.status ||
                                                    "pending"
                                                }`}
                                            >
                                                {
                                                    submission.status ||
                                                    "pending"
                                                }
                                            </span>
                                        </p>

                                        {/* FEEDBACK */}

                                        {submission.feedback && (
                                            <div className="existing-feedback">

                                                <strong>
                                                    Lecturer Feedback
                                                </strong>

                                                <p>
                                                    {
                                                        submission.feedback
                                                    }
                                                </p>

                                            </div>
                                        )}

                                        {/* REVIEW */}

                                        {submission.status ===
                                            "pending" && (

                                            <div className="review-section">

                                                {reviewingId ===
                                                    submission._id ? (

                                                    <div>

                                                        <textarea
                                                            rows="4"
                                                            value={
                                                                feedback
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                setFeedback(
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Enter feedback..."
                                                        />

                                                        <div className="review-buttons">

                                                            <button
                                                                className="approve-button"
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        submission._id,
                                                                        "approved"
                                                                    )
                                                                }
                                                            >
                                                                ✅ Approve
                                                            </button>

                                                            <button
                                                                className="reject-button"
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        submission._id,
                                                                        "rejected"
                                                                    )
                                                                }
                                                            >
                                                                ❌ Reject
                                                            </button>

                                                            <button
                                                                className="cancel-button"
                                                                onClick={() => {
                                                                    setReviewingId(
                                                                        null
                                                                    );

                                                                    setFeedback(
                                                                        ""
                                                                    );
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>

                                                        </div>

                                                    </div>

                                                ) : (

                                                    <button
                                                        className="review-button"
                                                        onClick={() => {
                                                            setReviewingId(
                                                                submission._id
                                                            );

                                                            setFeedback(
                                                                ""
                                                            );
                                                        }}
                                                    >
                                                        Review Submission
                                                    </button>

                                                )}

                                            </div>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default LecturerDashboard;

