import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axiosInstance from '../../Axios/axios';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function DashBoard() {
  const [data, setData] = useState(null);
  const [view, setView] = useState('daily');

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/admin/dashboard?view=${view}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [view]);

  if (!data) {
    return <div>Loading...</div>;
  }

  const { labels, salesData, totalProduct, totalSales, totalRevenue } = data;

  // Calculate dynamic Y-axis range
  const minY = Math.min(...salesData) - 5000;
  const maxY = Math.max(...salesData) + 5000;

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Revenue Over Time',
        data: salesData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Revenue Overview',
      },
    },
    scales: {
      y: {
        min: minY < 0 ? 0 : minY,
        max: maxY,
        ticks: {
          callback: function (value) {
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  const handleViewChange = (e) => {
    setView(e.target.value);
  };

  return (
    <div className="p-6 ml-64">
      <div className="mb-6">
        <label htmlFor="view" className="mr-2">Select View:</label>
        <select id="view" value={view} onChange={handleViewChange}>
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
  <div className="bg-blue-100 text-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
    <h3 className="text-xl font-semibold">Total Products</h3>
    <p className="text-3xl font-bold">{totalProduct}</p>
  </div>
  <div className="bg-orange-100 text-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
    <h3 className="text-xl font-semibold">Total Sales</h3>
    <p className="text-3xl font-bold">{totalSales}</p>
  </div>
  <div className="bg-green-100 text-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
    <h3 className="text-xl font-semibold">Total Revenue</h3>
    <p className="text-3xl font-bold">${totalRevenue}</p>
  </div>
</div>



      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4">Revenue Over Time</h3>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default DashBoard;
