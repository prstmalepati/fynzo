export type AssetAllocation = {
  etf: number       // %
  cash: number
  realEstate: number
}

export const DEFAULT_RETURNS = {
  etf: 0.07,
  cash: 0.01,
  realEstate: 0.04
}

export function blendedReturn(
  allocation: AssetAllocation
) {
  return (
    allocation.etf * DEFAULT_RETURNS.etf +
    allocation.cash * DEFAULT_RETURNS.cash +
    allocation.realEstate * DEFAULT_RETURNS.realEstate
  )
}
