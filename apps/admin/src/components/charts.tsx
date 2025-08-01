"use client"

import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const bookingData = [
  { date: "7/19", bookings: 28 },
  { date: "7/20", bookings: 35 },
  { date: "7/21", bookings: 41 },
  { date: "7/22", bookings: 30 },
  { date: "7/23", bookings: 45 },
  { date: "7/24", bookings: 52 },
  { date: "7/25", bookings: 32 },
]

const occupancyData = [
  { month: "2월", rate: 45 },
  { month: "3월", rate: 55 },
  { month: "4월", rate: 70 },
  { month: "5월", rate: 80 },
  { month: "6월", rate: 75 },
  { month: "7월", rate: 90 },
]

export function BookingChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={bookingData}>
        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}건`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
          }}
        />
        <Legend />
        <Bar
          dataKey="bookings"
          name="예약 건수"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
          activeBar={{
            fill: "hsl(var(--primary) / 0.8)",
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function OccupancyChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={occupancyData}>
        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="rate" name="점유율" stroke="hsl(var(--primary))" />
      </LineChart>
    </ResponsiveContainer>
  )
}
