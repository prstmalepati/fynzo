import { useState } from 'react';

interface TaxCalculation {
  grossIncome: number;
  incomeTax: number;
  solidarityTax: number;
  churchTax: number;
  pensionInsurance: number;
  healthInsurance: number;
  unemploymentInsurance: number;
  careInsurance: number;
  totalTax: number;
  totalSocialContributions: number;
  totalDeductions: number;
  netIncome: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
}

export default function GermanTaxCalculator() {
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>('single');
  const [annualIncome, setAnnualIncome] = useState(60000);
  const [partnerIncome, setPartnerIncome] = useState(0);
  const [churchTaxPayer, setChurchTaxPayer] = useState(false);
  const [taxClass, setTaxClass] = useState(1);
  const [children, setChildren] = useState(0);
  const [state, setState] = useState('Bayern');

  const calculateGermanTax = (income: number, married: boolean = false): TaxCalculation => {
    const taxableIncome = married ? income / 2 : income; // Splitting for married couples
    
    // 2024 German Income Tax Brackets
    let incomeTax = 0;
    
    if (taxableIncome <= 10908) {
      incomeTax = 0; // Tax-free allowance
    } else if (taxableIncome <= 15999) {
      // Progressive zone 1: 14% to 23.97%
      const y = (taxableIncome - 10908) / 10000;
      incomeTax = (979.18 * y + 1400) * y;
    } else if (taxableIncome <= 62809) {
      // Progressive zone 2: 23.97% to 42%
      const z = (taxableIncome - 15999) / 10000;
      incomeTax = (192.59 * z + 2397) * z + 966.53;
    } else if (taxableIncome <= 277825) {
      // 42% tax rate
      incomeTax = 0.42 * taxableIncome - 9972.98;
    } else {
      // 45% top tax rate
      incomeTax = 0.45 * taxableIncome - 18307.73;
    }
    
    // Double for married couples (splitting advantage)
    if (married) {
      incomeTax = incomeTax * 2;
    }
    
    // Solidarity Surcharge (5.5% on income tax, only if tax > €18,130 for singles / €36,260 for married)
    const solidarityThreshold = married ? 36260 : 18130;
    const solidarityTax = incomeTax > solidarityThreshold ? incomeTax * 0.055 : 0;
    
    // Church Tax (8% in Bayern/BW, 9% in other states)
    const churchTaxRate = state === 'Bayern' || state === 'Baden-Württemberg' ? 0.08 : 0.09;
    const churchTax = churchTaxPayer ? incomeTax * churchTaxRate : 0;
    
    // Social Security Contributions (2024 rates)
    // These are calculated on gross income up to contribution ceiling
    
    // Pension Insurance: 18.6% (split employer/employee)
    const pensionCeiling = 87600; // West Germany
    const pensionBase = Math.min(income, pensionCeiling);
    const pensionInsurance = pensionBase * 0.093; // Employee share
    
    // Health Insurance: ~14.6% + additional contribution ~1.6% (split employer/employee)
    const healthCeiling = 59850;
    const healthBase = Math.min(income, healthCeiling);
    const healthInsurance = healthBase * 0.073 + healthBase * 0.008; // Employee share + additional
    
    // Unemployment Insurance: 2.6% (split employer/employee)
    const unemploymentInsurance = pensionBase * 0.013; // Employee share
    
    // Care Insurance: 3.4% (split employer/employee) + 0.6% for childless (from age 23)
    const careInsurance = healthBase * 0.017 + (children === 0 ? healthBase * 0.006 : 0);
    
    const totalTax = incomeTax + solidarityTax + churchTax;
    const totalSocialContributions = pensionInsurance + healthInsurance + unemploymentInsurance + careInsurance;
    const totalDeductions = totalTax + totalSocialContributions;
    const netIncome = income - totalDeductions;
    const effectiveTaxRate = (totalDeductions / income) * 100;
    
    // Marginal tax rate (simplified)
    let marginalRate = 0;
    if (taxableIncome <= 10908) marginalRate = 0;
    else if (taxableIncome <= 15999) marginalRate = 14 + ((taxableIncome - 10908) / (15999 - 10908)) * 9.97;
    else if (taxableIncome <= 62809) marginalRate = 23.97 + ((taxableIncome - 15999) / (62809 - 15999)) * 18.03;
    else if (taxableIncome <= 277825) marginalRate = 42;
    else marginalRate = 45;
    
    return {
      grossIncome: income,
      incomeTax,
      solidarityTax,
      churchTax,
      pensionInsurance,
      healthInsurance,
      unemploymentInsurance,
      careInsurance,
      totalTax,
      totalSocialContributions,
      totalDeductions,
      netIncome,
      effectiveTaxRate,
      marginalTaxRate
    };
  };

  // Calculate for single or married
  let result: TaxCalculation;
  
  if (filingStatus === 'married' && partnerIncome > 0) {
    // Combined income for married couples
    const combinedIncome = annualIncome + partnerIncome;
    result = calculateGermanTax(combinedIncome, true);
  } else {
    result = calculateGermanTax(annualIncome, filingStatus === 'married');
  }

  const formatEuro = (amount: number) => `€${amount.toLocaleString('de-DE', { maximumFractionDigits: 0 })}`;
  const formatPercent = (percent: number) => `${percent.toFixed(2)}%`;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-secondary mb-6 flex items-center gap-3">
        <span className="text-4xl">🇩🇪</span>
        German Tax Calculator
      </h2>

      {/* Input Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Filing Status */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Filing Status</label>
          <select
            value={filingStatus}
            onChange={(e) => setFilingStatus(e.target.value as 'single' | 'married')}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          >
            <option value="single">Single / Individual</option>
            <option value="married">Married / Joint Filing</option>
          </select>
        </div>

        {/* Tax Class */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Tax Class (Steuerklasse)</label>
          <select
            value={taxClass}
            onChange={(e) => setTaxClass(Number(e.target.value))}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          >
            <option value={1}>Class I - Single, no children</option>
            <option value={2}>Class II - Single parent</option>
            <option value={3}>Class III - Married, higher earner</option>
            <option value={4}>Class IV - Married, equal earners</option>
            <option value={5}>Class V - Married, lower earner</option>
            <option value={6}>Class VI - Second job</option>
          </select>
        </div>

        {/* Annual Income */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Your Annual Gross Income
          </label>
          <input
            type="number"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(Number(e.target.value))}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        {/* Partner Income (if married) */}
        {filingStatus === 'married' && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Partner's Annual Gross Income
            </label>
            <input
              type="number"
              value={partnerIncome}
              onChange={(e) => setPartnerIncome(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
        )}

        {/* State */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">State (Bundesland)</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          >
            <option value="Bayern">Bayern</option>
            <option value="Baden-Württemberg">Baden-Württemberg</option>
            <option value="Berlin">Berlin</option>
            <option value="Hamburg">Hamburg</option>
            <option value="Hessen">Hessen</option>
            <option value="Niedersachsen">Niedersachsen</option>
            <option value="Nordrhein-Westfalen">Nordrhein-Westfalen</option>
            <option value="Sachsen">Sachsen</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Number of Children */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Children</label>
          <input
            type="number"
            value={children}
            onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
            min="0"
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        {/* Church Tax */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={churchTaxPayer}
              onChange={(e) => setChurchTaxPayer(e.target.checked)}
              className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm font-semibold text-slate-700">
              I pay Church Tax (Kirchensteuer) - {state === 'Bayern' || state === 'Baden-Württemberg' ? '8%' : '9%'} of income tax
            </span>
          </label>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
            <div className="text-sm font-semibold text-green-700 mb-1">Gross Income</div>
            <div className="text-3xl font-bold text-green-900">{formatEuro(result.grossIncome)}</div>
            <div className="text-xs text-green-600 mt-1">Annual</div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-2 border-red-200">
            <div className="text-sm font-semibold text-red-700 mb-1">Total Deductions</div>
            <div className="text-3xl font-bold text-red-900">{formatEuro(result.totalDeductions)}</div>
            <div className="text-xs text-red-600 mt-1">{formatPercent(result.effectiveTaxRate)} effective rate</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
            <div className="text-sm font-semibold text-blue-700 mb-1">Net Income</div>
            <div className="text-3xl font-bold text-blue-900">{formatEuro(result.netIncome)}</div>
            <div className="text-xs text-blue-600 mt-1">{formatEuro(result.netIncome / 12)}/month</div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-slate-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-secondary mb-4">Detailed Tax Breakdown</h3>
          
          {/* Income Tax */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-slate-200">
              <div>
                <div className="font-semibold text-slate-900">Income Tax (Einkommensteuer)</div>
                <div className="text-sm text-slate-600">Marginal rate: {formatPercent(result.marginalTaxRate)}</div>
              </div>
              <div className="text-xl font-bold text-red-600">-{formatEuro(result.incomeTax)}</div>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-slate-200">
              <div>
                <div className="font-semibold text-slate-900">Solidarity Surcharge (Solidaritätszuschlag)</div>
                <div className="text-sm text-slate-600">5.5% of income tax (if applicable)</div>
              </div>
              <div className="text-xl font-bold text-red-600">-{formatEuro(result.solidarityTax)}</div>
            </div>

            {churchTaxPayer && (
              <div className="flex justify-between items-center py-3 border-b border-slate-200">
                <div>
                  <div className="font-semibold text-slate-900">Church Tax (Kirchensteuer)</div>
                  <div className="text-sm text-slate-600">{state === 'Bayern' || state === 'Baden-Württemberg' ? '8%' : '9%'} of income tax</div>
                </div>
                <div className="text-xl font-bold text-red-600">-{formatEuro(result.churchTax)}</div>
              </div>
            )}

            <div className="flex justify-between items-center py-3 bg-red-50 rounded-lg px-4 mt-2">
              <div className="font-bold text-slate-900">Total Taxes</div>
              <div className="text-xl font-bold text-red-700">-{formatEuro(result.totalTax)}</div>
            </div>
          </div>
        </div>

        {/* Social Contributions */}
        <div className="bg-slate-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-secondary mb-4">Social Security Contributions (Sozialversicherung)</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-slate-200">
              <div>
                <div className="font-semibold text-slate-900">Pension Insurance (Rentenversicherung)</div>
                <div className="text-sm text-slate-600">9.3% employee share (18.6% total)</div>
              </div>
              <div className="text-xl font-bold text-orange-600">-{formatEuro(result.pensionInsurance)}</div>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-slate-200">
              <div>
                <div className="font-semibold text-slate-900">Health Insurance (Krankenversicherung)</div>
                <div className="text-sm text-slate-600">7.3% + ~0.8% additional contribution</div>
              </div>
              <div className="text-xl font-bold text-orange-600">-{formatEuro(result.healthInsurance)}</div>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-slate-200">
              <div>
                <div className="font-semibold text-slate-900">Unemployment Insurance (Arbeitslosenversicherung)</div>
                <div className="text-sm text-slate-600">1.3% employee share (2.6% total)</div>
              </div>
              <div className="text-xl font-bold text-orange-600">-{formatEuro(result.unemploymentInsurance)}</div>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-slate-200">
              <div>
                <div className="font-semibold text-slate-900">Care Insurance (Pflegeversicherung)</div>
                <div className="text-sm text-slate-600">1.7% {children === 0 && '+ 0.6% childless surcharge'}</div>
              </div>
              <div className="text-xl font-bold text-orange-600">-{formatEuro(result.careInsurance)}</div>
            </div>

            <div className="flex justify-between items-center py-3 bg-orange-50 rounded-lg px-4 mt-2">
              <div className="font-bold text-slate-900">Total Social Contributions</div>
              <div className="text-xl font-bold text-orange-700">-{formatEuro(result.totalSocialContributions)}</div>
            </div>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Monthly Overview</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-semibold text-blue-700">Gross/Month</div>
              <div className="text-2xl font-bold text-blue-900">{formatEuro(result.grossIncome / 12)}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-blue-700">Deductions/Month</div>
              <div className="text-2xl font-bold text-red-700">-{formatEuro(result.totalDeductions / 12)}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-blue-700">Net/Month</div>
              <div className="text-2xl font-bold text-green-700">{formatEuro(result.netIncome / 12)}</div>
            </div>
          </div>
        </div>

        {/* Info Notes */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">ℹ️ Important Notes:</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Tax-free allowance 2024: €10,908 (single) / €21,816 (married)</li>
            <li>• Social contribution ceilings: Pension €87,600 / Health €59,850</li>
            <li>• Church tax rate: 8% (Bayern, BW) or 9% (other states)</li>
            <li>• Married couples benefit from income splitting (Ehegattensplitting)</li>
            <li>• Childless people age 23+ pay additional 0.6% care insurance</li>
            <li>• This is a simplified calculation - actual tax may vary based on deductions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
