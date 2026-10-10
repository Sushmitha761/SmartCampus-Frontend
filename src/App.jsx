
import { BrowserRouter, Routes, Route } from "react-router-dom";

import StudentLogin from "./StudentLogin";
import StudentRegister from "./StudentRegister";

import Dashboard from "./Dashboard";
import Complaint from "./Complaint";
import MyComplaints from "./MyComplaints";
import Profile from "./Profile";

import AdminLogin from "./AdminLogin";
import AdminRegister from "./AdminRegister";
import AdminDashboard from "./AdminDashboard";
import AdminComplaints from "./AdminComplaints";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* STUDENT LOGIN */}
        <Route path="/" element={<StudentLogin />} />
        <Route path="/student-login" element={<StudentLogin />} />

        {/* STUDENT REGISTRATION */}
        <Route path="/student-register" element={<StudentRegister />} />

        {/* STUDENT DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* COMPLAINTS */}
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/my-complaints" element={<MyComplaints />} />

        {/* STUDENT PROFILE */}
        <Route path="/profile" element={<Profile />} />

        {/* ADMIN LOGIN */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ADMIN REGISTRATION */}
        <Route
          path="/admin-register"
          element={<AdminRegister />}
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        {/* ADMIN COMPLAINTS */}
        <Route
          path="/admin-complaints"
          element={<AdminComplaints />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
