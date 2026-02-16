const tabs = [
  { id: "inputs", label: "Inputs" },
  { id: "projection", label: "Projection" },
  { id: "breakdown", label: "Breakdown" },
  { id: "fire", label: "FIRE" }
]

export default function ProjectionTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 mb-6 border-b">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 font-medium ${
            active === tab.id
              ? "border-b-2 border-black"
              : "text-gray-400"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
