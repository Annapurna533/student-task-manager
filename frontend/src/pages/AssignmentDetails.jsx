
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function AssignmentDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [assignment, setAssignment] = useState(null);
    const [answer, setAnswer] = useState("");

    const [submission, setSubmission] = useState(null);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // ===============================
    // LOAD ASSIGNMENT + SUBMISSION
    // ===============================

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetchData();

    }, [id]);


    // ===============================
    // FETCH DATA
    // ===============================

    const fetchData = async () => {

        try {

            setLoading(true);
            setError("");

            // Get assignment
            const assignmentResponse =
                await API.get(
                    `/assignments/${id}`
                );

            const assignmentData =
                assignmentResponse.data.assignment ||
                assignmentResponse.data;

            setAssignment(assignmentData);


            // Get student's submissions
            const submissionResponse =
                await API.get(
                    "/submissions/my"
                );

            const submissions =
                submissionResponse.data.submissions || [];


            // Find submission for this assignment
            const mySubmission =
                submissions.find(
                    (item) =>
                        item.assignment?._id === id ||
                        item.assignment === id
                );


            setSubmission(
                mySubmission || null
            );


        } catch (error) {

            console.error(
                "Assignment error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load assignment"
            );

        } finally {

            setLoading(false);

        }

    };


    // ===============================
    // SUBMIT ASSIGNMENT
    // ===============================

    const submitAssignment = async (e) => {

        e.preventDefault();


        if (!answer.trim()) {

            setError(
                "Please write your answer before submitting."
            );

            return;

        }


        try {

            setSubmitting(true);
            setError("");
            setMessage("");


            const response =
                await API.post(
                    "/submissions",
                    {
                        assignmentId: id,
                        answer: answer.trim()
                    }
                );


            setMessage(
                response.data.message ||
                "Assignment submitted successfully!"
            );


            setAnswer("");


            // Save newly created submission
            setSubmission(
                response.data.submission
            );


        } catch (error) {

            console.error(
                "Submission error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to submit assignment"
            );

        } finally {

            setSubmitting(false);

        }

    };


    // ===============================
    // LOADING
    // ===============================

    if (loading) {

        return (
            <div className="dashboard-loading">
                Loading assignment...
            </div>
        );

    }


    // ===============================
    // ASSIGNMENT NOT FOUND
    // ===============================

    if (!assignment) {

        return (

            <div className="dashboard">

                <main className="dashboard-content">

                    <section className="glass-panel">

                        <h2>
                            ❌ Assignment not found
                        </h2>


                        <button
                            className="view-assignment-button"
                            onClick={() =>
                                navigate("/student")
                            }
                        >
                            ← Back to Dashboard
                        </button>

                    </section>

                </main>

            </div>

        );

    }


    // ===============================
    // PAGE
    // ===============================

    return (

        <div className="dashboard">


            {/* ================= NAVBAR ================= */}

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


            {/* ================= MAIN ================= */}

            <main className="dashboard-content">

                <div className="assignment-details-container">


                    {/* ================= ASSIGNMENT ================= */}

                    <section className="glass-panel assignment-details">

                        <div className="small-title">
                            ASSIGNMENT
                        </div>


                        <h1>
                            {assignment.title}
                        </h1>


                        <div className="assignment-meta">

                            <span>
                                📚{" "}
                                {assignment.subject ||
                                    "Subject not specified"}
                            </span>


                            <span>
                                📅{" "}

                                {assignment.deadline
                                    ? new Date(
                                        assignment.deadline
                                    ).toLocaleDateString()
                                    : "No deadline"
                                }

                            </span>

                        </div>


                        <div className="assignment-description">

                            <h3>
                                Description
                            </h3>


                            <p>
                                {assignment.description ||
                                    "No description provided."}
                            </p>

                        </div>

                    </section>


                    {/* ================= SUBMISSION ================= */}

                    <section className="glass-panel submission-panel">


                        <div className="panel-header">

                            <div>

                                <h2>
                                    📝 Submission
                                </h2>

                                <p>
                                    Your assignment submission status
                                </p>

                            </div>

                        </div>


                        {/* SUCCESS MESSAGE */}

                        {message && (

                            <div className="success">
                                {message}
                            </div>

                        )}


                        {/* ERROR MESSAGE */}

                        {error && (

                            <div className="error">
                                {error}
                            </div>

                        )}


                        {/* ================= ALREADY SUBMITTED ================= */}

                        {submission ? (

                            <div className="submission-status">

                                <div className="success">

                                    ✅ Assignment submitted successfully!

                                </div>


                                <div className="assignment-meta">

                                    <span>
                                        📌 Status:{" "}
                                        <strong>
                                            {submission.status ||
                                                "pending"}
                                        </strong>
                                    </span>


                                    <span>
                                        📅 Submitted:{" "}

                                        {submission.createdAt
                                            ? new Date(
                                                submission.createdAt
                                            ).toLocaleDateString()
                                            : "Recently"
                                        }

                                    </span>

                                </div>


                                {/* STUDENT ANSWER */}

                                <div className="assignment-description">

                                    <h3>
                                        📝 Your Answer
                                    </h3>


                                    <p>
                                        {submission.answer}
                                    </p>

                                </div>


                                {/* FEEDBACK */}

                                {submission.feedback && (

                                    <div className="assignment-description">

                                        <h3>
                                            💬 Lecturer Feedback
                                        </h3>


                                        <p>
                                            {submission.feedback}
                                        </p>

                                    </div>

                                )}

                            </div>

                        ) : (

                            /* ================= NOT SUBMITTED ================= */

                            <form
                                onSubmit={submitAssignment}
                                className="submission-form"
                            >

                                <textarea
                                    value={answer}
                                    onChange={(e) =>
                                        setAnswer(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Write your answer here..."
                                    rows="12"
                                />


                                <button
                                    type="submit"
                                    disabled={submitting}
                                >

                                    {submitting
                                        ? "Submitting..."
                                        : "Submit Assignment"
                                    }

                                </button>

                            </form>

                        )}

                    </section>

                </div>

            </main>

        </div>

    );

}

export default AssignmentDetails;

