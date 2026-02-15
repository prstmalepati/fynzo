import { useAnimatedNumber } from "../../hooks/useAnimatedNumber"

export function WealthSnapshot({ summary, profile }: any) {
  const animatedNetWorth = useAnimatedNumber(summary.netWorth)

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="text-sm text-gray-500">
        Net Worth {profile.maritalStatus === "married" && "(Household)"}
      </h2>

      <p className="text-3xl font-semibold">
        €{animatedNetWorth.toLocaleString()}
      </p>
    </div>
  )
}
