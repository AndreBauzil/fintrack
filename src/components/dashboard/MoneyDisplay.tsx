"use client"

import { usePrivacy } from "@/contexts/PrivacyContext"

interface MoneyDisplayProps {
  value: number
  className?: string
  prefix?: string 
}

export function MoneyDisplay({ value, className, prefix = "" }: MoneyDisplayProps) {
  const { isPrivate } = usePrivacy()

  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Math.abs(value))

  return (
    <span className={`${className} ${isPrivate ? 'blur-[6px] select-none transition-all duration-300' : 'transition-all duration-300'}`}>
      {prefix}{formatted}
    </span>
  )
}