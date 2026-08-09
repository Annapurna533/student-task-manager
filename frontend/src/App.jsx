
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/StudentDashboard";
import LecturerDashboard from "./pages/LecturerDashboard";

import AssignmentDetails from "./pages/AssignmentDetails";
import MySubmissions from "./pages/MySubmissions";


function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* =========================
                    DEFAULT
                ========================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />


                {/* =========================
                    AUTH
                ========================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =========================
                    STUDENT
                ========================= */}

                <Route
                    path="/student"
                    element={<StudentDashboard />}
                />

                <Route
                    path="/student/assignment/:id"
                    element={<AssignmentDetails />}
                />

                <Route
                    path="/student/submissions"
                    element={<MySubmissions />}
                />


                {/* =========================
                    LECTURER
                ========================= */}

                <Route
                    path="/lecturer"
                    element={<LecturerDashboard />}
                />


                {/* =========================
                    UNKNOWN PAGE
                ========================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;

