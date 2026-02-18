import SidebarLayout from '../components/SidebarLayout';

export default function Settings() {
  return (
    <SidebarLayout>
      <div className="p-8">
        <h1 className="text-4xl font-bold text-secondary mb-4" style={{ fontFamily: "'Crimson Pro', serif" }}>
          Settings
        </h1>
        <p className="text-slate-600">Settings page coming soon...</p>
      </div>
    </SidebarLayout>
  );
}