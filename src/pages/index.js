import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { fetchForexData } from '../services/forexService';
import { ChevronDownIcon } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ForexChart = () => {
  const [chartData, setChartData] = useState(null);
  const [period, setPeriod] = useState('1M');
  const [currencies, setCurrencies] = useState({
    from: 'GBP',
    to: 'INR'
  });
  const [isDarkMode, setIsDarkMode] = useState(true);

  const periods = ['1W', '1M', '3M', '6M', '1Y'];
  const currencyPairs = [
    { from: 'GBP', to: 'INR' },
    { from: 'AED', to: 'INR' },
    { from: 'USD', to: 'EUR' },
    { from: 'JPY', to: 'USD' }
  ];

  useEffect(() => {
    const loadForexData = async () => {
      try {
        const data = await fetchForexData(currencies.from, currencies.to, period);
        
        setChartData({
          labels: data.map(item => new Date(item.date).toLocaleDateString()),
          datasets: [{
            label: `${currencies.from}/${currencies.to} Exchange Rate`,
            data: data.map(item => item.rate),
            borderColor: isDarkMode ? 'rgb(96, 165, 250)' : 'rgb(37, 99, 235)',
            backgroundColor: isDarkMode 
              ? 'rgba(96, 165, 250, 0.2)' 
              : 'rgba(37, 99, 235, 0.2)',
            tension: 0.1,
            fill: true
          }]
        });
      } catch (error) {
        console.error('Error loading forex data:', error);
      }
    };

    loadForexData();
  }, [currencies, period, isDarkMode]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
        },
        grid: {
          color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        }
      },
      y: {
        ticks: {
          color: isDarkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'
        },
        grid: {
          color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        }
      }
    },
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          color: isDarkMode ? 'white' : 'black'
        }
      },
      title: {
        display: true,
        text: `${currencies.from}/${currencies.to} Exchange Rate - ${period}`,
        color: isDarkMode ? 'white' : 'black'
      }
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen p-6`}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Forex Exchange Rates</h1>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <label className="block text-sm font-medium mb-2">Currency Pair</label>
            <div className="relative">
              <select 
                value={`${currencies.from}-${currencies.to}`}
                onChange={(e) => {
                  const [from, to] = e.target.value.split('-');
                  setCurrencies({ from, to });
                }}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencyPairs.map(pair => (
                  <option 
                    key={`${pair.from}-${pair.to}`} 
                    value={`${pair.from}-${pair.to}`}
                  >
                    {pair.from}/{pair.to}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <label className="block text-sm font-medium mb-2">Time Period</label>
            <div className="relative">
              <select 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {periods.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden" style={{ height: '500px' }}>
          {chartData && <Line data={chartData} options={chartOptions} />}
        </div>
      </div>
    </div>
  );
};

export default ForexChart;