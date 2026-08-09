
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function MySubmissions() {

    const navigate = useNavigate();

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ===============================
    // LOAD MY SUBMISSIONS
    // ===============================

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetchSubmissions();

    }, []);

    // ===============================
    // FETCH SUBMISSIONS
    // ===============================

    const fetchSubmissions = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await API.get(
                "/submissions/my"
            );

            setSubmissions(
                response.data.submissions || []
            );

        } catch (error) {

            console.error(
                "Submissions error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load submissions"
            );

        } finally {

            setLoading(false);

        }
    };

    // ===============================
    // LOADING
    // ===============================

    if (loading) {

        return (
            <div className="dashboard-loading">
                Loading submissions...
            </div>
        );

    }

    // ===============================
    // PAGE
    // ===============================

    return (

        <div className="dashboard">

            {/* ===============================
                NAVBAR
            =============================== */}

            <nav className="dashboard-nav">

                <div className="brand">
                    Student Task Manager
                </div>

                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/student")
                    }
                >
                    ← Dashboard
                </button>

            </nav>


            {/* ===============================
                MAIN CONTENT
            =============================== */}

            <main className="dashboard-content">

                <section className="glass-panel">

                    <div className="panel-header">

                        <div>

                            <div className="small-title">
                                SUBMISSIONS
                            </div>

                            <h2>
                                My Submissions 📝
                            </h2>

                            <p>
                                View your submitted assignments
                                and lecturer feedback.
                            </p>

                        </div>

                    </div>


                    {/* ===============================
                        ERROR
                    =============================== */}

                    {error && (

                        <div className="dashboard-error">
                            {error}
                        </div>

                    )}


                    {/* ===============================
                        NO SUBMISSIONS
                    =============================== */}

                    {!error &&
                        submissions.length === 0 && (

                            <div className="empty-state">

                                <span>📝</span>

                                <h3>
                                    No submissions yet
                                </h3>

                                <p>
                                    You haven't submitted
                                    any assignments.
                                </p>

                                <button
                                    className="view-assignment-button"
                                    onClick={() =>
                                        navigate("/student")
                                    }
                                >
                                    View Assignments
                                </button>

                            </div>

                        )
                    }


                    {/* ===============================
                        SUBMISSION LIST
                    =============================== */}

                    {submissions.length > 0 && (

                        <div className="submission-list">

                            {submissions.map(
                                (submission) => {

                                    const assignment =
                                        submission.assignment;

                                    return (

                                        <div
                                            className="submission-card"
                                            key={submission._id}
                                        >

                                            {/* ASSIGNMENT TITLE */}

                                            <h3>
                                                {assignment?.title ||
                                                    "Assignment"}
                                            </h3>


                                            {/* SUBJECT */}

                                            <p>
                                                📚{" "}
                                                {assignment?.subject ||
                                                    "Subject not specified"}
                                            </p>


                                            {/* DEADLINE */}

                                            <p>
                                                📅 Deadline:{" "}

                                                {assignment?.deadline
                                                    ? new Date(
                                                        assignment.deadline
                                                    ).toLocaleDateString()
                                                    : "Not available"}
                                            </p>


                                            {/* STATUS */}

                                            <div>

                                                <strong>
                                                    Status:{" "}
                                                </strong>

                                                <span
                                                    className={`status-badge ${
                                                        submission.status ||
                                                        "pending"
                                                    }`}
                                                >
                                                    {submission.status ||
                                                        "pending"}
                                                </span>

                                            </div>


                                            {/* ANSWER */}

                                            <h4>
                                                Your Answer
                                            </h4>

                                            <div className="answer-box">
                                                {submission.answer ||
                                                    "No answer available"}
                                            </div>


                                            {/* FEEDBACK */}

                                            {submission.feedback && (

                                                <div className="existing-feedback">

                                                    <strong>
                                                        Lecturer Feedback
                                                    </strong>

                                                    <p>
                                                        {submission.feedback}
                                                    </p>

                                                </div>

                                            )}

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )}

                </section>

            </main>

        </div>

    );
}

export default MySubmissions;

