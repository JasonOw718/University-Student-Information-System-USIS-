import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './components/auth/AuthPage';
import { StudentDashboard } from './components/student/StudentDashboard';
import { ProfilePage } from './components/student/ProfilePage';
import { EnrolledClasses } from './components/student/EnrolledClasses';
import { LecturerDashboard } from './components/lecturer/LecturerDashboard';
import { PendingRegistrations } from './components/lecturer/PendingRegistrations';

import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student/profile" element={
          <ProtectedRoute allowedRoles={['student']}>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/student/enrolled" element={
          <ProtectedRoute allowedRoles={['student']}>
            <EnrolledClasses />
          </ProtectedRoute>
        } />

        {/* Lecturer Routes */}
        <Route path="/lecturer/dashboard" element={
          <ProtectedRoute allowedRoles={['lecturer']}>
            <LecturerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/lecturer/pending" element={
          <ProtectedRoute allowedRoles={['lecturer']}>
            <PendingRegistrations />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
