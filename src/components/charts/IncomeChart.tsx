import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
)

export function IncomeChart({ projections }: any) {
  const data = {
    labels: projections.map((p: any) => `Year ${p.year}`),
    datasets: [
      {
        label: "Annual Income (€)",
        data: projections.map((p: any) => Math.round(p.totalIncome)),
        backgroundColor: "#38bdf8"
      }
    ]
  }

  return <Bar data={data} />
}
