import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SidebarLayout from "../components/SidebarLayout";
import ProjectionInputs from "../components/projection/ProjectionInputs";
import WealthProjectionChart from "../components/charts/WealthProjectionChart";

export default function ProjectionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = (calculationResult: any) => {
    setResult(calculationResult);
    setShowResults(true);
  };

  const content = (
    <div className="p-8">
      {/* Header */}
      {!user && (
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
      )}

      {user && (
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-2" style={{ fontFamily: "'Crimson Pro', serif" }}>
            Wealth Projection Calculator
          </h1>
          <p className="text-slate-600" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Model your path to financial independence with precision
          </p>
        </div>
      )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 sticky top-8">
              <h2 className="text-2xl font-bold text-secondary mb-6" style={{ fontFamily: "'Crimson Pro', serif" }}>
                Your Details
              </h2>
              <ProjectionInputs onCalculate={handleCalculate} />
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-2 space-y-6">
            {!showResults && (
              <div className="bg-white rounded-2xl shadow-lg p-12 border border-slate-200 text-center">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-3" style={{ fontFamily: "'Crimson Pro', serif" }}>
                  Ready to Project Your Future?
                </h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  Fill in your financial details on the left and click "Calculate Projection" to see your personalized wealth trajectory.
                </p>
              </div>
            )}

            {showResults && result && (
              <>
                {/* KPI Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* FIRE Number */}
                  <div className="bg-gradient-to-br from-primary to-teal-700 rounded-2xl shadow-xl p-8 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm opacity-90">Your FIRE Number</div>
                        <div className="text-4xl font-bold" style={{ fontFamily: "'Crimson Pro', serif" }}>
                          €{(result.fire.fireNumber / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-teal-100 mt-2">
                      Portfolio value needed for financial independence (4% rule)
                    </p>
                  </div>

                  {/* Years to FIRE */}
                  <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Years to FIRE</div>
                        <div className="text-4xl font-bold text-secondary" style={{ fontFamily: "'Crimson Pro', serif" }}>
                          {result.fire.yearsToFire || 'TBD'}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">
                      {result.fire.fireAge ? `You'll reach FIRE at age ${result.fire.fireAge}` : 'Keep investing to reach FIRE'}
                    </p>
                  </div>

                  {/* Net Worth Growth */}
                  <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Projected Net Worth</div>
                        <div className="text-4xl font-bold text-secondary" style={{ fontFamily: "'Crimson Pro', serif" }}>
                          €{(result.netWorthEnd / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">
                      Total value after {result.timeline.length} years
                    </p>
                  </div>

                  {/* Total Savings */}
                  <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Total Contributions</div>
                        <div className="text-4xl font-bold text-secondary" style={{ fontFamily: "'Crimson Pro', serif" }}>
                          €{(result.totalSavings / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">
                      Your total savings over the projection period
                    </p>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-secondary" style={{ fontFamily: "'Crimson Pro', serif" }}>
                      Wealth Trajectory
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span>Net Worth</span>
                      {result.fire.yearsToFire && (
                        <>
                          <div className="w-3 h-3 bg-emerald-500 rounded-full ml-4"></div>
                          <span>FIRE Milestone</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="h-96">
                    <WealthProjectionChart data={result.timeline} />
                  </div>
                </div>

                {/* Timeline Table */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                  <h3 className="text-2xl font-bold text-secondary mb-6" style={{ fontFamily: "'Crimson Pro', serif" }}>
                    Year-by-Year Breakdown
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-left">
                          <th className="pb-3 font-semibold text-slate-700">Year</th>
                          <th className="pb-3 font-semibold text-slate-700">Age</th>
                          <th className="pb-3 font-semibold text-slate-700">Income</th>
                          <th className="pb-3 font-semibold text-slate-700">Expenses</th>
                          <th className="pb-3 font-semibold text-slate-700">Savings</th>
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
                            <td className="py-3 text-slate-600">€{(row.expenses / 1000).toFixed(1)}K</td>
                            <td className="py-3 text-emerald-600 font-medium">€{(row.annualSavings / 1000).toFixed(1)}K</td>
                            <td className="py-3 font-semibold text-secondary">€{(row.netWorth / 1000).toFixed(0)}K</td>
                            <td className="py-3">
                              {row.fireReached && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                  🔥 FIRE
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
      </div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Manrope:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );

  // Wrap with sidebar if user is logged in, otherwise show standalone
  return user ? <SidebarLayout>{content}</SidebarLayout> : (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {content}
    </div>
  );
}
