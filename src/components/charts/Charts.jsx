import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { getLast7Days } from "../../utils/features";

ChartJS.register(
  Tooltip,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  ArcElement,
  Legend,
);

const labels = getLast7Days();
const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "black", // Adjust color as needed
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
      ticks: {
        color: "black", // Adjust color as needed
      },
    },
  },
};

export const LineChart = ({ value = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Messages",
        fill: false,
        backgroundColor: "rgba(0, 123, 255, 0.2)", // Adjust the background color
        borderColor: "rgba(0, 123, 255, 1)", // Adjust the border color
        borderWidth: 2,
      },
    ],
  };
  return <Line data={data} options={lineChartOptions} />;
};

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 140,
};

export const DoughnutChart = ({ value = [], labels = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        backgroundColor: [
          "#36A2EB",
          "#FFCE56",
          "#FF6384",
          "#4BC0C0",
          "#9966FF",
        ], // Adjust the background color
        borderColor: ["#36A2EB", "#FFCE56", "#FF6384", "#4BC0C0", "#9966FF"], // Adjust the border color
      },
    ],
  };
  return (
    <Doughnut
      style={{
        zIndex: 10,
      }}
      data={data}
      options={doughnutChartOptions}
    />
  );
};
