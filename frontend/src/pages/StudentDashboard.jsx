
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function StudentDashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ===============================
    // LOAD USER AND DASHBOARD
    // ===============================

    useEffect(() => {

        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token) {
            navigate("/login");
            return;
        }


        if (storedUser) {

            try {

                setUser(
                    JSON.parse(storedUser)
                );

            } catch (err) {

                console.error(
                    "Invalid user data:",
                    err
                );

            }

        }


        loadDashboard();

    }, [navigate]);


    // ===============================
    // LOAD ASSIGNMENTS + NOTIFICATIONS
    // ===============================

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");


            const assignmentResponse =
                await API.get("/assignments");


            const notificationResponse =
                await API.get("/notifications");


            const assignmentData =
                assignmentResponse.data;


            const notificationData =
                notificationResponse.data;


            setAssignments(
                assignmentData.assignments ||
                assignmentData ||
                []
            );


            const notificationList =
                Array.isArray(
                    notificationData.notifications
                )
                    ? notificationData.notifications
                    : [];


            console.log(
                "Notifications received:",
                notificationList
            );


            setNotifications(
                notificationList
            );


        } catch (err) {

            console.error(
                "Dashboard error:",
                err
            );


            setError(
                err.response?.data?.message ||
                "Failed to load dashboard"
            );

        } finally {

            setLoading(false);

        }

    };


    // ===============================
    // MARK NOTIFICATION AS READ
    // ===============================

    const markAsRead = async (id) => {

        try {

            await API.put(
                `/notifications/${id}/read`
            );


            setNotifications(
                (previousNotifications) =>
                    previousNotifications.map(
                        (notification) =>
                            notification._id === id
                                ? {
                                    ...notification,
                                    isRead: true
                                }
                                : notification
                    )
            );


        } catch (err) {

            console.error(
                "Failed to mark notification as read:",
                err
            );

        }

    };


    // ===============================
    // LOGOUT
    // ===============================

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };


    // ===============================
    // UNREAD COUNT
    // ===============================

    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.isRead
        ).length;


    // ===============================
    // LOADING
    // ===============================

    if (loading) {

        return (

            <div className="dashboard-loading">

                Loading dashboard...

            </div>

        );

    }


    // ===============================
    // MAIN DASHBOARD
    // ===============================

    return (

        <div className="dashboard">


            {/* ================= NAVBAR ================= */}

            <nav className="dashboard-nav">


                <div className="brand">

                    Student Task Manager

                </div>


                <div className="nav-user">


                    <span>

                        👋{" "}
                        {user?.name || "Student"}

                    </span>


                    {/* MY SUBMISSIONS */}

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate(
                                "/student/submissions"
                            )
                        }
                    >

                        📚 My Submissions

                    </button>


                    {/* LOGOUT */}

                    <button
                        onClick={logout}
                    >

                        Logout

                    </button>


                </div>

            </nav>


            {/* ================= CONTENT ================= */}

            <main className="dashboard-content">


                {/* ================= WELCOME ================= */}

                <div className="welcome-section">


                    <div>


                        <p className="small-title">

                            STUDENT DASHBOARD

                        </p>


                        <h1>

                            Welcome,{" "}

                            {user?.name || "Student"} 👋

                        </h1>


                        <p>

                            Keep track of your assignments
                            and notifications.

                        </p>


                    </div>

                </div>


                {/* ================= ERROR ================= */}

                {error && (

                    <div className="dashboard-error">

                        {error}

                    </div>

                )}


                {/* ================= STATISTICS ================= */}

                <div className="stats-grid">


                    {/* ASSIGNMENTS */}

                    <div className="stat-card">


                        <span className="stat-icon">

                            📚

                        </span>


                        <div>


                            <h2>

                                {assignments.length}

                            </h2>


                            <p>

                                Assignments

                            </p>


                        </div>

                    </div>


                    {/* NOTIFICATIONS */}

                    <div className="stat-card">


                        <span className="stat-icon">

                            🔔

                        </span>


                        <div>


                            <h2>

                                {unreadCount}

                            </h2>


                            <p>

                                Unread Notifications

                            </p>


                        </div>

                    </div>


                    {/* SUBMISSIONS */}

                    <div
                        className="stat-card"
                        onClick={() =>
                            navigate(
                                "/student/submissions"
                            )
                        }
                        style={{
                            cursor: "pointer"
                        }}
                    >


                        <span className="stat-icon">

                            📝

                        </span>


                        <div>


                            <h2>

                                View

                            </h2>


                            <p>

                                My Submissions

                            </p>


                        </div>

                    </div>


                </div>


                {/* ================= TWO COLUMN GRID ================= */}

                <div className="dashboard-grid">


                    {/* ================= ASSIGNMENTS ================= */}

                    <section className="glass-panel">


                        <div className="panel-header">


                            <div>


                                <h2>

                                    📚 Assignments

                                </h2>


                                <p>

                                    Your available assignments

                                </p>


                            </div>


                        </div>


                        {assignments.length === 0 ? (

                            <div className="empty-state">


                                <span>

                                    📭

                                </span>


                                <p>

                                    No assignments available.

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


                                        {/* ASSIGNMENT INFO */}

                                        <div>


                                            <h3>

                                                {assignment.title}

                                            </h3>


                                            <p>

                                                {assignment.description ||
                                                    "No description"}

                                            </p>


                                            <small>

                                                Subject:{" "}

                                                {assignment.subject ||
                                                    "Not specified"}

                                            </small>


                                        </div>


                                        {/* ACTIONS */}

                                        <div className="assignment-actions">


                                            <div className="deadline">


                                                <span>

                                                    Deadline

                                                </span>


                                                <strong>


                                                    {assignment.deadline

                                                        ? new Date(
                                                            assignment.deadline
                                                        ).toLocaleDateString()

                                                        : "No deadline"

                                                    }


                                                </strong>


                                            </div>


                                            <button
                                                className="view-assignment-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/student/assignment/${assignment._id}`
                                                    )
                                                }
                                            >

                                                View / Submit

                                            </button>


                                        </div>


                                    </div>

                                ))}

                            </div>

                        )}

                    </section>


                    {/* ================= NOTIFICATIONS ================= */}

                    <section className="glass-panel">


                        <div className="panel-header">


                            <div>


                                <h2>

                                    🔔 Notifications

                                </h2>


                                <p>

                                    Recent notifications

                                </p>


                            </div>


                            {unreadCount > 0 && (

                                <span className="notification-badge">

                                    {unreadCount}

                                </span>

                            )}


                        </div>


                        {notifications.length === 0 ? (

                            <div className="empty-state">


                                <span>

                                    🔕

                                </span>


                                <p>

                                    No notifications.

                                </p>


                            </div>

                        ) : (

                            <div className="notification-list">


                                {notifications.map(
                                    (notification) => (


                                    <div
                                        className={
                                            `notification-item ${
                                                notification.isRead
                                                    ? "read"
                                                    : "unread"
                                            }`
                                        }
                                        key={notification._id}
                                    >


                                        <div className="notification-icon">

                                            🔔

                                        </div>


                                        <div className="notification-content">


                                            <p>

                                                {
                                                    notification.message
                                                }

                                            </p>


                                            {!notification.isRead && (

                                                <button
                                                    onClick={() =>
                                                        markAsRead(
                                                            notification._id
                                                        )
                                                    }
                                                >

                                                    Mark as read

                                                </button>

                                            )}


                                        </div>


                                    </div>

                                ))}

                            </div>

                        )}

                    </section>


                </div>


            </main>

        </div>

    );

}

export default StudentDashboard;

