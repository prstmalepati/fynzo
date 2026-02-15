export function ProjectionInputs({ values, onChange }: any) {
  return (
    <div className="grid gap-4 rounded-xl bg-white p-6 shadow">
      <h2 className="font-semibold">Projection Inputs</h2>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={values.isCouple}
          onChange={e => onChange("isCouple", e.target.checked)}
        />
        Married / Couple
      </label>

      <input
        type="number"
        placeholder="Years"
        value={values.years}
        onChange={e => onChange("years", +e.target.value)}
      />

      <input
        type="number"
        placeholder="Monthly Investment (€)"
        value={values.monthlyInvestment}
        onChange={e => onChange("monthlyInvestment", +e.target.value)}
      />
    </div>
  )
}
