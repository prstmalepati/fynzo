import { WealthSnapshot } from "../components/wealth/WealthSnapshot"
import { WealthGroups } from "../components/wealth/WealthGroups"
import { getWealthSummary } from "../utils/wealthSummary"

export default function Wealth() {
  const data = {
    investments: 388000,
    property: 190000,
    cash: 42000,
    liabilities: 137700
  }

  const summary = getWealthSummary(data)

  return (
    <div className="space-y-6">
      <WealthSnapshot summary={summary} />
      <WealthGroups data={data} />
    </div>
  )
}
