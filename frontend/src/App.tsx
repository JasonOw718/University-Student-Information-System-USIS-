import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './components/auth/AuthPage';
import { StudentDashboard } from './components/student/StudentDashboard';
import { ProfilePage } from './components/student/ProfilePage';
import { EnrolledClasses } from './components/student/EnrolledClasses';
import { LecturerDashboard } from './components/lecturer/LecturerDashboard';
import { PendingRegistrations } from './components/lecturer/PendingRegistrations';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<ProfilePage />} />
        <Route path="/student/enrolled" element={<EnrolledClasses />} />

        {/* Lecturer Routes */}
        <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
        <Route path="/lecturer/pending" element={<PendingRegistrations />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
