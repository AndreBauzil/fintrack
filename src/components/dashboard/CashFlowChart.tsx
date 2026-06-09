"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePrivacy } from "@/contexts/PrivacyContext"

interface ChartData {
  day: string
  balance: number
}

interface CashFlowChartProps {
  data: ChartData[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  const { isPrivate } = usePrivacy()

  if (active && payload && payload.length) {
    const value = payload[0].value
    const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

    return (
      <div className="bg-[#18181b] border border-zinc-800 rounded-lg p-3 shadow-xl">
        <p className="text-zinc-400 text-xs mb-1">Dia {label}</p>
        <p className={`font-semibold text-emerald-500 ${isPrivate ? 'blur-[6px] select-none transition-all duration-300' : 'transition-all duration-300'}`}>
          Saldo: {formatted}
        </p>
      </div>
    )
  }
  return null
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  const { isPrivate } = usePrivacy()

  const formatYAxis = (value: number) => {
    if (isPrivate) return "R$ ****"
    return `R$ ${value}`
  }

  return (
    <Card className="col-span-4 bg-zinc-900 border-zinc-800 h-[400px]">
      <CardHeader>
        <CardTitle className="text-white">Fluxo de Caixa (Diário)</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="day" 
              stroke="#52525b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#52525b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={formatYAxis} 
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#27272a', strokeWidth: 1 }} />
            
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorBalance)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}