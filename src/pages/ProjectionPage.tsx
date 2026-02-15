import WealthProjectionChart from "../components/charts/WealthProjectionChart";

export default function ProjectionPage() {
  return (
    <div style={{ padding: 32 }}>
      <h2>Wealth Projection</h2>
      <WealthProjectionChart data={[]} />
    </div>
  );
}
