import { createContext, useContext, useEffect, useState } from "react";

const FinanceContext = createContext();
export const useFinance = () => useContext(FinanceContext);

export function FinanceProvider({ children }) {
  const [accounts, setAccounts] = useState(
    JSON.parse(localStorage.getItem("accounts")) || []
  );
  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem("transactions")) || []
  );
  const [budgets, setBudgets] = useState(
    JSON.parse(localStorage.getItem("budgets")) || {}
  );

  useEffect(() => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [accounts, transactions, budgets]);

  return (
    <FinanceContext.Provider value={{
      accounts, setAccounts,
      transactions, setTransactions,
      budgets, setBudgets
    }}>
      {children}
    </FinanceContext.Provider>
  );
}
