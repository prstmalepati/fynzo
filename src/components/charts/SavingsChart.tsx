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

export function SavingsChart({ projections }: any) {
  const data = {
    labels: projections.map((p: any) => `Year ${p.year}`),
    datasets: [
      {
        label: "Annual Savings (€)",
        data: projections.map((p: any) => Math.round(p.annualSavings)),
        backgroundColor: projections.map((p: any) =>
          p.annualSavings >= 0 ? "#22c55e" : "#ef4444"
        )
      }
    ]
  }

  return <Bar data={data} />
}
