"use client"
import { usePrivacy } from "@/contexts/PrivacyContext"

export function HiddenValue({ value, className = "" }: { value: string, className?: string }) {
  const { isPrivate } = usePrivacy()
  
  if (isPrivate) {
    return <span className={`blur-sm select-none ${className}`}>R$ ••••</span>
  }
  return <span className={className}>{value}</span>
}