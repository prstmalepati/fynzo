import { useState, useEffect } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler
} from 'chart.js';
import SidebarLayout from '../components/SidebarLayout';
import { useAuth } from '../context/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' });

  // Mock data - replace with actual data from Firestore
  const stats = {
    totalNetWorth: 1245000,
    monthlyChange: 12500,
    monthlyChangePercent: 1.02,
    fireNumber: 2500000,
    fireProgress: 49.8,
    yearsToFire: 8,
    savingsRate: 42,
    totalInvestments: 985000,
    totalDebt: 0,
    monthlyIncome: 8500,
    monthlyExpenses: 4950,
  };

  const assetAllocation = {
    labels: ['Stocks', 'ETFs', 'Crypto', 'Real Estate', 'Gold', 'Cash'],
    datasets: [{
      data: [350000, 420000, 85000, 180000, 50000, 160000],
      backgroundColor: [
        '#0f766e', // Primary teal
        '#14b8a6', // Light teal
        '#f59e0b', // Amber
        '#8b5cf6', // Purple
        '#eab308', // Yellow
        '#64748b'  // Slate
      ],
      borderWidth: 0
    }]
  };

  const netWorthHistory = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Net Worth',
      data: [1100000, 1120000, 1145000, 1165000, 1185000, 1195000, 1205000, 1215000, 1225000, 1235000, 1240000, 1245000],
      borderColor: '#0f766e',
      backgroundColor: 'rgba(15, 118, 110, 0.1)',
      tension: 0.4,
      fill: true,
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 6
    }]
  };

  const monthlyCashFlow = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Income',
        data: [8200, 8500, 8300, 8600, 8500, 8700, 8500, 8400, 8500, 8600, 8500, 8500],
        backgroundColor: '#10b981',
      },
      {
        label: 'Expenses',
        data: [4800, 4900, 5100, 4950, 4850, 4900, 5000, 4950, 4900, 4950, 5000, 4950],
        backgroundColor: '#ef4444',
      }
    ]
  };

  return (
    <SidebarLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Dashboard
          </h1>
          <p className="text-slate-600">
            Welcome back, {user?.displayName || user?.email || 'there'}! Here's your financial overview for {currentMonth} {currentYear}.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Net Worth */}
          <div className="bg-gradient-to-br from-primary to-teal-700 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm opacity-90 font-semibold">Total Net Worth</div>
              <svg className="w-5 h-5 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
              €{(stats.totalNetWorth / 1000).toFixed(0)}K
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className={`flex items-center gap-1 ${stats.monthlyChangePercent >= 0 ? 'text-emerald-200' : 'text-red-200'}`}>
                {stats.monthlyChangePercent >= 0 ? '↗' : '↘'} {Math.abs(stats.monthlyChangePercent)}%
              </span>
              <span className="opacity-75">this month</span>
            </div>
          </div>

          {/* FIRE Progress */}
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600 font-semibold">FIRE Progress</div>
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-secondary mb-3" style={{ fontFamily: "'Crimson Pro', serif" }}>
              {stats.fireProgress}%
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-primary to-teal-500 h-2 rounded-full transition-all"
                style={{ width: `${stats.fireProgress}%` }}
              />
            </div>
            <div className="text-xs text-slate-600">
              {stats.yearsToFire} years to financial independence
            </div>
          </div>

          {/* Savings Rate */}
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600 font-semibold">Savings Rate</div>
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-secondary mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
              {stats.savingsRate}%
            </div>
            <div className="text-xs text-slate-600">
              Saving €{((stats.monthlyIncome - stats.monthlyExpenses) / 1000).toFixed(1)}K/month
            </div>
          </div>

          {/* Monthly Cash Flow */}
          <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600 font-semibold">Cash Flow</div>
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-emerald-600 mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
              +€{((stats.monthlyIncome - stats.monthlyExpenses) / 1000).toFixed(1)}K
            </div>
            <div className="text-xs text-slate-600">
              €{(stats.monthlyIncome / 1000).toFixed(1)}K in - €{(stats.monthlyExpenses / 1000).toFixed(1)}K out
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Net Worth History */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
            <h3 className="text-xl font-bold text-secondary mb-4" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Net Worth Growth ({currentYear})
            </h3>
            <div className="h-80">
              <Line
                data={netWorthHistory}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      padding: 12,
                      callbacks: {
                        label: (context) => '€' + context.parsed.y.toLocaleString()
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      ticks: {
                        callback: (value) => '€' + (Number(value) / 1000).toFixed(0) + 'K'
                      },
                      grid: { color: 'rgba(226, 232, 240, 0.5)' }
                    },
                    x: { grid: { display: false } }
                  }
                }}
              />
            </div>
          </div>

          {/* Asset Allocation */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
            <h3 className="text-xl font-bold text-secondary mb-4" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Asset Allocation
            </h3>
            <div className="h-64 flex items-center justify-center">
              <Doughnut
                data={assetAllocation}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 11 }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = '€' + (Number(context.parsed) / 1000).toFixed(0) + 'K';
                          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                          const percentage = ((Number(context.parsed) / total) * 100).toFixed(1) + '%';
                          return `${label}: ${value} (${percentage})`;
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Cash Flow */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
            <h3 className="text-xl font-bold text-secondary mb-4" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Monthly Income vs Expenses
            </h3>
            <div className="h-72">
              <Bar
                data={monthlyCashFlow}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                      callbacks: {
                        label: (context) => context.dataset.label + ': €' + context.parsed.y.toLocaleString()
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => '€' + (Number(value) / 1000).toFixed(0) + 'K'
                      },
                      grid: { color: 'rgba(226, 232, 240, 0.5)' }
                    },
                    x: { grid: { display: false } }
                  }
                }}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
            <h3 className="text-xl font-bold text-secondary mb-4" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                <span className="text-slate-700 font-semibold">Total Investments</span>
                <span className="text-xl font-bold text-primary">€{(stats.totalInvestments / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                <span className="text-slate-700 font-semibold">Total Debt</span>
                <span className="text-xl font-bold text-secondary">€{stats.totalDebt.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl">
                <span className="text-emerald-800 font-semibold">FIRE Number</span>
                <span className="text-xl font-bold text-emerald-700">€{(stats.fireNumber / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                <span className="text-purple-800 font-semibold">Monthly Savings</span>
                <span className="text-xl font-bold text-purple-700">€{((stats.monthlyIncome - stats.monthlyExpenses) / 1000).toFixed(1)}K</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
