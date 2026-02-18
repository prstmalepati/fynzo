import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

type Props = {
  data: {
    year: number;
    netWorth: number;
    fireReached?: boolean;
  }[];
};

export default function WealthProjectionChart({ data }: Props) {
  const chartData = {
    labels: data.map(d => `Year ${d.year}`),
    datasets: [
      {
        label: "Net Worth",
        data: data.map(d => d.netWorth),
        borderColor: "#0f766e",
        backgroundColor: "rgba(15, 118, 110, 0.1)",
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointRadius: data.map(d => d.fireReached ? 8 : 0),
        pointBackgroundColor: data.map(d => d.fireReached ? "#10b981" : "#0f766e"),
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: false 
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            padding: 12,
            titleColor: '#fff',
            bodyColor: '#fff',
            displayColors: false,
            callbacks: {
              label: function(context) {
                return '€' + context.parsed.y.toLocaleString(undefined, { maximumFractionDigits: 0 });
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '€' + (Number(value) / 1000).toFixed(0) + 'K';
              }
            },
            grid: {
              color: 'rgba(226, 232, 240, 0.5)',
            }
          },
          x: {
            grid: {
              display: false,
            }
          }
        }
      }}
    />
  );
}
