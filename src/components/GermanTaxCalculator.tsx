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
  taxFreeAllowance: number;
  kindergeld: number;
  taxableIncome: number;
}

export default function GermanTaxCalculator() {
  const [filingStatus, setFilingStatus] = useState<'single' | 'married'>('single');
  const [annualIncome, setAnnualIncome] = useState(60000);
  const [partnerIncome, setPartnerIncome] = useState(0);
  const [churchTaxPayer, setChurchTaxPayer] = useState(false);
  const [children, setChildren] = useState(0);
  const [state, setState] = useState('Bayern');
  const [childAge, setChildAge] = useState<number[]>([]);

  const calculateGermanTax = (income: number, married: boolean = false): TaxCalculation => {
    // 2024 Tax-free allowance (Grundfreibetrag)
    const taxFreeAllowance = 11604; // 2024 amount
    
    // Calculate Kindergeld (child benefit) - not taxable
    const kindergeldPerChild = 250; // 2024: €250/month for first 3 children
    const kindergeld = children * kindergeldPerChild * 12;
    
    // Taxable income calculation
    let taxableIncome = married ? income / 2 : income;
    taxableIncome = Math.max(0, taxableIncome - taxFreeAllowance);
    
    // 2024 German Income Tax Brackets with Progressive Calculation
    let incomeTax = 0;
    const incomeForTax = married ? income / 2 : income;
    
    if (incomeForTax <= 11604) {
      // Tax-free zone (Nullzone)
      incomeTax = 0;
    } else if (incomeForTax <= 17005) {
      // First progressive zone (14% to 23.97%)
      const y = (incomeForTax - 11604) / 10000;
      incomeTax = (922.98 * y + 1400) * y;
    } else if (incomeForTax <= 66760) {
      // Second progressive zone (23.97% to 42%)
      const z = (incomeForTax - 17005) / 10000;
      incomeTax = (181.19 * z + 2397) * z + 1025.38;
    } else if (incomeForTax <= 277825) {
      // Proportional zone 1 (42%)
      incomeTax = 0.42 * incomeForTax - 10602.13;
    } else {
      // Proportional zone 2 (45%) - Rich tax (Reichensteuer)
      incomeTax = 0.45 * incomeForTax - 18936.88;
    }
    
    // Double for married couples (Ehegattensplitting)
    if (married) {
      incomeTax = incomeTax * 2;
    }
    
    // Solidarity Surcharge (Solidaritätszuschlag) - 5.5%
    // Only if income tax > €18,130 (single) or €36,260 (married)
    const solidarityThreshold = married ? 36260 : 18130;
    let solidarityTax = 0;
    if (incomeTax > solidarityThreshold) {
      const excessTax = incomeTax - solidarityThreshold;
      solidarityTax = Math.min(incomeTax * 0.055, excessTax * 0.119);
    }
    
    // Church Tax (Kirchensteuer) - 8% (Bayern/BW) or 9% (other states)
    const churchTaxRate = (state === 'Bayern' || state === 'Baden-Württemberg') ? 0.08 : 0.09;
    const churchTax = churchTaxPayer ? incomeTax * churchTaxRate : 0;
    
    // Social Security Contributions (Sozialversicherung)
    // 2024 Contribution Ceilings (Beitragsbemessungsgrenzen)
    const pensionCeiling = 90600; // West Germany 2024
    const healthCeiling = 62100; // 2024
    
    // Pension Insurance (Rentenversicherung): 18.6% total, 9.3% employee
    const pensionBase = Math.min(income, pensionCeiling);
    const pensionInsurance = pensionBase * 0.093;
    
    // Health Insurance (Krankenversicherung): 14.6% base + ~1.7% additional
    const healthBase = Math.min(income, healthCeiling);
    const healthInsurance = healthBase * 0.073 + healthBase * 0.017; // Employee share + avg additional
    
    // Unemployment Insurance (Arbeitslosenversicherung): 2.6% total, 1.3% employee
    const unemploymentInsurance = pensionBase * 0.013;
    
    // Care Insurance (Pflegeversicherung): 3.4% base
    // + 0.6% surcharge for childless people over 23 (Kinderlosenzuschlag)
    // - 0.6% discount for parents (Elternrabatt) for 2+ children
    let careInsuranceRate = 0.017; // Base employee share (1.7%)
    if (children === 0) {
      careInsuranceRate += 0.006; // +0.6% for childless
    } else if (children >= 2) {
      careInsuranceRate -= 0.0025 * (children - 1); // Discount per additional child
    }
    const careInsurance = healthBase * careInsuranceRate;
    
    const totalTax = incomeTax + solidarityTax + churchTax;
    const totalSocialContributions = pensionInsurance + healthInsurance + unemploymentInsurance + careInsurance;
    const totalDeductions = totalTax + totalSocialContributions;
    
    // Kindergeld is added back (it's not taxed)
    const netIncome = income - totalDeductions + kindergeld;
    const effectiveTaxRate = (totalDeductions / income) * 100;
    
    // Marginal tax rate calculation
    let marginalTaxRate = 0;
    if (incomeForTax <= 11604) {
      marginalTaxRate = 0;
    } else if (incomeForTax <= 17005) {
      marginalTaxRate = 14 + ((incomeForTax - 11604) / (17005 - 11604)) * 9.97;
    } else if (incomeForTax <= 66760) {
      marginalTaxRate = 23.97 + ((incomeForTax - 17005) / (66760 - 17005)) * 18.03;
    } else if (incomeForTax <= 277825) {
      marginalTaxRate = 42;
    } else {
      marginalTaxRate = 45;
    }
    
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
      marginalTaxRate,
      taxFreeAllowance,
      kindergeld,
      taxableIncome
    };
  };

  let result: TaxCalculation;
  
  if (filingStatus === 'married' && partnerIncome > 0) {
    const combinedIncome = annualIncome + partnerIncome;
    result = calculateGermanTax(combinedIncome, true);
  } else {
    result = calculateGermanTax(annualIncome, filingStatus === 'married');
  }

  const formatEuro = (amount: number) => `€${amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatEuroCompact = (amount: number) => `€${amount.toLocaleString('de-DE', { maximumFractionDigits: 0 })}`;
  const formatPercent = (percent: number) => `${percent.toFixed(2)}%`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <span className="text-5xl">🇩🇪</span>
              German Tax Calculator 2024
            </h2>
            <p className="text-white/90 text-lg">
              Complete tax calculation with Grundfreibetrag, Kindergeld & progressive rates
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Filing Status</div>
            <div className="text-3xl font-bold">
              {filingStatus === 'married' ? '👫 Married' : '👤 Single'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT: Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-slate-200">
            <h3 className="text-2xl font-bold text-secondary mb-6">📝 Your Details</h3>

            <div className="space-y-4">
              {/* Filing Status */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Filing Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFilingStatus('single')}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                      filingStatus === 'single'
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    👤 Single
                  </button>
                  <button
                    onClick={() => setFilingStatus('married')}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                      filingStatus === 'married'
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    👫 Married
                  </button>
                </div>
              </div>

              {/* Annual Income */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {filingStatus === 'married' ? 'Your Annual Gross Income' : 'Annual Gross Income'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none font-semibold text-lg"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">€</span>
                </div>
              </div>

              {/* Partner Income (if married) */}
              {filingStatus === 'married' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Partner's Annual Gross Income
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={partnerIncome}
                      onChange={(e) => setPartnerIncome(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none font-semibold text-lg"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">€</span>
                  </div>
                  {partnerIncome > 0 && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-xs text-blue-700 font-semibold">Combined Income:</div>
                      <div className="text-lg font-bold text-blue-900">{formatEuroCompact(annualIncome + partnerIncome)}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Number of Children */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  👶 Number of Children (Kindergeld)
                </label>
                <input
                  type="number"
                  value={children}
                  onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
                  min="0"
                  max="10"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none font-semibold text-lg"
                />
                {children > 0 && (
                  <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xs text-green-700 font-semibold">Annual Kindergeld:</div>
                    <div className="text-lg font-bold text-green-900">+{formatEuroCompact(children * 250 * 12)}/year</div>
                    <div className="text-xs text-green-600 mt-1">€250/month per child</div>
                  </div>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  State (Bundesland)
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none font-semibold"
                >
                  <option value="Bayern">Bayern</option>
                  <option value="Baden-Württemberg">Baden-Württemberg</option>
                  <option value="Berlin">Berlin</option>
                  <option value="Hamburg">Hamburg</option>
                  <option value="Hessen">Hessen</option>
                  <option value="Nordrhein-Westfalen">Nordrhein-Westfalen</option>
                  <option value="Other">Other</option>
                </select>
                <div className="mt-1 text-xs text-slate-500">
                  Church tax: {state === 'Bayern' || state === 'Baden-Württemberg' ? '8%' : '9%'}
                </div>
              </div>

              {/* Church Tax */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <input
                  type="checkbox"
                  id="churchTax"
                  checked={churchTaxPayer}
                  onChange={(e) => setChurchTaxPayer(e.target.checked)}
                  className="w-5 h-5 text-primary rounded"
                />
                <label htmlFor="churchTax" className="text-sm font-semibold text-slate-700 cursor-pointer">
                  ⛪ Pay Church Tax (Kirchensteuer)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-primary to-teal-600 rounded-xl p-6 text-white shadow-xl">
              <div className="text-sm opacity-90 mb-1">💰 Gross Income</div>
              <div className="text-3xl font-bold">{formatEuroCompact(result.grossIncome)}</div>
              <div className="text-xs opacity-75 mt-1">{formatEuro(result.grossIncome)}</div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-xl p-6 text-white shadow-xl">
              <div className="text-sm opacity-90 mb-1">📉 Total Deductions</div>
              <div className="text-3xl font-bold">{formatEuroCompact(result.totalDeductions)}</div>
              <div className="text-xs opacity-75 mt-1">{formatPercent(result.effectiveTaxRate)} effective</div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-xl">
              <div className="text-sm opacity-90 mb-1">✅ Net Income</div>
              <div className="text-3xl font-bold">{formatEuroCompact(result.netIncome)}</div>
              <div className="text-xs opacity-75 mt-1">
                {children > 0 && `+${formatEuroCompact(result.kindergeld)} Kindergeld`}
              </div>
            </div>
          </div>

          {/* Tax Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-slate-200">
            <h3 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
              📊 Income Tax Breakdown (Einkommensteuer)
            </h3>
            
            {/* Grundfreibetrag */}
            <div className="mb-6 p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-green-900">✅ Tax-Free Allowance (Grundfreibetrag)</span>
                <span className="font-bold text-green-700 text-lg">{formatEuroCompact(result.taxFreeAllowance)}</span>
              </div>
              <div className="text-xs text-green-700">
                The first €{result.taxFreeAllowance.toLocaleString()} is completely tax-free
              </div>
            </div>

            {/* Progressive Tax Rates */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-semibold text-slate-700">Zone 1: Tax-Free (Nullzone)</div>
                  <div className="text-xs text-slate-500">€0 - €11,604</div>
                </div>
                <span className="font-bold text-green-600">0%</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-semibold text-slate-700">Zone 2: Progressive (14% → 24%)</div>
                  <div className="text-xs text-slate-500">€11,605 - €17,005</div>
                </div>
                <span className="font-bold text-blue-600">14-24%</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-semibold text-slate-700">Zone 3: Progressive (24% → 42%)</div>
                  <div className="text-xs text-slate-500">€17,006 - €66,760</div>
                </div>
                <span className="font-bold text-orange-600">24-42%</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-semibold text-slate-700">Zone 4: Proportional</div>
                  <div className="text-xs text-slate-500">€66,761 - €277,825</div>
                </div>
                <span className="font-bold text-red-600">42%</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border-2 border-red-200">
                <div>
                  <div className="font-semibold text-red-900">Zone 5: Rich Tax (Reichensteuer)</div>
                  <div className="text-xs text-red-600">Above €277,825</div>
                </div>
                <span className="font-bold text-red-700 text-lg">45%</span>
              </div>
            </div>

            {/* Actual Tax Amounts */}
            <div className="mt-6 space-y-2 pt-6 border-t-2 border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Income Tax (Einkommensteuer)</span>
                <span className="font-semibold text-slate-900">{formatEuro(result.incomeTax)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Solidarity Surcharge (Solidaritätszuschlag 5.5%)</span>
                <span className="font-semibold text-slate-900">{formatEuro(result.solidarityTax)}</span>
              </div>
              {churchTaxPayer && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">
                    Church Tax (Kirchensteuer {state === 'Bayern' || state === 'Baden-Württemberg' ? '8%' : '9%'})
                  </span>
                  <span className="font-semibold text-slate-900">{formatEuro(result.churchTax)}</span>
                </div>
              )}
              <div className="border-t-2 border-slate-300 pt-3 flex justify-between items-center">
                <span className="font-bold text-slate-900 text-lg">Total Taxes</span>
                <span className="font-bold text-red-600 text-xl">{formatEuro(result.totalTax)}</span>
              </div>
            </div>
          </div>

          {/* Social Security */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-slate-200">
            <h3 className="text-2xl font-bold text-secondary mb-4 flex items-center gap-2">
              🏥 Social Security Contributions (Sozialversicherung)
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-semibold text-slate-700">Pension Insurance (Rentenversicherung)</div>
                  <div className="text-xs text-slate-500">18.6% total (9.3% employee share)</div>
                </div>
                <span className="font-semibold text-slate-900">{formatEuro(result.pensionInsurance)}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-semibold text-slate-700">Health Insurance (Krankenversicherung)</div>
                  <div className="text-xs text-slate-500">~16.3% total (~8.15% employee share)</div>
                </div>
                <span className="font-semibold text-slate-900">{formatEuro(result.healthInsurance)}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-semibold text-slate-700">Unemployment Insurance (Arbeitslosenversicherung)</div>
                  <div className="text-xs text-slate-500">2.6% total (1.3% employee share)</div>
                </div>
                <span className="font-semibold text-slate-900">{formatEuro(result.unemploymentInsurance)}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-semibold text-slate-700">Care Insurance (Pflegeversicherung)</div>
                  <div className="text-xs text-slate-500">
                    {children === 0 ? '3.4% base + 0.6% childless surcharge' : 
                     children >= 2 ? `3.4% base - discount for ${children} children` : 
                     '3.4% base rate'}
                  </div>
                </div>
                <span className="font-semibold text-slate-900">{formatEuro(result.careInsurance)}</span>
              </div>

              <div className="border-t-2 border-blue-300 pt-3 flex justify-between items-center">
                <span className="font-bold text-slate-900 text-lg">Total Social Contributions</span>
                <span className="font-bold text-blue-600 text-xl">{formatEuro(result.totalSocialContributions)}</span>
              </div>
            </div>
          </div>

          {/* Tax Rates */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-2xl font-bold mb-4">📈 Your Tax Rates</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm opacity-90 mb-2">Effective Tax Rate</div>
                <div className="text-5xl font-bold mb-2">{formatPercent(result.effectiveTaxRate)}</div>
                <div className="text-xs opacity-75">Total deductions / Gross income</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-2">Marginal Tax Rate</div>
                <div className="text-5xl font-bold mb-2">{formatPercent(result.marginalTaxRate)}</div>
                <div className="text-xs opacity-75">Tax on next euro earned</div>
              </div>
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
            <h3 className="text-2xl font-bold text-secondary mb-4">📅 Monthly Overview</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-600 mb-1">Gross</div>
                <div className="text-2xl font-bold text-slate-900">{formatEuroCompact(result.grossIncome / 12)}</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <div className="text-xs text-red-600 mb-1">Deductions</div>
                <div className="text-2xl font-bold text-red-600">-{formatEuroCompact(result.totalDeductions / 12)}</div>
              </div>
              {children > 0 && (
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-xs text-green-600 mb-1">Kindergeld</div>
                  <div className="text-2xl font-bold text-green-600">+{formatEuroCompact(result.kindergeld / 12)}</div>
                </div>
              )}
              <div className="text-center p-4 bg-green-100 rounded-xl border-2 border-green-300">
                <div className="text-xs text-green-700 mb-1 font-semibold">Net Monthly</div>
                <div className="text-3xl font-bold text-green-700">{formatEuroCompact(result.netIncome / 12)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
