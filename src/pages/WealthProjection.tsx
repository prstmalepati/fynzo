import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLocale } from '../context/LocaleContext';
import { db } from '../firebase/config';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import SidebarLayout from '../components/SidebarLayout';

interface ProjectionInputs {
  currentNetWorth: number;
  totalInvestments: number;
  totalDebt: number;
  monthlyExpenses: number;
  monthlyInvestment: number;
  monthlyDebtPayment: number;
  expectedReturn: number;
  inflationRate: number;
  projectionYears: number;
}

interface YearData {
  year: number;
  age: number;
  netWorth: number;
  netWorthReal: number;
  investments: number;
  debt: number;
  totalContributed: number;
  totalGrowth: number;
}

export default function WealthProjection() {
  const { user } = useAuth();
  const { formatAmount, currency } = useCurrency();
  const { t } = useLocale();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchedInvestments, setFetchedInvestments] = useState<number | null>(null);
  const [currentAge, setCurrentAge] = useState(30);

  const [inputs, setInputs] = useState<ProjectionInputs>({
    currentNetWorth: 0,
    totalInvestments: 0,
    totalDebt: 0,
    monthlyExpenses: 2500,
    monthlyInvestment: 500,
    monthlyDebtPayment: 0,
    expectedReturn: 7,
    inflationRate: 2.5,
    projectionYears: 30,
  });

  // Load saved projection + fetch investments total
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        // Fetch saved projection inputs
        const snap = await getDoc(doc(db, 'users', user.uid, 'projections', 'wealth'));
        if (snap.exists()) {
          const d = snap.data();
          setInputs(prev => ({ ...prev, ...d }));
          if (d.currentAge) setCurrentAge(d.currentAge);
        }

        // Auto-fetch total investment value
        const invSnap = await getDocs(collection(db, 'users', user.uid, 'investments'));
        let total = 0;
        invSnap.docs.forEach(d => {
          const inv = d.data();
          total += (inv.quantity || 0) * (inv.currentPrice || inv.purchasePrice || 0);
        });
        setFetchedInvestments(total);
        if (total > 0) {
          setInputs(prev => ({ ...prev, totalInvestments: total }));
        }
      } catch (err) {
        console.error('Error loading:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const update = (field: keyof ProjectionInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid, 'projections', 'wealth'), {
        ...inputs, currentAge, updatedAt: new Date(),
      });
    } catch (err) { console.error('Save error:', err); }
    finally { setSaving(false); }
  };

  // Calculate projection data
  const projectionData = useMemo<YearData[]>(() => {
    const data: YearData[] = [];
    const r = inputs.expectedReturn / 100;
    const inf = inputs.inflationRate / 100;
    const annualInvestment = inputs.monthlyInvestment * 12;
    const annualDebtPayment = inputs.monthlyDebtPayment * 12;

    let netWorth = inputs.currentNetWorth + inputs.totalInvestments - inputs.totalDebt;
    let investments = inputs.totalInvestments;
    let debt = inputs.totalDebt;
    let totalContributed = 0;
    let totalGrowth = 0;

    // Year 0 = now
    data.push({
      year: 0, age: currentAge, netWorth, netWorthReal: netWorth,
      investments, debt, totalContributed: 0, totalGrowth: 0,
    });

    for (let y = 1; y <= inputs.projectionYears; y++) {
      // Investments grow + new monthly contributions
      const growth = investments * r;
      investments = investments + growth + annualInvestment;
      totalGrowth += growth;
      totalContributed += annualInvestment;

      // Debt decreases via monthly debt payments
      if (debt > 0 && annualDebtPayment > 0) {
        const payment = Math.min(debt, annualDebtPayment);
        debt = Math.max(0, debt - payment);
      }

      netWorth = inputs.currentNetWorth + investments - debt;
      const netWorthReal = netWorth / Math.pow(1 + inf, y);

      data.push({
        year: y, age: currentAge + y, netWorth, netWorthReal,
        investments, debt, totalContributed, totalGrowth,
      });
    }
    return data;
  }, [inputs, currentAge]);

  // Milestones
  const milestones = useMemo(() => {
    const targets = [100000, 250000, 500000, 1000000, 2000000, 5000000];
    const currSymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency === 'INR' ? '₹' : currency === 'CAD' ? 'C$' : '€';
    return targets.map(target => {
      const yearData = projectionData.find(d => d.netWorth >= target);
      const label = target >= 1000000
        ? `${currSymbol}${(target / 1000000).toFixed(0)}M`
        : `${currSymbol}${(target / 1000).toFixed(0)}K`;
      return { target, label, year: yearData?.year ?? null, age: yearData?.age ?? null };
    }).filter(m => m.year !== null && m.year! <= inputs.projectionYears);
  }, [projectionData, currency, inputs.projectionYears]);

  const finalData = projectionData[projectionData.length - 1];

  // Chart dimensions
  const chartW = 700, chartH = 280, padL = 60, padR = 20, padT = 20, padB = 40;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const maxVal = Math.max(...projectionData.map(d => d.netWorth), 1);
  const maxYears = inputs.projectionYears;

  const toX = (y: number) => padL + (y / maxYears) * plotW;
  const toY = (v: number) => padT + plotH - (v / maxVal) * plotH;

  const nominalPath = projectionData.map((d, i) =>
    `${i === 0 ? 'M' : 'L'}${toX(d.year).toFixed(1)},${toY(d.netWorth).toFixed(1)}`
  ).join(' ');

  const realPath = projectionData.map((d, i) =>
    `${i === 0 ? 'M' : 'L'}${toX(d.year).toFixed(1)},${toY(d.netWorthReal).toFixed(1)}`
  ).join(' ');

  const areaPath = nominalPath + ` L${toX(maxYears).toFixed(1)},${toY(0).toFixed(1)} L${toX(0).toFixed(1)},${toY(0).toFixed(1)} Z`;

  // Y-axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(pct => {
    const val = maxVal * pct;
    return { val, y: toY(val), label: formatAmount(val) };
  });

  // X-axis ticks
  const xStep = maxYears <= 10 ? 1 : maxYears <= 20 ? 5 : 10;
  const xTicks: number[] = [];
  for (let i = 0; i <= maxYears; i += xStep) xTicks.push(i);
  if (xTicks[xTicks.length - 1] !== maxYears) xTicks.push(maxYears);

  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse mb-6" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 h-96 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="lg:col-span-2 h-96 bg-slate-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-secondary font-display">Wealth Projection</h1>
            <p className="text-sm text-slate-500 mt-1">Project your net worth up to 50 years into the future</p>
          </div>
          <button onClick={handleSave} disabled={saving}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              saving ? 'bg-slate-200 text-slate-400' : 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90'
            }`}>
            {saving ? 'Saving...' : '💾 Save Projection'}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ─── Left: Inputs ───────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">
            {/* Current Position */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
              <h3 className="text-sm font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px]">💰</span>
                Current Position
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Current Age</label>
                  <input type="number" value={currentAge} onChange={e => setCurrentAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Cash & Savings ({currency})</label>
                  <input type="number" value={inputs.currentNetWorth || ''} onChange={e => update('currentNetWorth', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    placeholder="0" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-500">Total Investments ({currency})</label>
                    {fetchedInvestments !== null && fetchedInvestments > 0 && (
                      <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Auto-fetched</span>
                    )}
                  </div>
                  <input type="number" value={inputs.totalInvestments || ''} onChange={e => update('totalInvestments', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Total Debt ({currency})</label>
                  <input type="number" value={inputs.totalDebt || ''} onChange={e => update('totalDebt', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    placeholder="0" />
                </div>
              </div>
            </div>

            {/* Monthly Budget */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
              <h3 className="text-sm font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-[10px]">📊</span>
                Monthly Budget
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Monthly Expenses ({currency})</label>
                  <input type="number" value={inputs.monthlyExpenses || ''} onChange={e => update('monthlyExpenses', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    placeholder="Rent, food, utilities..." />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Monthly Investment ({currency})</label>
                  <input type="number" value={inputs.monthlyInvestment || ''} onChange={e => update('monthlyInvestment', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    placeholder="Amount you invest each month" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 mb-1 block">Monthly Debt Payment ({currency})</label>
                  <input type="number" value={inputs.monthlyDebtPayment || ''} onChange={e => update('monthlyDebtPayment', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-secondary focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                    placeholder="0" />
                </div>
                <div className="text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2 space-y-0.5">
                  <div>Annual investment: <span className="font-bold text-secondary">{formatAmount(inputs.monthlyInvestment * 12)}</span></div>
                  {inputs.monthlyDebtPayment > 0 && inputs.totalDebt > 0 && (
                    <div>Debt-free in: <span className="font-bold text-secondary">
                      {Math.ceil(inputs.totalDebt / (inputs.monthlyDebtPayment * 12))} years
                    </span></div>
                  )}
                </div>
              </div>
            </div>

            {/* Assumptions */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
              <h3 className="text-sm font-bold text-secondary mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-[10px]">⚙️</span>
                Assumptions
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-500">Expected Return</label>
                    <span className="text-xs font-bold text-secondary">{inputs.expectedReturn}%</span>
                  </div>
                  <input type="range" min="1" max="15" step="0.5" value={inputs.expectedReturn}
                    onChange={e => update('expectedReturn', Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>1%</span><span>Conservative</span><span>Aggressive</span><span>15%</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-500">Inflation Rate</label>
                    <span className="text-xs font-bold text-secondary">{inputs.inflationRate}%</span>
                  </div>
                  <input type="range" min="0" max="8" step="0.5" value={inputs.inflationRate}
                    onChange={e => update('inflationRate', Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-500">Projection Period</label>
                    <span className="text-xs font-bold text-secondary">{inputs.projectionYears} years</span>
                  </div>
                  <input type="range" min="5" max="50" step="1" value={inputs.projectionYears}
                    onChange={e => update('projectionYears', Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>5yr</span><span>15yr</span><span>25yr</span><span>35yr</span><span>50yr</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right: Chart & Results ─────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-secondary to-surface-700 rounded-2xl p-4 text-white">
                <div className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Today Net Worth</div>
                <div className="text-lg font-bold">{formatAmount(projectionData[0].netWorth)}</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-4">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Net Worth in {inputs.projectionYears}yr</div>
                <div className="text-lg font-bold text-secondary">{formatAmount(finalData.netWorth)}</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-4">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Real Net Worth</div>
                <div className="text-lg font-bold text-amber-600">{formatAmount(finalData.netWorthReal)}</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-4">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Net Worth Growth</div>
                <div className="text-lg font-bold text-emerald-600">{formatAmount(finalData.totalGrowth)}</div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-secondary">Net Worth Projection</h3>
                <div className="flex items-center gap-4 text-[10px]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-primary rounded-full" /> Net Worth
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-amber-500 rounded-full" /> Inflation-adjusted
                  </span>
                </div>
              </div>
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" style={{ maxHeight: '320px' }}>
                {/* Grid lines */}
                {yTicks.map((tick, i) => (
                  <g key={i}>
                    <line x1={padL} y1={tick.y} x2={chartW - padR} y2={tick.y}
                      stroke="#f1f5f9" strokeWidth="1" />
                    <text x={padL - 8} y={tick.y + 3} textAnchor="end"
                      className="text-[9px] fill-slate-400">{tick.label}</text>
                  </g>
                ))}
                {/* X-axis labels */}
                {xTicks.map((yr, i) => (
                  <text key={i} x={toX(yr)} y={chartH - 8} textAnchor="middle"
                    className="text-[9px] fill-slate-400">
                    {yr === 0 ? 'Now' : `${yr}yr`}
                  </text>
                ))}
                {/* Area fill */}
                <defs>
                  <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(15,118,110)" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="rgb(15,118,110)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#projGrad)" />
                {/* Nominal line */}
                <path d={nominalPath} fill="none" stroke="rgb(15,118,110)" strokeWidth="2.5" strokeLinecap="round" />
                {/* Real line */}
                <path d={realPath} fill="none" stroke="rgb(245,158,11)" strokeWidth="1.5" strokeDasharray="4,3" strokeLinecap="round" />
                {/* Milestone dots */}
                {milestones.map((m, i) => (
                  <g key={i}>
                    <circle cx={toX(m.year!)} cy={toY(m.target)} r="4" fill="white" stroke="rgb(15,118,110)" strokeWidth="2" />
                    <text x={toX(m.year!) + 8} y={toY(m.target) - 6} className="text-[8px] fill-primary font-bold">
                      {m.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Milestones */}
            {milestones.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-5">
                <h3 className="text-sm font-bold text-secondary mb-3">Milestones</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{m.label}</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-secondary">Year {m.year} · Age {m.age}</div>
                        <div className="text-[10px] text-slate-500">
                          {m.year! <= 5 ? '🔥 Fast track' : m.year! <= 15 ? '💪 On pace' : '🐢 Long game'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Year-by-year breakdown (collapsible) */}
            <details className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
              <summary className="p-5 cursor-pointer text-sm font-bold text-secondary hover:bg-slate-50 transition-colors flex items-center justify-between">
                Year-by-Year Breakdown
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <div className="px-5 pb-5 max-h-80 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                      <th className="text-left py-2">Year</th>
                      <th className="text-left py-2">Age</th>
                      <th className="text-right py-2">Net Worth</th>
                      <th className="text-right py-2">Real Net Worth</th>
                      <th className="text-right py-2">Contributed</th>
                      <th className="text-right py-2">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectionData.filter((_, i) => i % (inputs.projectionYears <= 20 ? 1 : 5) === 0 || i === projectionData.length - 1).map((d, i) => (
                      <tr key={i} className="border-b border-slate-50 text-slate-600">
                        <td className="py-1.5 font-semibold">{d.year === 0 ? 'Now' : d.year}</td>
                        <td className="py-1.5">{d.age}</td>
                        <td className="py-1.5 text-right font-semibold text-secondary">{formatAmount(d.netWorth)}</td>
                        <td className="py-1.5 text-right text-amber-600">{formatAmount(d.netWorthReal)}</td>
                        <td className="py-1.5 text-right">{formatAmount(d.totalContributed)}</td>
                        <td className="py-1.5 text-right text-emerald-600">{formatAmount(d.totalGrowth)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>

            {/* Insights */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
              <h3 className="text-sm font-bold mb-3 text-white/80">Key Insights</h3>
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white/[0.06] rounded-xl p-3">
                  <div className="text-white/40 mb-0.5">Compound growth effect</div>
                  <div className="font-bold">{formatAmount(finalData.totalGrowth)} earned</div>
                  <div className="text-white/50 mt-0.5">
                    vs {formatAmount(finalData.totalContributed)} contributed
                  </div>
                </div>
                <div className="bg-white/[0.06] rounded-xl p-3">
                  <div className="text-white/40 mb-0.5">Inflation impact</div>
                  <div className="font-bold">{formatAmount(finalData.netWorth - finalData.netWorthReal)} lost</div>
                  <div className="text-white/50 mt-0.5">
                    {((1 - finalData.netWorthReal / finalData.netWorth) * 100).toFixed(0)}% purchasing power erosion
                  </div>
                </div>
                <div className="bg-white/[0.06] rounded-xl p-3">
                  <div className="text-white/40 mb-0.5">Growth vs contributions</div>
                  <div className="font-bold">
                    {finalData.totalContributed > 0
                      ? `${(finalData.totalGrowth / finalData.totalContributed * 100).toFixed(0)}%`
                      : '—'} ratio
                  </div>
                  <div className="text-white/50 mt-0.5">
                    {finalData.totalGrowth > finalData.totalContributed
                      ? 'Money working harder than you'
                      : 'Keep going — compound interest needs time'}
                  </div>
                </div>
                <div className="bg-white/[0.06] rounded-xl p-3">
                  <div className="text-white/40 mb-0.5">Retirement age</div>
                  <div className="font-bold">Age {currentAge + inputs.projectionYears}</div>
                  <div className="text-white/50 mt-0.5">
                    With {formatAmount(finalData.netWorthReal)} in today's money
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
