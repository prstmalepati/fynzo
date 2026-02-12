export const netWorth = accounts =>
  accounts.reduce((s,a)=>a.type==="loan"?s-a.balance:s+a.balance,0);

export const monthlyExpenses = txs =>
  txs.reduce((s,t)=>s+t.amount,0);

export const expensesByCategory = txs =>
  txs.reduce((a,t)=>{
    a[t.category]=(a[t.category]||0)+t.amount;
    return a;
  },{});
