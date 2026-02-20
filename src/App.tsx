import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Investments from './pages/Investments';
import LifestyleBasket from './pages/LifestyleBasket';
import AntiPortfolio from './pages/AntiPortfolio';
import ScenarioBranching from './pages/ScenarioBranching';  // ← NEW
import GoalTracker from './pages/GoalTracker';              // ← NEW
import Projection from './pages/Projection';
import Calculators from './pages/Calculators';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<LandingPage />} />

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

            {/* ✅ NEW: Month 3-4 Features */}
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
              path="/projection" 
              element={
                <ProtectedRoute>
                  <Projection />
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

            {/* Catch all - redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
