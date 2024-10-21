import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 定义月份类型
type Month = 'January' | 'February' | 'March' | 'April' | 'May' | 'June' | 'July' | 'August' | 'September' | 'October' | 'November' | 'December';

// 假设这些是我们的销售数据
const salesData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      label: 'Monthly Sales',
      data: [12000, 19000, 3000, 5000, 2000, 3000],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Monthly Sales Chart',
    },
  },
};

const MonthlySales: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Month>('June');
  const [monthlySales, setMonthlySales] = useState<number>(3000);

  const generateReport = () => {
    // 这里应该是生成报告的逻辑
    alert('Report generated and downloaded!');
  };



  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Monthly Sales</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Sales Overview</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Current Month: {currentMonth}
          </p>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Total Sales: ${monthlySales}
          </p>
          <div className="mt-5">
            <button
              onClick={generateReport}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Sales Chart</h3>
          <Bar options={options} data={salesData} />
        </div>
      </div>
    </div>
  );
};

export default MonthlySales;
