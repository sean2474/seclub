"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getRoomRates, updateRoomRate } from "@/lib/action/rooms"
import type { RoomRate } from "@/types/rooms"
import { Save } from "lucide-react"

export function RoomRatesSection() {
  const { toast } = useToast()
  const [rates, setRates] = useState<RoomRate[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<RoomRate>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await getRoomRates()
      if (error) toast({ title: "오류", description: error, variant: "destructive" })
      if (data) setRates(data)
    }
    fetch()
  }, [])

  const startEdit = (rate: RoomRate) => {
    setEditingId(rate.id)
    setEditValues({ peak_rate: rate.peak_rate, winter_rate: rate.winter_rate, long_stay_discount: rate.long_stay_discount })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValues({})
  }

  const handleSave = async (id: string) => {
    setSaving(true)
    const { success, error } = await updateRoomRate(id, {
      peak_rate: editValues.peak_rate,
      winter_rate: editValues.winter_rate,
      long_stay_discount: editValues.long_stay_discount,
    })
    if (success) {
      setRates(rates.map(r => r.id === id ? { ...r, ...editValues } as RoomRate : r))
      toast({ title: "저장 완료", description: "요금이 수정되었습니다." })
      setEditingId(null)
    } else {
      toast({ title: "저장 실패", description: error || "오류가 발생했습니다.", variant: "destructive" })
    }
    setSaving(false)
  }

  const lodging = rates.filter(r => r.type === "lodging")
  const camping = rates.filter(r => r.type === "camping")

  const renderTable = (items: RoomRate[], label: string) => (
    <Card>
      <CardHeader>
        <CardTitle>{label} 요금</CardTitle>
        <CardDescription>1박 기준 요금 (원)</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>객실/사이트명</TableHead>
              <TableHead>최성수기</TableHead>
              <TableHead>동절기</TableHead>
              <TableHead>장기 할인</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map(rate => (
              <TableRow key={rate.id}>
                <TableCell className="font-medium">{rate.name}</TableCell>
                <TableCell>
                  {editingId === rate.id ? (
                    <Input type="number" className="w-28" value={editValues.peak_rate ?? ""} onChange={e => setEditValues({ ...editValues, peak_rate: Number(e.target.value) })} />
                  ) : (
                    rate.peak_rate.toLocaleString() + "원"
                  )}
                </TableCell>
                <TableCell>
                  {editingId === rate.id ? (
                    <Input type="number" className="w-28" value={editValues.winter_rate ?? ""} onChange={e => setEditValues({ ...editValues, winter_rate: Number(e.target.value) })} />
                  ) : (
                    rate.winter_rate.toLocaleString() + "원"
                  )}
                </TableCell>
                <TableCell>
                  {editingId === rate.id ? (
                    <Input type="number" className="w-20" value={editValues.long_stay_discount ?? ""} onChange={e => setEditValues({ ...editValues, long_stay_discount: Number(e.target.value) })} />
                  ) : (
                    rate.long_stay_discount + "%"
                  )}
                </TableCell>
                <TableCell>
                  {editingId === rate.id ? (
                    <div className="flex gap-1">
                      <Button size="sm" onClick={() => handleSave(rate.id)} disabled={saving}>
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>취소</Button>
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

  return (
    <div className="flex flex-col gap-6">
      {renderTable(lodging, "숙박")}
      {renderTable(camping, "캠핑")}
    </div>
  )
}
