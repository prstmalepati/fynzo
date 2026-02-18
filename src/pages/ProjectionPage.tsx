import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SidebarLayout from "../components/SidebarLayout";
import ProjectionInputs from "../components/projection/ProjectionInputs";
import WealthProjectionChart from "../components/charts/WealthProjectionChart";
import { useEffect } from 'react';

const [savedFireTarget, setSavedFireTarget] = useState<any>(null);

useEffect(() => {
  const fireData = localStorage.getItem('myfynzo_fire_target');
  if (fireData) {
    try {
      setSavedFireTarget(JSON.parse(fireData));
    } catch (e) {
      console.error('Failed to load FIRE target', e);
    }
  }
}, []);

export default function ProjectionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = (calculationResult: any) => {
    setResult(calculationResult);
    setShowResults(true);
  };

  // If user is logged in, use sidebar layout
  if (user) {
    return (
      <SidebarLayout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-secondary mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Wealth Projection Calculator
            </h1>
            <p className="text-slate-600" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Model your path to financial independence with precision
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Column */}
            <div className="lg:col-span-1">
              <ProjectionInputs onCalculate={handleCalculate} />
            </div>

            {/* Results Column */}
            <div className="lg:col-span-2 space-y-8">
              {!showResults ? (
                <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-2xl font-bold text-secondary mb-2">Ready to project your wealth?</h3>
                  <p className="text-slate-600">Fill in your details and click Calculate to see your path to FIRE</p>
                </div>
              ) : (
                <>
                  
		{/* FIRE Target Card - ADD THIS ENTIRE BLOCK */}
    		{savedFireTarget && (
      			<div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-6 text-white shadow-xl mb-4">
        		<div className="flex items-center justify-between mb-2">
          		<div className="text-sm opacity-90 font-semibold">Your FIRE Target</div>
          		<span className="text-3xl">
            			{savedFireTarget.type === 'lean' ? '🌱' :
             			savedFireTarget.type === 'fat' ? '💎' :
             			savedFireTarget.type === 'barista' ? '☕' : '🏖️'}
          		</span>
        		</div>
        			<div className="text-5xl font-bold mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
          			€{(savedFireTarget.number / 1000).toFixed(0)}K
        			</div>
        			<div className="text-sm opacity-90">
          			{savedFireTarget.type.charAt(0).toUpperCase() + savedFireTarget.type.slice(1)} FIRE
        			</div>
        			<div className="text-xs opacity-75 mt-2">
          			Set in FIRE Calculator
        			</div>
      			</div>
    		)}
    
    		{/* Summary Cards */}
    		<div className="grid md:grid-cols-3 gap-4">
      			<div className="bg-gradient-to-br from-primary to-teal-700 rounded-xl p-6 text-white">
        		<div className="text-sm opacity-90 mb-1">Final Net Worth</div>
        		<div className="text-3xl font-bold">€{(result.finalNetWorth / 1000).toFixed(0)}K</div>
      		</div>
		{/* Summary Cards */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-primary to-teal-700 rounded-xl p-6 text-white">
                      <div className="text-sm opacity-90 mb-1">Final Net Worth</div>
                      <div className="text-3xl font-bold">€{(result.finalNetWorth / 1000).toFixed(0)}K</div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl p-6 text-white">
                      <div className="text-sm opacity-90 mb-1">FIRE Year</div>
                      <div className="text-3xl font-bold">{result.fireYear || 'N/A'}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white">
                      <div className="text-sm opacity-90 mb-1">Years to FIRE</div>
                      <div className="text-3xl font-bold">{result.yearsToFire || 'N/A'}</div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <WealthProjectionChart data={result.timeline} />
                  </div>

                  {/* Timeline Table */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200">
                    <h3 className="text-xl font-bold text-secondary mb-4">Year-by-Year Breakdown</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="border-b-2 border-slate-200">
                          <tr>
                            <th className="pb-3 font-semibold text-slate-700">Year</th>
                            <th className="pb-3 font-semibold text-slate-700">Age</th>
                            <th className="pb-3 font-semibold text-slate-700">Income</th>
                            <th className="pb-3 font-semibold text-slate-700">Expenses</th>
                            <th className="pb-3 font-semibold text-slate-700">Savings</th>
                            <th className="pb-3 font-semibold text-slate-700">Investments</th>
                            <th className="pb-3 font-semibold text-slate-700">Net Worth</th>
                            <th className="pb-3 font-semibold text-slate-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.timeline.map((row: any, i: number) => (
                            <tr 
                              key={i} 
                              className={`border-b border-slate-100 ${row.fireReached ? 'bg-emerald-50' : ''}`}
                            >
                              <td className="py-3 font-medium">{row.year}</td>
                              <td className="py-3 text-slate-600">{row.ages}</td>
                              <td className="py-3 text-slate-600">€{(row.totalIncome / 1000).toFixed(1)}K</td>
                              <td className="py-3 text-slate-600">€{(row.totalExpenses / 1000).toFixed(1)}K</td>
                              <td className="py-3 text-emerald-600 font-medium">€{(row.annualSavings / 1000).toFixed(1)}K</td>
                              <td className="py-3 font-medium">€{(row.investmentValue / 1000).toFixed(0)}K</td>
                              <td className="py-3 font-bold text-primary">€{(row.netWorth / 1000).toFixed(0)}K</td>
                              <td className="py-3">
                                {row.fireReached && (
                                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-semibold">
                                    FIRE 🔥
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Google Fonts */}
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Manrope:wght@400;500;600;700&display=swap');
          `}</style>
        </div>
      </SidebarLayout>
    );
  }

  // If NOT logged in, show standalone page
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      <div className="p-8">
        {/* Header with login prompt */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 mb-4 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-xl">f</span>
              </div>
              <h1 className="text-4xl font-bold text-secondary group-hover:text-primary transition-colors" style={{ fontFamily: "'Crimson Pro', serif" }}>
                Wealth Projection Calculator
              </h1>
            </button>
            <p className="text-slate-600" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Model your path to financial independence with precision
            </p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-teal-700 transition-all font-semibold shadow-lg"
          >
            Save Results (Login)
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Column */}
          <div className="lg:col-span-1">
            <ProjectionInputs onCalculate={handleCalculate} />
          </div>

          {/* Results Column */}
          <div className="lg:col-span-2 space-y-8">
            {!showResults ? (
              <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-2xl font-bold text-secondary mb-2">Ready to project your wealth?</h3>
                <p className="text-slate-600">Fill in your details and click Calculate to see your path to FIRE</p>
              </div>
            ) : (
              <>
                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-primary to-teal-700 rounded-xl p-6 text-white">
                    <div className="text-sm opacity-90 mb-1">Final Net Worth</div>
                    <div className="text-3xl font-bold">€{(result.finalNetWorth / 1000).toFixed(0)}K</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl p-6 text-white">
                    <div className="text-sm opacity-90 mb-1">FIRE Year</div>
                    <div className="text-3xl font-bold">{result.fireYear || 'N/A'}</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white">
                    <div className="text-sm opacity-90 mb-1">Years to FIRE</div>
                    <div className="text-3xl font-bold">{result.yearsToFire || 'N/A'}</div>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                  <WealthProjectionChart data={result.timeline} />
                </div>

                {/* Timeline Table */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-xl font-bold text-secondary mb-4">Year-by-Year Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b-2 border-slate-200">
                        <tr>
                          <th className="pb-3 font-semibold text-slate-700">Year</th>
                          <th className="pb-3 font-semibold text-slate-700">Age</th>
                          <th className="pb-3 font-semibold text-slate-700">Income</th>
                          <th className="pb-3 font-semibold text-slate-700">Expenses</th>
                          <th className="pb-3 font-semibold text-slate-700">Savings</th>
                          <th className="pb-3 font-semibold text-slate-700">Investments</th>
                          <th className="pb-3 font-semibold text-slate-700">Net Worth</th>
                          <th className="pb-3 font-semibold text-slate-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.timeline.map((row: any, i: number) => (
                          <tr 
                            key={i} 
                            className={`border-b border-slate-100 ${row.fireReached ? 'bg-emerald-50' : ''}`}
                          >
                            <td className="py-3 font-medium">{row.year}</td>
                            <td className="py-3 text-slate-600">{row.ages}</td>
                            <td className="py-3 text-slate-600">€{(row.totalIncome / 1000).toFixed(1)}K</td>
                            <td className="py-3 text-slate-600">€{(row.totalExpenses / 1000).toFixed(1)}K</td>
                            <td className="py-3 text-emerald-600 font-medium">€{(row.annualSavings / 1000).toFixed(1)}K</td>
                            <td className="py-3 font-medium">€{(row.investmentValue / 1000).toFixed(0)}K</td>
                            <td className="py-3 font-bold text-primary">€{(row.netWorth / 1000).toFixed(0)}K</td>
                            <td className="py-3">
                              {row.fireReached && (
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-semibold">
                                  FIRE 🔥
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Google Fonts */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Manrope:wght@400;500;600;700&display=swap');
        `}</style>
      </div>
    </div>
  );
}
