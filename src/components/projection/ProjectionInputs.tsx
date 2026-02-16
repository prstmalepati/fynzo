import { useState } from "react"
import { ProjectionInput } from "../../types/projection"
import { calculateProjection } from "../../calculations/projection"

type Props = {
  onCalculate: (result: any) => void
}

export default function ProjectionInputs({ onCalculate }: Props) {
  const [isCouple, setIsCouple] = useState(false)

  const [form, setForm] = useState<ProjectionInput>({
    years: 20,
    isCouple: false,

    age1: 30,
    age2: 30,

    income1: 60000,
    income2: 50000,

    bonusIncome: 0,
    otherIncome: 0,

    initialInvestment: 20000,
    monthlyInvestment: 1000,
    investmentReturn: 0.06,

    monthlyExpenses: 2500,
    expenseGrowth: 0.02,

    currentDebt: 0,
    monthlyDebtPayment: 0,
  })

  function update<K extends keyof ProjectionInput>(key: K, value: ProjectionInput[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleCalculate() {
    const result = calculateProjection({
      ...form,
      isCouple
    })
    onCalculate(result)
  }

  return (
    <div className="space-y-6">

      {/* Mode */}
      <div className="flex items-center gap-4">
        <label className="font-medium">Mode:</label>
        <button
          onClick={() => setIsCouple(false)}
          className={!isCouple ? activeBtn : inactiveBtn}
        >
          Single
        </button>
        <button
          onClick={() => setIsCouple(true)}
          className={isCouple ? activeBtn : inactiveBtn}
        >
          Couple
        </button>
      </div>

      {/* Ages */}
      <Section title="Profile">
        <Input
          label="Your Age"
          value={form.age1}
          onChange={v => update("age1", v)}
        />
        {isCouple && (
          <Input
            label="Partner Age"
            value={form.age2 || 0}
            onChange={v => update("age2", v)}
          />
        )}
      </Section>

      {/* Income */}
      <Section title="Income (Annual)">
        <Input
          label="Your Income (€)"
          value={form.income1}
          onChange={v => update("income1", v)}
        />
        {isCouple && (
          <Input
            label="Partner Income (€)"
            value={form.income2 || 0}
            onChange={v => update("income2", v)}
          />
        )}
        <Input
          label="Bonus Income (€)"
          value={form.bonusIncome}
          onChange={v => update("bonusIncome", v)}
        />
      </Section>

      {/* Investments */}
      <Section title="Investments">
        <Input
          label="Initial Investment (€)"
          value={form.initialInvestment}
          onChange={v => update("initialInvestment", v)}
        />
        <Input
          label="Monthly Investment (€)"
          value={form.monthlyInvestment}
          onChange={v => update("monthlyInvestment", v)}
        />
        <Input
          label="Expected Return (%)"
          value={form.investmentReturn * 100}
          onChange={v => update("investmentReturn", v / 100)}
        />
      </Section>

      {/* Expenses */}
      <Section title="Expenses">
        <Input
          label="Monthly Expenses (€)"
          value={form.monthlyExpenses}
          onChange={v => update("monthlyExpenses", v)}
        />
        <Input
          label="Expense Growth (%)"
          value={form.expenseGrowth * 100}
          onChange={v => update("expenseGrowth", v / 100)}
        />
      </Section>

      {/* Debt */}
      <Section title="Debt">
        <Input
          label="Current Debt (€)"
          value={form.currentDebt}
          onChange={v => update("currentDebt", v)}
        />
        <Input
          label="Monthly Debt Payment (€)"
          value={form.monthlyDebtPayment}
          onChange={v => update("monthlyDebtPayment", v)}
        />
      </Section>

      {/* CTA */}
      <button
        onClick={handleCalculate}
        className="w-full bg-black text-white py-3 rounded-xl font-semibold"
      >
        Calculate Projection
      </button>
    </div>
  )
}

/* ------------------ Helpers ------------------ */

function Section({ title, children }: { title: string; children: any }) {
  return (
    <div>
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <label className="flex flex-col text-sm gap-1">
      <span className="text-gray-600">{label}</span>
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="border rounded-lg px-3 py-2"
      />
    </label>
  )
}

const activeBtn =
  "px-4 py-2 rounded-lg bg-black text-white font-medium"

const inactiveBtn =
  "px-4 py-2 rounded-lg border text-gray-600"