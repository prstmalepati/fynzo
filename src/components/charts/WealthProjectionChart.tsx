import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

type Props = {
  data: {
    year: number;
    netWorth: number;
  }[];
};

export default function WealthProjectionChart({ data }: Props) {
  const chartData = {
    labels: data.map(d => `Year ${d.year}`),
    datasets: [
      {
        label: "Net Worth",
        data: data.map(d => d.netWorth),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.15)",
        tension: 0.4,
      },
    ],
  };

  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      }}
    />
  );
}
