import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Investments from './pages/Investments';
import LifestyleBasket from './pages/LifestyleBasket';
import AntiPortfolio from './pages/AntiPortfolio';
import Calculators from './pages/Calculators';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/investments" element={<ProtectedRoute><Investments /></ProtectedRoute>} />
            <Route path="/lifestyle-basket" element={<ProtectedRoute><LifestyleBasket /></ProtectedRoute>} />
            <Route path="/anti-portfolio" element={<ProtectedRoute><AntiPortfolio /></ProtectedRoute>} />
            <Route path="/calculators" element={<ProtectedRoute><Calculators /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;