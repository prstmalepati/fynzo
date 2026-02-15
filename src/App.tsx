import { Routes, Route } from "react-router-dom"
import Overview from "./pages/Overview"
import Wealth from "./pages/Wealth"
import Projection from "./pages/Projection"
import Calculators from "./pages/Calculators"
import Taxes from "./pages/Taxes"
import Settings from "./pages/Settings"
import Investments from "./pages/wealth/Investments"

export default function App() {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/wealth" element={<Wealth />} />
        <Route path="/wealth/investments" element={<Investments />} />
        <Route path="/projection" element={<Projection />} />
        <Route path="/calculators" element={<Calculators />} />
        <Route path="/taxes" element={<Taxes />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  )
}
