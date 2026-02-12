import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FinanceProvider } from "./context/FinanceContext";
import Layout from "./components/Layout";

import Landing from "./pages/Landing";
import Overview from "./pages/Overview";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Analytics from "./pages/Analytics";
import Taxes from "./pages/Taxes";
import Loans from "./pages/Loans";
import Projection from "./pages/Projection";
import Insights from "./pages/Insights";
import Fire from "./pages/Fire";
import Goals from "./pages/Goals";
import Assistant from "./pages/Assistant";
import Onboarding from "./pages/Onboarding";

export default function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/*" element={<Layout />}>
            <Route path="overview" element={<Overview />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="taxes" element={<Taxes />} />
            <Route path="loans" element={<Loans />} />
            <Route path="projection" element={<Projection />} />
            <Route path="insights" element={<Insights />} />
            <Route path="fire" element={<Fire />} />
            <Route path="goals" element={<Goals />} />
            <Route path="assistant" element={<Assistant />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FinanceProvider>
  );
}
