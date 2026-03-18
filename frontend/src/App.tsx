import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/providers/QueryProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Toaster } from '@/components/ui/sonner';
import LoginPage from '@/pages/LoginPage';
import PeriodosPage from '@/pages/PeriodosPage';
import MateriasPage from '@/pages/MateriasPage';
import TareasPage from '@/pages/TareasPage';
import CalendarioPage from '@/pages/CalendarioPage';
import HorariosPage from '@/pages/HorariosPage';

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/periodos" element={<PeriodosPage />} />
              <Route path="/materias" element={<MateriasPage />} />
              <Route path="/tareas" element={<TareasPage />} />
              <Route path="/horarios" element={<HorariosPage />} />
              <Route path="/calendario" element={<CalendarioPage />} />
            </Route>

            {/* Redirect root to periodos */}
            <Route path="*" element={<Navigate to="/periodos" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
