import { Link, Outlet } from "react-router-dom";

export default function Wealth() {
  return (
    <div style={{ padding: 32 }}>
      <h2>Wealth</h2>

      <nav style={{ marginBottom: 16 }}>
        <Link to="investments">Investments</Link>
      </nav>

      <Outlet />
    </div>
  );
}
