"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartData {
  day: string
  balance: number
}

interface CashFlowChartProps {
  data: ChartData[]
}

export function CashFlowChart({ data }: CashFlowChartProps) {
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
              tickFormatter={(value) => `R$ ${value}`} 
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: '#10b981' }}
              formatter={(value: number) => [`R$ ${value.toFixed(2)}`, "Saldo"]}
            />
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