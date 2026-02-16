import { useState } from "react"
import ProjectionTabs from "../components/projection/ProjectionTabs"
import ProjectionInputs from "../components/projection/ProjectionInputs"
import ProjectionKPIs from "../components/projection/ProjectionKPIs"
import WealthProjectionChart from "../components/charts/WealthProjectionChart"
import ProjectionTable from "../components/projection/ProjectionTable"
import { calculateProjection } from "../calculations/projection"

export default function ProjectionPage() {
  const [activeTab, setActiveTab] = useState("inputs")
  const [result, setResult] = useState(null)

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Projection</h1>
      <p className="text-gray-500 mb-6">
        Simulate your net worth, savings, and FIRE path.
      </p>

      <ProjectionTabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "inputs" && (
        <ProjectionInputs onCalculate={setResult} />
      )}

      {result && activeTab === "projection" && (
        <>
          <ProjectionKPIs data={result} />
          <WealthProjectionChart data={result.timeline} />
        </>
      )}

      {result && activeTab === "breakdown" && (
        <ProjectionTable rows={result.timeline} />
      )}

      {result && activeTab === "fire" && (
        <ProjectionKPIs data={result.fire} fireOnly />
      )}
    </div>
  )
}
