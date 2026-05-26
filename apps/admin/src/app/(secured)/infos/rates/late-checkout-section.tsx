"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@seclub/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@seclub/ui/table"
import { Input } from "@seclub/ui/input"
import { Button } from "@seclub/ui/button"
import { getLateCheckoutRates, updateLateCheckoutRate } from "@/lib/action/late-checkout"
import type { LateCheckoutRate } from "@/types/rooms"
import { Save } from "lucide-react"
import { useEditableTable } from "./_hooks/use-editable-table"

type LateCheckoutPatch = { hours_3: number; hours_6: number }

export function LateCheckoutSection() {
  const {
    rows: rates,
    editingId,
    editValues,
    setEditValues,
    saving,
    startEdit,
    cancelEdit,
    save,
  } = useEditableTable<LateCheckoutRate, LateCheckoutPatch>({
    fetch: getLateCheckoutRates,
    update: updateLateCheckoutRate,
    labels: { saveSuccess: "레이트체크아웃 요금이 수정되었습니다." },
  })

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
            {rates.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell className="font-medium">{rate.room_name}</TableCell>
                <TableCell>
                  {editingId === rate.id ? (
                    <Input
                      type="number"
                      className="w-28"
                      value={editValues.hours_3 ?? 0}
                      onChange={(e) =>
                        setEditValues({ ...editValues, hours_3: Number(e.target.value) })
                      }
                    />
                  ) : (
                    rate.hours_3.toLocaleString() + "원"
                  )}
                </TableCell>
                <TableCell>
                  {editingId === rate.id ? (
                    <Input
                      type="number"
                      className="w-28"
                      value={editValues.hours_6 ?? 0}
                      onChange={(e) =>
                        setEditValues({ ...editValues, hours_6: Number(e.target.value) })
                      }
                    />
                  ) : (
                    rate.hours_6.toLocaleString() + "원"
                  )}
                </TableCell>
                <TableCell>
                  {editingId === rate.id ? (
                    <div className="flex gap-1">
                      <Button size="sm" onClick={() => save(rate.id)} disabled={saving}>
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        취소
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(rate.id, { hours_3: rate.hours_3, hours_6: rate.hours_6 })}
                    >
                      편집
                    </Button>
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
