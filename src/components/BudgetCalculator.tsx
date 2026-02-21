import { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

interface CountryTaxData {
  name: string;
  brackets: TaxBracket[];
  socialSecurity: number;
  standardDeduction: number;
}

export default function BudgetCalculator() {
  const { formatAmount, currency } = useCurrency();
  
  // Country Selection
  const [country, setCountry] = useState('Germany');
  
  // Income
  const [salary, setSalary] = useState(188000);
  const [bonus, setBonus] = useState(28200);
  const [onCallPay, setOnCallPay] = useState(28200);
  const [rsus, setRsus] = useState(45000);
  const [interestIncome, setInterestIncome] = useState(2500);
  
  // Responsible Expenses
  const [rent, setRent] = useState(3495);
  const [groceries, setGroceries] = useState(500);
  const [utilities, setUtilities] = useState(200);
  const [studentLoans, setStudentLoans] = useState(0);
  const [creditCardDebt, setCreditCardDebt] = useState(0);
  const [investments, setInvestments] = useState(2600);
  const [laundry, setLaundry] = useState(0);
  const [carExpenses, setCarExpenses] = useState(0);
  const [publicTransport, setPublicTransport] = useState(75);
  const [subscriptions, setSubscriptions] = useState(50);
  
  // Irresponsible Expenses
  const [funRandom, setFunRandom] = useState(300);
  const [alcohol, setAlcohol] = useState(100);
  const [ubers, setUbers] = useState(50);
  
  // Bonus Spending
  const [eatingOut, setEatingOut] = useState(800);
  const [travel, setTravel] = useState(500);
  const [gymFitness, setGymFitness] = useState(200);
  const [hair, setHair] = useState(50);
  const [nails, setNails] = useState(0);
  const [skincare, setSkincare] = useState(0);
  const [clothes, setClothes] = useState(100);
  const [coffee, setCoffee] = useState(20);
  
  // Savings
  const [retirement401k, setRetirement401k] = useState(150000);
  const [cash, setCash] = useState(6500);
  const [otherInvestments, setOtherInvestments] = useState(50000);
  const [homeEquity, setHomeEquity] = useState(24000);

  // Country-specific tax data
  const countryTaxData: { [key: string]: CountryTaxData } = {
    'Germany': {
      name: 'Germany',
      brackets: [
        { min: 0, max: 10908, rate: 0 },
        { min: 10908, max: 62809, rate: 0.14 },
        { min: 62809, max: 277825, rate: 0.42 },
        { min: 277825, max: Infinity, rate: 0.45 }
      ],
      socialSecurity: 0.20, // ~20% total (pension, health, unemployment, care)
      standardDeduction: 1230
    },
    'United States': {
      name: 'United States',
      brackets: [
        { min: 0, max: 11000, rate: 0.10 },
        { min: 11000, max: 44725, rate: 0.12 },
        { min: 44725, max: 95375, rate: 0.22 },
        { min: 95375, max: 182100, rate: 0.24 },
        { min: 182100, max: 231250, rate: 0.32 },
        { min: 231250, max: 578125, rate: 0.35 },
        { min: 578125, max: Infinity, rate: 0.37 }
      ],
      socialSecurity: 0.0765, // 7.65% (Social Security + Medicare)
      standardDeduction: 13850
    },
    'United Kingdom': {
      name: 'United Kingdom',
      brackets: [
        { min: 0, max: 12570, rate: 0 },
        { min: 12570, max: 50270, rate: 0.20 },
        { min: 50270, max: 125140, rate: 0.40 },
        { min: 125140, max: Infinity, rate: 0.45 }
      ],
      socialSecurity: 0.12, // National Insurance
      standardDeduction: 0
    },
    'Switzerland': {
      name: 'Switzerland',
      brackets: [
        { min: 0, max: 17800, rate: 0 },
        { min: 17800, max: 31600, rate: 0.01 },
        { min: 31600, max: 41400, rate: 0.02 },
        { min: 41400, max: 55200, rate: 0.03 },
        { min: 55200, max: 72500, rate: 0.04 },
        { min: 72500, max: 78100, rate: 0.05 },
        { min: 78100, max: Infinity, rate: 0.065 }
      ],
      socialSecurity: 0.06, // AHV/IV/EO
      standardDeduction: 0
    }
  };

  const selectedCountryData = countryTaxData[country];

  // Calculations
  const totalPreTaxIncome = salary + bonus + onCallPay + rsus + interestIncome;
  
  // Calculate federal tax
  const calculateTax = (income: number): number => {
    let tax = 0;
    let remainingIncome = income;
    
    for (const bracket of selectedCountryData.brackets) {
      const taxableInBracket = Math.min(
        Math.max(0, remainingIncome - bracket.min),
        bracket.max - bracket.min
      );
      tax += taxableInBracket * bracket.rate;
      if (remainingIncome <= bracket.max) break;
    }
    
    return tax;
  };

  const federalTax = calculateTax(totalPreTaxIncome);
  const socialSecurityTax = totalPreTaxIncome * selectedCountryData.socialSecurity;
  const totalTax = federalTax + socialSecurityTax;
  
  const annualTakeHome = totalPreTaxIncome - totalTax;
  const monthlyTakeHome = annualTakeHome / 12;
  
  // Monthly expenses
  const responsibleExpenses = rent + groceries + utilities + studentLoans + creditCardDebt + 
                             investments + laundry + carExpenses + publicTransport + subscriptions;
  const irresponsibleExpenses = funRandom + alcohol + ubers;
  const bonusSpending = eatingOut + travel + gymFitness + hair + nails + skincare + clothes + coffee;
  
  const totalMonthlyExpenses = responsibleExpenses + irresponsibleExpenses + bonusSpending;
  const monthlySavings = monthlyTakeHome - totalMonthlyExpenses;
  const annualSavings = monthlySavings * 12;
  
  const totalSavings = retirement401k + cash + otherInvestments + homeEquity;
  const savingsRate = (monthlySavings / monthlyTakeHome) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-secondary mb-6 flex items-center gap-3">
        <span className="text-4xl">💰</span>
        Income & Budget Calculator
      </h2>

      {/* Country Selection */}
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Country / Region</label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full md:w-64 px-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none font-semibold text-lg bg-white"
        >
          <option value="Germany">🇩🇪 Germany</option>
          <option value="United States">🇺🇸 United States</option>
          <option value="United Kingdom">🇬🇧 United Kingdom</option>
          <option value="Switzerland">🇨🇭 Switzerland</option>
        </select>
        <p className="text-sm text-slate-600 mt-2">Tax calculations based on {country} tax rules</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* LEFT COLUMN - INCOME */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
            <h3 className="text-xl font-bold text-green-900 mb-4">💵 INCOME</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-green-800 mb-1">Annual Salary</label>
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-800 mb-1">Bonus</label>
                <input
                  type="number"
                  value={bonus}
                  onChange={(e) => setBonus(Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-800 mb-1">On-call Pay / Extra Income</label>
                <input
                  type="number"
                  value={onCallPay}
                  onChange={(e) => setOnCallPay(Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-800 mb-1">RSUs / Stock Compensation</label>
                <input
                  type="number"
                  value={rsus}
                  onChange={(e) => setRsus(Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-green-800 mb-1">Interest / Dividend Income</label>
                <input
                  type="number"
                  value={interestIncome}
                  onChange={(e) => setInterestIncome(Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <div className="pt-4 border-t-2 border-green-300">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-900">Total Pre-Tax:</span>
                  <span className="font-bold text-green-900 text-lg">{formatAmount(totalPreTaxIncome)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tax Breakdown */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200">
            <h3 className="text-xl font-bold text-red-900 mb-4">📊 Taxes</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-red-800">Income Tax:</span>
                <span className="font-semibold text-red-900">{formatAmount(federalTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-800">Social Security:</span>
                <span className="font-semibold text-red-900">{formatAmount(socialSecurityTax)}</span>
              </div>
              <div className="pt-3 border-t-2 border-red-300 flex justify-between">
                <span className="font-bold text-red-900">Total Tax:</span>
                <span className="font-bold text-red-900 text-lg">{formatAmount(totalTax)}</span>
              </div>
              <div className="flex justify-between text-xs text-red-700">
                <span>Effective Rate:</span>
                <span>{((totalTax / totalPreTaxIncome) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Take Home */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-300">
            <h3 className="text-lg font-bold text-blue-900 mb-2">💵 Take Home Pay</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-800">Annual:</span>
                <span className="font-bold text-blue-900">{formatAmount(annualTakeHome)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-bold text-blue-900">Monthly:</span>
                <span className="font-bold text-blue-900">{formatAmount(monthlyTakeHome)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN - EXPENSES */}
        <div className="space-y-6">
          {/* Responsible Expenses */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border-2 border-teal-200">
            <h3 className="text-xl font-bold text-teal-900 mb-4">✅ Essential Expenses</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-teal-800 mb-1">Rent / Mortgage</label>
                <input type="number" value={rent} onChange={(e) => setRent(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-teal-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-teal-800 mb-1">Groceries</label>
                <input type="number" value={groceries} onChange={(e) => setGroceries(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-teal-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-teal-800 mb-1">Utilities</label>
                <input type="number" value={utilities} onChange={(e) => setUtilities(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-teal-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-teal-800 mb-1">Student Loans</label>
                <input type="number" value={studentLoans} onChange={(e) => setStudentLoans(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-teal-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-teal-800 mb-1">Investments</label>
                <input type="number" value={investments} onChange={(e) => setInvestments(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-teal-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-teal-800 mb-1">Car / Transport</label>
                <input type="number" value={carExpenses + publicTransport} 
                  onChange={(e) => { setCarExpenses(Number(e.target.value) - publicTransport); }}
                  className="w-full px-3 py-2 border border-teal-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-teal-800 mb-1">Subscriptions</label>
                <input type="number" value={subscriptions} onChange={(e) => setSubscriptions(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-teal-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none" />
              </div>
              
              <div className="pt-3 border-t-2 border-teal-300 flex justify-between">
                <span className="font-bold text-teal-900">Total Essential:</span>
                <span className="font-bold text-teal-900">{formatAmount(responsibleExpenses)}</span>
              </div>
            </div>
          </div>

          {/* Discretionary Expenses */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
            <h3 className="text-xl font-bold text-purple-900 mb-4">🎉 Discretionary</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-purple-800 mb-1">Eating Out</label>
                <input type="number" value={eatingOut} onChange={(e) => setEatingOut(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-purple-800 mb-1">Travel</label>
                <input type="number" value={travel} onChange={(e) => setTravel(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-purple-800 mb-1">Gym / Fitness</label>
                <input type="number" value={gymFitness} onChange={(e) => setGymFitness(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-purple-800 mb-1">Fun / Entertainment</label>
                <input type="number" value={funRandom} onChange={(e) => setFunRandom(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-purple-800 mb-1">Clothes / Shopping</label>
                <input type="number" value={clothes} onChange={(e) => setClothes(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-purple-800 mb-1">Coffee / Treats</label>
                <input type="number" value={coffee} onChange={(e) => setCoffee(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              
              <div className="pt-3 border-t-2 border-purple-300 flex justify-between">
                <span className="font-bold text-purple-900">Total Discretionary:</span>
                <span className="font-bold text-purple-900">{formatAmount(bonusSpending + irresponsibleExpenses)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - SAVINGS & SUMMARY */}
        <div className="space-y-6">
          {/* Monthly Summary */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white border-2 border-slate-700">
            <h3 className="text-xl font-bold mb-4">📋 Monthly Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="opacity-90">Take Home:</span>
                <span className="font-semibold">{formatAmount(monthlyTakeHome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Essential:</span>
                <span className="font-semibold text-teal-300">-{formatAmount(responsibleExpenses)}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Discretionary:</span>
                <span className="font-semibold text-purple-300">-{formatAmount(bonusSpending + irresponsibleExpenses)}</span>
              </div>
              <div className="pt-3 border-t-2 border-white/20 flex justify-between text-lg">
                <span className="font-bold">Monthly Savings:</span>
                <span className={`font-bold ${monthlySavings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatAmount(monthlySavings)}
                </span>
              </div>
              <div className="flex justify-between text-xs opacity-75">
                <span>Savings Rate:</span>
                <span>{savingsRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Annual Savings */}
          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-white shadow-xl">
            <h3 className="text-lg font-bold mb-2 opacity-90">Annual Savings</h3>
            <div className="text-4xl font-bold">{formatAmount(annualSavings)}</div>
            <div className="text-sm opacity-75 mt-2">{formatAmount(monthlySavings)}/month</div>
          </div>

          {/* Total Savings */}
          <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
            <h3 className="text-xl font-bold text-secondary mb-4">💎 Total Savings</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">401k / Pension</label>
                <input type="number" value={retirement401k} onChange={(e) => setRetirement401k(Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cash / Emergency Fund</label>
                <input type="number" value={cash} onChange={(e) => setCash(Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Other Investments</label>
                <input type="number" value={otherInvestments} onChange={(e) => setOtherInvestments(Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Home Equity</label>
                <input type="number" value={homeEquity} onChange={(e) => setHomeEquity(Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" />
              </div>
              
              <div className="pt-3 border-t-2 border-slate-300 flex justify-between">
                <span className="font-bold text-secondary">Total Net Worth:</span>
                <span className="font-bold text-primary text-xl">{formatAmount(totalSavings)}</span>
              </div>
            </div>
          </div>

          {/* Visual Breakdown */}
          <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
            <h3 className="text-lg font-bold text-secondary mb-4">💡 Spending Breakdown</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-teal-700 font-semibold">Essential</span>
                  <span className="font-bold">{((responsibleExpenses/totalMonthlyExpenses)*100).toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-teal-200 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500" style={{width: `${(responsibleExpenses/totalMonthlyExpenses)*100}%`}}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-purple-700 font-semibold">Discretionary</span>
                  <span className="font-bold">{(((bonusSpending+irresponsibleExpenses)/totalMonthlyExpenses)*100).toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-purple-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{width: `${((bonusSpending+irresponsibleExpenses)/totalMonthlyExpenses)*100}%`}}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-700 font-semibold">Savings</span>
                  <span className="font-bold">{savingsRate.toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-green-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{width: `${Math.max(0, savingsRate)}%`}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Notes */}
      <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">ℹ️ Tax Information for {country}:</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Income tax calculated using {country} tax brackets</li>
          <li>• Social security: {(selectedCountryData.socialSecurity * 100).toFixed(1)}% of gross income</li>
          <li>• Effective tax rate: {((totalTax / totalPreTaxIncome) * 100).toFixed(1)}%</li>
          <li>• This is a simplified calculator - actual tax may vary based on deductions and credits</li>
        </ul>
      </div>
    </div>
  );
}
