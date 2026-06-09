"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type PrivacyContextType = {
  isPrivate: boolean 
  togglePrivacyMode: () => void
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined)

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const [isPrivate, setIsPrivate] = useState(false) 

  useEffect(() => {
    const savedMode = localStorage.getItem("privacy-mode")
    if (savedMode === "true") setIsPrivate(true)
  }, [])

  const togglePrivacyMode = () => {
    setIsPrivate((prev) => {
      const newVal = !prev
      localStorage.setItem("privacy-mode", String(newVal))
      return newVal
    })
  }

  return (
    <PrivacyContext.Provider value={{ isPrivate, togglePrivacyMode }}>
      {children}
    </PrivacyContext.Provider>
  )
}

export const usePrivacy = () => {
  const context = useContext(PrivacyContext)
  if (!context) throw new Error("usePrivacy must be used within PrivacyProvider")
  return context
}