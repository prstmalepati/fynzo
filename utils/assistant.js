export function nextBestAction({ expenses, netWorth, income }) {
  if (expenses * 12 > income * 0.7)
    return { title:"Reduce expenses", impact:"+2 years FIRE" };
  if (netWorth < income)
    return { title:"Build emergency fund", impact:"Stability ↑" };
  return { title:"Increase investments", impact:"Compounding ↑" };
}
