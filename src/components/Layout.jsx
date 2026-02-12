import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  const link = "block px-4 py-2 rounded-lg hover:bg-teal-50";
  const active = "bg-teal-100 text-teal-700 font-semibold";

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r p-4 space-y-2">
        <h1 className="text-2xl font-bold text-fynzo mb-6">Fynzo</h1>
        {[
          ["overview","Overview"],
          ["transactions","Transactions"],
          ["budgets","Budgets"],
          ["analytics","Analytics"],
          ["taxes","Taxes"],
          ["loans","Loans"],
          ["projection","Projection"],
          ["insights","Insights"],
          ["fire","FIRE"],
          ["goals","Goals"],
          ["assistant","Assistant"]
        ].map(([to,label])=>(
          <NavLink key={to} to={`/${to}`} className={({isActive})=>`${link} ${isActive&&active}`}>
            {label}
          </NavLink>
        ))}
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
