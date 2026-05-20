"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@seclub/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@seclub/ui/table"
import { Input } from "@seclub/ui/input"
import { Button } from "@seclub/ui/button"
import { useToast } from "@seclub/ui/use-toast"
import { getLateCheckoutRates, updateLateCheckoutRate } from "@/lib/action/rooms"
import type { LateCheckoutRate } from "@/types/rooms"
import { Save } from "lucide-react"

export function LateCheckoutSection() {
  const { toast } = useToast()
  const [rates, setRates] = useState<LateCheckoutRate[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<{ hours_3: number; hours_6: number }>({ hours_3: 0, hours_6: 0 })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await getLateCheckoutRates()
      if (error) toast({ title: "오류", description: error, variant: "destructive" })
      if (data) setRates(data)
    }
    fetch()
  }, [])

  const startEdit = (rate: LateCheckoutRate) => {
    setEditingId(rate.id)
    setEditValues({ hours_3: rate.hours_3, hours_6: rate.hours_6 })
  }

  const handleSave = async (id: number) => {
    setSaving(true)
    const { success, error } = await updateLateCheckoutRate(id, editValues)
    if (success) {
      setRates(rates.map(r => r.id === id ? { ...r, ...editValues } : r))
      toast({ title: "저장 완료", description: "레이트체크아웃 요금이 수정되었습니다." })
      setEditingId(null)
    } else {
      toast({ title: "저장 실패", description: error || "오류가 발생했습니다.", variant: "destructive" })
    }
    setSaving(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>레이트체크아웃 요금</CardTitle>
        <CardDescription>체크아웃 연장 시 추가 요금 (원)</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>객실/사이트명</TableHead>
              <TableHead>3시간 연장</TableHead>
              <TableHead>6시간 연장</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rates.map(rate => (
              <TableRow key={rate.id}>
                <TableCell className="font-medium">{rate.room_name}</TableCell>
                <TableCell>
                  {editingId === rate.id ? (
                    <Input type="number" className="w-28" value={editValues.hours_3} onChange={e => setEditValues({ ...editValues, hours_3: Number(e.target.value) })} />
                  ) : (
                    rate.hours_3.toLocaleString() + "원"
                  )}
                </TableCell>
                <TableCell>
                  {editingId === rate.id ? (
                    <Input type="number" className="w-28" value={editValues.hours_6} onChange={e => setEditValues({ ...editValues, hours_6: Number(e.target.value) })} />
                  ) : (
                    rate.hours_6.toLocaleString() + "원"
                  )}
                </TableCell>
                <TableCell>
                  {editingId === rate.id ? (
                    <div className="flex gap-1">
                      <Button size="sm" onClick={() => handleSave(rate.id)} disabled={saving}><Save className="h-3 w-3" /></Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>취소</Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => startEdit(rate)}>편집</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
