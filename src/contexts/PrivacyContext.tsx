"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type PrivacyContextType = {
  isPrivacyMode: boolean
  togglePrivacyMode: () => void
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined)

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const [isPrivacyMode, setIsPrivacyMode] = useState(false)

  // Loads user's preferences from LocalStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("privacy-mode")
    if (savedMode === "true") setIsPrivacyMode(true)
  }, [])

  const togglePrivacyMode = () => {
    setIsPrivacyMode((prev) => {
      const newVal = !prev
      localStorage.setItem("privacy-mode", String(newVal))
      return newVal
    })
  }

  return (
    <PrivacyContext.Provider value={{ isPrivacyMode, togglePrivacyMode }}>
      {children}
    </PrivacyContext.Provider>
  )
}

export const usePrivacy = () => {
  const context = useContext(PrivacyContext)
  if (!context) throw new Error("usePrivacy must be used within PrivacyProvider")
  return context
}