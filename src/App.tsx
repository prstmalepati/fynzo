import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LifestyleBasket from './pages/LifestyleBasket';
import AntiPortfolio from './pages/AntiPortfolio';

// Public pages
import LandingPageExtended from './pages/LandingPageExtended';
import Login from "./pages/Login";
import ProjectionPage from "./pages/ProjectionPage";

// Protected pages (Login Required)
import Dashboard from "./pages/Dashboard";
import Investments from "./pages/Investments";
import Calculators from "./pages/Calculators";
import Settings from "./pages/Settings";

// Public Route Component (redirects if logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Routes>
          {/* Public routes - No login required */}
          
          {/* Homepage: Extended Landing Page */}
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <LandingPageExtended />
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          
          <Route path="/projection" element={<ProjectionPage />} />

          {/* Protected routes - Login required */}
      // Protected routes
		<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
		<Route path="/investments" element={<ProtectedRoute><Investments /></ProtectedRoute>} />
		<Route path="/lifestyle-basket" element={<ProtectedRoute><LifestyleBasket /></ProtectedRoute>} />
		<Route path="/projection" element={<ProtectedRoute><ProjectionPage /></ProtectedRoute>} />
		<Route path="/calculators" element={<ProtectedRoute><Calculators /></ProtectedRoute>} />
		<Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
		<Route path="/anti-portfolio" element={<ProtectedRoute><AntiPortfolio /></ProtectedRoute>} />

          {/* Catch all - redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CurrencyProvider>
    </AuthProvider>
  );
}
