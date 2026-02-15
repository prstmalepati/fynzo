export function getWealthSummary(data: any, profile: any) {
  const factor = profile.maritalStatus === "married" ? profile.members : 1

  const assets =
    data.investments +
    data.property +
    data.cash

  const liabilities = data.liabilities

  return {
    netWorth: assets - liabilities,
    assets,
    liabilities,
    liquidity: data.cash,
    perPersonNetWorth:
      profile.maritalStatus === "married"
        ? (assets - liabilities) / factor
        : null
  }
}
