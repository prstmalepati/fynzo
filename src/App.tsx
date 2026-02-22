import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { LocaleProvider } from './context/LocaleContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPageExtended from './pages/LandingPageExtended';
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
import Admin from './pages/Admin';
import SecurityPrivacy from './pages/SecurityPrivacy';
import Account from './pages/Account';
import WealthProjection from './pages/WealthProjection';
import Debts from './pages/Debts';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <LocaleProvider>
          <CurrencyProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPageExtended />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/wealth-projection" element={<ProtectedRoute><WealthProjection /></ProtectedRoute>} />
                <Route path="/investments" element={<ProtectedRoute><Investments /></ProtectedRoute>} />
                <Route path="/debts" element={<ProtectedRoute><Debts /></ProtectedRoute>} />
                <Route path="/lifestyle-basket" element={<ProtectedRoute><LifestyleBasket /></ProtectedRoute>} />
                <Route path="/anti-portfolio" element={<ProtectedRoute><AntiPortfolio /></ProtectedRoute>} />
                <Route path="/scenario-branching" element={<ProtectedRoute><ScenarioBranching /></ProtectedRoute>} />
                <Route path="/goal-tracker" element={<ProtectedRoute><GoalTracker /></ProtectedRoute>} />
                <Route path="/calculators" element={<ProtectedRoute><Calculators /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                <Route path="/security" element={<ProtectedRoute><SecurityPrivacy /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </CurrencyProvider>
        </LocaleProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
