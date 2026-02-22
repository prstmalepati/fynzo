import { useState } from 'react';

// 2025 Canadian Federal Tax Brackets
const CA_FED_BRACKETS = [
  { min: 0, max: 57375, rate: 0.15 },
  { min: 57375, max: 114750, rate: 0.205 },
  { min: 114750, max: 158468, rate: 0.26 },
  { min: 158468, max: 220000, rate: 0.29 },
  { min: 220000, max: Infinity, rate: 0.33 },
];

const CA_BASIC_PERSONAL = 16129; // 2025 estimated
const CPP_RATE = 0.0595; // employee portion
const CPP_MAX_PENSIONABLE = 71300; // 2025
const CPP_EXEMPTION = 3500;
const EI_RATE = 0.0163;
const EI_MAX_INSURABLE = 65700; // 2025

const CA_PROVINCES: { name: string; brackets: { min: number; max: number; rate: number }[]; basicPersonal: number }[] = [
  { name: 'Ontario', basicPersonal: 11865, brackets: [
    { min: 0, max: 51446, rate: 0.0505 }, { min: 51446, max: 102894, rate: 0.0915 },
    { min: 102894, max: 150000, rate: 0.1116 }, { min: 150000, max: 220000, rate: 0.1216 },
    { min: 220000, max: Infinity, rate: 0.1316 },
  ]},
  { name: 'British Columbia', basicPersonal: 12580, brackets: [
    { min: 0, max: 47937, rate: 0.0506 }, { min: 47937, max: 95875, rate: 0.077 },
    { min: 95875, max: 110076, rate: 0.105 }, { min: 110076, max: 133664, rate: 0.1229 },
    { min: 133664, max: 181232, rate: 0.147 }, { min: 181232, max: 252752, rate: 0.168 },
    { min: 252752, max: Infinity, rate: 0.205 },
  ]},
  { name: 'Alberta', basicPersonal: 21003, brackets: [
    { min: 0, max: 148269, rate: 0.10 }, { min: 148269, max: 177922, rate: 0.12 },
    { min: 177922, max: 237230, rate: 0.13 }, { min: 237230, max: 355845, rate: 0.14 },
    { min: 355845, max: Infinity, rate: 0.15 },
  ]},
  { name: 'Quebec', basicPersonal: 18056, brackets: [
    { min: 0, max: 51780, rate: 0.14 }, { min: 51780, max: 103545, rate: 0.19 },
    { min: 103545, max: 126000, rate: 0.24 }, { min: 126000, max: Infinity, rate: 0.2575 },
  ]},
  { name: 'Manitoba', basicPersonal: 15780, brackets: [
    { min: 0, max: 47000, rate: 0.108 }, { min: 47000, max: 100000, rate: 0.1275 },
    { min: 100000, max: Infinity, rate: 0.174 },
  ]},
  { name: 'Saskatchewan', basicPersonal: 17661, brackets: [
    { min: 0, max: 52057, rate: 0.105 }, { min: 52057, max: 148734, rate: 0.125 },
    { min: 148734, max: Infinity, rate: 0.145 },
  ]},
];

function calcProgressive(income: number, brackets: { min: number; max: number; rate: number }[]): number {
  let tax = 0;
  for (const b of brackets) {
    if (income <= b.min) break;
    tax += (Math.min(income, b.max) - b.min) * b.rate;
  }
  return tax;
}

export default function CanadaTaxCalculator() {
  const [income, setIncome] = useState(80000);
  const [provinceIdx, setProvinceIdx] = useState(0);
  const [rrspContrib, setRrspContrib] = useState(0);
  const [tfsaContrib, setTfsaContrib] = useState(0); // info only, not deductible

  const province = CA_PROVINCES[provinceIdx];
  const taxableIncome = Math.max(0, income - rrspContrib);

  // Federal tax
  const fedGross = calcProgressive(taxableIncome, CA_FED_BRACKETS);
  const fedCredit = CA_BASIC_PERSONAL * 0.15;
  const federalTax = Math.max(0, fedGross - fedCredit);

  // Provincial tax
  const provGross = calcProgressive(taxableIncome, province.brackets);
  const provCredit = province.basicPersonal * (province.brackets[0]?.rate || 0.05);
  const provincialTax = Math.max(0, provGross - provCredit);

  // CPP
  const cppPensionable = Math.min(income, CPP_MAX_PENSIONABLE) - CPP_EXEMPTION;
  const cpp = Math.max(0, cppPensionable * CPP_RATE);

  // EI
  const ei = Math.min(income, EI_MAX_INSURABLE) * EI_RATE;

  const totalTax = federalTax + provincialTax + cpp + ei;
  const netIncome = income - totalTax;
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;

  const Row = ({ label, value, bold, color }: { label: string; value: string; bold?: boolean; color?: string }) => (
    <div className={`flex justify-between py-2.5 ${bold ? 'border-t-2 border-slate-200 pt-3 mt-1' : ''}`}>
      <span className={`text-sm ${bold ? 'font-bold text-secondary' : 'text-slate-600'}`}>{label}</span>
      <span className={`text-sm font-semibold ${color || (bold ? 'text-secondary' : 'text-slate-800')}`}>{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🇨🇦</span>
          <h2 className="text-2xl font-bold text-secondary font-display">Canada Tax Calculator</h2>
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">2025</span>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Annual Gross Income (CAD)</label>
            <input type="number" value={income} onChange={e => setIncome(Number(e.target.value))}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Province</label>
            <select value={provinceIdx} onChange={e => setProvinceIdx(Number(e.target.value))}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary bg-white">
              {CA_PROVINCES.map((p, i) => <option key={i} value={i}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">RRSP Contribution</label>
            <input type="number" value={rrspContrib} onChange={e => setRrspContrib(Number(e.target.value))}
              placeholder="0" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-secondary" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-6 lg:p-8">
        <h3 className="text-lg font-bold text-secondary mb-4">Tax Breakdown</h3>
        <Row label="Gross Income" value={`C$${income.toLocaleString()}`} />
        {rrspContrib > 0 && <Row label="RRSP Deduction" value={`-C$${rrspContrib.toLocaleString()}`} color="text-emerald-600" />}
        <Row label="Taxable Income" value={`C$${taxableIncome.toLocaleString()}`} />
        <div className="my-3 border-t border-slate-100" />
        <Row label="Federal Tax" value={`C$${Math.round(federalTax).toLocaleString()}`} color="text-red-600" />
        <Row label={`${province.name} Provincial Tax`} value={`C$${Math.round(provincialTax).toLocaleString()}`} color="text-red-500" />
        <Row label="CPP (5.95%)" value={`C$${Math.round(cpp).toLocaleString()}`} color="text-red-500" />
        <Row label="EI (1.63%)" value={`C$${Math.round(ei).toLocaleString()}`} color="text-red-500" />
        <Row label="Total Deductions" value={`C$${Math.round(totalTax).toLocaleString()}`} bold color="text-red-600" />
        <Row label="Net Income (Annual)" value={`C$${Math.round(netIncome).toLocaleString()}`} bold color="text-emerald-600" />
        <Row label="Net Income (Monthly)" value={`C$${Math.round(netIncome / 12).toLocaleString()}`} />

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-primary/5 rounded-xl p-4 text-center border border-primary/10">
            <div className="text-2xl font-bold text-primary">{effectiveRate.toFixed(1)}%</div>
            <div className="text-xs text-slate-500 mt-1">Effective Tax Rate</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 text-center border border-amber-200/50">
            <div className="text-2xl font-bold text-amber-700">C${Math.round(netIncome / 12).toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1">Monthly Take-Home</div>
          </div>
        </div>
      </div>
    </div>
  );
}
