import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
)

export function NetWorthChart({ projections }: any) {
  const data = {
    labels: projections.map((p: any) => `Year ${p.year}`),
    datasets: [
      {
        label: "Net Worth (€)",
        data: projections.map((p: any) => Math.round(p.netWorth)),
        borderColor: "#0f766e",
        backgroundColor: "rgba(15,118,110,0.15)",
        tension: 0.3,
        fill: true
      }
    ]
  }

  return <Line data={data} />
}
