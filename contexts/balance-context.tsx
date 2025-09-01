"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface BalanceContextType {
  balance: number
  setBalance: (balance: number) => void
  debitBalance: (amount: number) => boolean
  addBalance: (amount: number) => void
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined)

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(20)

  const debitBalance = (amount: number): boolean => {
    if (balance >= amount) {
      setBalance((prev) => prev - amount)
      return true
    }
    return false
  }

  const addBalance = (amount: number) => {
    setBalance((prev) => prev + amount)
  }

  return (
    <BalanceContext.Provider value={{ balance, setBalance, debitBalance, addBalance }}>
      {children}
    </BalanceContext.Provider>
  )
}

export function useBalance() {
  const context = useContext(BalanceContext)
  if (context === undefined) {
    throw new Error("useBalance must be used within a BalanceProvider")
  }
  return context
}
