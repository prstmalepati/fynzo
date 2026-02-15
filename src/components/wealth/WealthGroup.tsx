import { useNavigate } from "react-router-dom"

export function WealthGroup({ title, value, route }: any) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => route && navigate(route)}
      className="cursor-pointer flex justify-between rounded-lg bg-gray-50 p-4 hover:bg-gray-100"
    >
      <span>{title}</span>
      <span>€{value.toLocaleString()}</span>
    </div>
  )
}

