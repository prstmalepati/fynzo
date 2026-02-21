import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CurrencyProvider } from './context/CurrencyContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Investments from './pages/Investments';
import LifestyleBasket from './pages/LifestyleBasket';
import AntiPortfolio from './pages/AntiPortfolio';
import ScenarioBranching from './pages/ScenarioBranching';
import GoalTracker from './pages/GoalTracker';
import Calculators from './pages/Calculators';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CurrencyProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/investments" 
                element={
                  <ProtectedRoute>
                    <Investments />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/lifestyle-basket" 
                element={
                  <ProtectedRoute>
                    <LifestyleBasket />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/anti-portfolio" 
                element={
                  <ProtectedRoute>
                    <AntiPortfolio />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/scenario-branching" 
                element={
                  <ProtectedRoute>
                    <ScenarioBranching />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/goal-tracker" 
                element={
                  <ProtectedRoute>
                    <GoalTracker />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/calculators" 
                element={
                  <ProtectedRoute>
                    <Calculators />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />

              {/* Catch all - redirect to login */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CurrencyProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
