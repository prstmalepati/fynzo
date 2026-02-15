import { Routes, Route } from "react-router-dom";

import Overview from "./pages/Overview";
import Wealth from "./pages/Wealth";
import Projection from "./pages/ProjectionPage.tsx";
import Calculators from "./pages/Calculators";
import Taxes from "./pages/Taxes";
import Settings from "./pages/Settings";
import Investments from "./pages/wealth/Investments";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Overview />} />
      <Route path="/wealth" element={<Wealth />} />
      <Route path="/projection" element={<Projection />} />
      <Route path="/investments" element={<Investments />} />
      <Route path="/calculators" element={<Calculators />} />
      <Route path="/taxes" element={<Taxes />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

