import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages - Import only what exists
import Dashboard from './pages/Dashboard';
import Investments from './pages/Investments';
import LifestyleBasket from './pages/LifestyleBasket';
import AntiPortfolio from './pages/AntiPortfolio';
// import ScenarioBranching from './pages/ScenarioBranching';
// import GoalTracker from './pages/GoalTracker';
import Calculators from './pages/Calculators';
import Settings from './pages/Settings';

// Import Projection if it exists, otherwise comment out
// import Projection from './pages/Projection';

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <Routes>
            {/* Root redirects to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

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

            {/* Temporary Disabled
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
	   */}

            {/* Uncomment if you have Projection page */}
            {/* <Route 
              path="/projection" 
              element={
                <ProtectedRoute>
                  <Projection />
                </ProtectedRoute>
              } 
            /> */}

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

            {/* Catch all - redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
