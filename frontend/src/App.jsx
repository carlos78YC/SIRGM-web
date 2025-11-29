import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Login from './components/Login';
import ReportesTable from './components/ReportesTable';
import ReporteDetail from './components/ReporteDetail';
import Stats from './pages/Stats';
import AdminLogin from './pages/AdminLogin';
import UserManagement from './pages/UserManagement';
import DatabaseTools from './pages/DatabaseTools';
import NoAccess from './pages/NoAccess';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/reportes"
            element={
              <ProtectedRoute>
                <ReportesTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reportes/:id"
            element={
              <ProtectedRoute>
                <ReporteDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/estadisticas"
            element={
              <ProtectedRoute>
                <Stats />
              </ProtectedRoute>
            }
          />
          {/* Rutas de administración */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <UserManagement />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/export"
            element={
              <AdminProtectedRoute>
                <DatabaseTools />
              </AdminProtectedRoute>
            }
          />
          <Route path="/admin/no-access" element={<NoAccess />} />
          <Route path="/" element={<Navigate to="/reportes" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
