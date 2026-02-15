import { WealthGroup } from "./WealthGroup"

export function WealthGroups({ data }: any) {
  return (
    <div className="space-y-2">
      <WealthGroup title="Investments" value={data.investments} trend={8.1} />
      <WealthGroup title="Property" value={data.property} trend={3.2} />
      <WealthGroup title="Cash" value={data.cash} />
      <WealthGroup title="Liabilities" value={data.liabilities} />
    </div>
  )
}
