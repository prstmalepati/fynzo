import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Login from "./pages/Login";
import ProjectionPage from "./pages/ProjectionPage";

// Protected pages (Login Required)
import Dashboard from "./pages/Dashboard";
import Investments from "./pages/Investments";
import Calculators from "./pages/Calculators";
import Settings from "./pages/Settings";

// Optional: Uncomment if you want to use the extended landing page
// import LandingPageExtended from './pages/LandingPageExtended';

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
          
          {/* Option 1: Simple redirect to login (CURRENT) */}
          <Route 
            path="/" 
            element={<Navigate to="/login" replace />}
          />
          
          {/* Option 2: Use extended landing page (UNCOMMENT to use) */}
          {/* 
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <LandingPageExtended />
              </PublicRoute>
            } 
          />
          */}
          
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          
          {/* Public projection page - accessible without login */}
          <Route path="/projection" element={<ProjectionPage />} />

          {/* Protected routes - Login required */}
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
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </CurrencyProvider>
    </AuthProvider>
  );
}
