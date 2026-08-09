# 📚 Student Task Manager

A web-based **Student Task Manager** that helps lecturers create and manage assignments while allowing students to view assignments, submit answers, and track their submission status.

The system provides separate dashboards for **Students** and **Lecturers**, with role-based functionality for managing assignments and submissions.

---

## 🚀 Features

### 👨‍🎓 Student

* Student registration and login
* Student dashboard
* View available assignments
* View assignment details
* Submit assignment answers
* View submission history
* Track submission status
* View lecturer feedback
* Logout functionality

### 👨‍🏫 Lecturer

* Lecturer registration and login
* Lecturer dashboard
* Create assignments
* Edit assignments
* Delete assignments
* Set assignment deadlines
* View student submissions
* Review submissions
* Approve or reject submissions
* Provide feedback to students
* View assignment and submission statistics
* Logout functionality

---

## 🛠️ Technologies Used

### Frontend

* React.js
* JavaScript
* HTML
* CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* REST API

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Postman
* MongoDB Atlas

---

## 🏗️ Project Architecture

```text
Student Task Manager
│
├── Frontend
│   ├── React
│   ├── React Router
│   ├── Axios
│   └── CSS / Glassmorphism UI
│
├── Backend
│   ├── Node.js
│   ├── Express.js
│   ├── Controllers
│   ├── Routes
│   └── Models
│
└── Database
    └── MongoDB
```

---

## 📂 Main Features Flow

```text
                    Student Task Manager
                            │
             ┌──────────────┴──────────────┐
             │                             │
          Student                       Lecturer
             │                             │
          Login                          Login
             │                             │
       Student Dashboard          Lecturer Dashboard
             │                             │
       View Assignments             Create Assignment
             │                             │
       Assignment Details            Edit Assignment
             │                             │
       Submit Answer                Delete Assignment
             │                             │
       My Submissions              View Submissions
             │                             │
       View Feedback               Review Submission
                                           │
                                   Approve / Reject
                                           │
                                       Feedback
```

---

## 🎨 User Interface

The application uses a modern **glassmorphism-based interface** with:

* Responsive design
* Gradient backgrounds
* Glass-effect cards
* Smooth animations
* Interactive buttons
* Mobile-friendly layouts
* Student and lecturer specific dashboards

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Annapurna533/student-task-manager.git
```

### 2. Navigate to the project

```bash
cd student-task-manager
```

### 3. Install frontend dependencies

Navigate to the frontend folder:

```bash
cd frontend
npm install
```

### 4. Install backend dependencies

Open another terminal and navigate to the backend folder:

```bash
cd backend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the backend folder.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Do **not** upload your `.env` file to GitHub.

---

## ▶️ Running the Project

### Start Backend

Inside the backend folder:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

### Start Frontend

Inside the frontend folder:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

## 🔑 User Roles

The application supports two roles:

| Role     | Main Functions                                      |
| -------- | --------------------------------------------------- |
| Student  | View assignments, submit answers, track submissions |
| Lecturer | Create, edit, delete and review assignments         |

---

## 📊 Project Highlights

* Role-based user experience
* RESTful backend APIs
* MongoDB database integration
* Assignment CRUD operations
* Student submission management
* Lecturer feedback system
* Responsive React interface
* Modern glassmorphism UI
* Authentication and protected user flow

---

## 🔒 Security

The project uses environment variables for sensitive configuration such as:

* MongoDB connection details
* JWT secrets
* Other private credentials

Sensitive information should never be committed to GitHub.

---

## 🔮 Future Enhancements

Possible future improvements include:

* Email notifications
* Assignment file uploads
* Automatic deadline reminders
* Lecturer analytics dashboard
* Student performance analytics
* Search and filtering
* Pagination
* Dark/light theme switching
* Deployment using cloud platforms

---

## 👩‍💻 Author

**Annapurna Reddy**

Computer Science Engineering Student

GitHub:
https://github.com/Annapurna533

---

## ⭐ Project

If you find this project useful, consider giving the repository a ⭐ on GitHub.
