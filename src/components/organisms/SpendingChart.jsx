import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { formatCurrency } from '@/utils/formatters';

const SpendingChart = ({ transactions = [] }) => {
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState({ categories: [], series: [] });

  useEffect(() => {
    processChartData();
  }, [transactions]);

  const processChartData = () => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryTotals = {};

    expenseTransactions.forEach(transaction => {
      const category = transaction.category;
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += transaction.amount;
    });

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    setChartData({
      categories,
      series: chartType === 'bar' ? [{ name: 'Spending', data: amounts }] : amounts
    });
  };

  const chartOptions = {
    chart: {
      type: chartType,
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    colors: ['#2563eb', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316'],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        columnWidth: '60%',
        borderRadius: 8,
      },
      pie: {
        donut: {
          size: '70%',
        },
      },
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => formatCurrency(value),
        style: {
          colors: '#64748b',
          fontSize: '12px',
        },
      },
    },
    legend: {
      position: 'bottom',
      fontSize: '12px',
      markers: {
        radius: 6,
      },
    },
    tooltip: {
      y: {
        formatter: (value) => formatCurrency(value),
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="premium-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-secondary to-primary bg-opacity-10">
                <ApperIcon name="BarChart3" size={20} className="text-secondary" />
              </div>
              <span>Monthly Spending</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={chartType === 'bar' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setChartType('bar')}
              >
                <ApperIcon name="BarChart3" size={16} />
              </Button>
              <Button
                variant={chartType === 'pie' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setChartType('pie')}
              >
                <ApperIcon name="PieChart" size={16} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="h-80">
            {chartData.categories.length > 0 ? (
              <Chart
                options={chartOptions}
                series={chartData.series}
                type={chartType}
                height="100%"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <ApperIcon name="BarChart3" size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No spending data available</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SpendingChart;