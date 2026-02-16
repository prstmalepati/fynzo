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
      <butt
