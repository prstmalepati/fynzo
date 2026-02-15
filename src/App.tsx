import { Routes, Route, Navigate } from "react-router-dom";

import Overview from "./pages/Overview";
import ProjectionPage from "./pages/ProjectionPage";
import Calculators from "./pages/Calculators";
import Taxes from "./pages/Taxes";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Overview />} />
      <Route path="/projection" element={<ProjectionPage />} />
      <Route path="/calculators" element={<Calculators />} />
      <Route path="/taxes" element={<Taxes />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
