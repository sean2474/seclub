"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getDiscountRates, updateDiscountRate } from "@/lib/action/rooms"
import type { DiscountRate } from "@/types/rooms"
import { Save } from "lucide-react"

const seasonLabel: Record<string, string> = { highSeason: "최성수기", winterSeason: "동절기" }
const categoryLabel: Record<string, string> = { camping: "캠핑", lodging: "숙박" }

export function DiscountSection() {
  const { toast } = useToast()
  const [rates, setRates] = useState<DiscountRate[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await getDiscountRates()
      if (error) toast({ title: "오류", description: error, variant: "destructive" })
      if (data) setRates(data)
    }
    fetch()
  }, [])

  const handleSave = async (id: number) => {
    setSaving(true)
    const { success, error } = await updateDiscountRate(id, { discount_percent: editValue })
    if (success) {
      setRates(rates.map(r => r.id === id ? { ...r, discount_percent: editValue } : r))
      toast({ title: "저장 완료", description: "할인율이 수정되었습니다." })
      setEditingId(null)
    } else {
      toast({ title: "저장 실패", description: error || "오류가 발생했습니다.", variant: "destructive" })
    }
    setSaving(false)
  }

  // 시즌+카테고리별 그룹핑
  const groups = rates.reduce<Record<string, DiscountRate[]>>((acc, rate) => {
    const key = `${rate.season}|${rate.category}`
    if (!acc[key]) acc[key] = []
    acc[key].push(rate)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(groups).map(([key, items]) => {
        const [season, category] = key.split("|")
        return (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{seasonLabel[season] || season} — {categoryLabel[category] || category}</CardTitle>
              <CardDescription>숙박 기간별 할인율 (%)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>숙박 기간</TableHead>
                    <TableHead>할인율</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(rate => (
                    <TableRow key={rate.id}>
                      <TableCell className="font-medium">{rate.nights}</TableCell>
                      <TableCell>
                        {editingId === rate.id ? (
                          <Input type="number" className="w-20" value={editValue} onChange={e => setEditValue(Number(e.target.value))} />
                        ) : (
                          rate.discount_percent + "%"
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === rate.id ? (
                          <div className="flex gap-1">
                            <Button size="sm" onClick={() => handleSave(rate.id)} disabled={saving}><Save className="h-3 w-3" /></Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>취소</Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="ghost" onClick={() => { setEditingId(rate.id); setEditValue(rate.discount_percent) }}>편집</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
