"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@seclub/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@seclub/ui/table"
import { Input } from "@seclub/ui/input"
import { Button } from "@seclub/ui/button"
import { getRoomRates, updateRoomRate } from "@/lib/action/room-rates"
import type { RoomRate } from "@/types/rooms"
import { Save } from "lucide-react"
import { useEditableTable } from "./_hooks/use-editable-table"

type RoomRatePatch = Pick<RoomRate, "peak_rate" | "winter_rate" | "long_stay_discount">

export function RoomRatesSection() {
  const {
    rows: rates,
    editingId,
    editValues,
    setEditValues,
    saving,
    startEdit,
    cancelEdit,
    save,
  } = useEditableTable<RoomRate, RoomRatePatch>({
    fetch: getRoomRates,
    update: updateRoomRate,
    labels: { saveSuccess: "요금이 수정되었습니다." },
  })

  const lodging = rates.filter((r) => r.type === "lodging")
  const camping = rates.filter((r) => r.type === "camping")

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
            {items.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell className="font-medium">{rate.name}</TableCell>
                <TableCell>
                  {editingId === rate.id ? (
                    <Input
                      type="number"
                      className="w-28"
                      value={editValues.peak_rate ?? ""}
                      onChange={(e) =>
                        setEditValues({ ...editValues, peak_rate: Number(e.target.value) })
                      }
                    />
                  ) : (
                    rate.peak_rate.toLocaleString() + "원"
                  )}
                </TableCell>
                <TableCell>
                  {editingId === rate.id ? (
                    <Input
                      type="number"
                      className="w-28"
                      value={editValues.winter_rate ?? ""}
                      onChange={(e) =>
                        setEditValues({ ...editValues, winter_rate: Number(e.target.value) })
                      }
                    />
                  ) : (
                    rate.winter_rate.toLocaleString() + "원"
                  )}
                </TableCell>
                <TableCell>
                  {editingId === rate.id ? (
                    <Input
                      type="number"
                      className="w-20"
                      value={editValues.long_stay_discount ?? ""}
                      onChange={(e) =>
                        setEditValues({ ...editValues, long_stay_discount: Number(e.target.value) })
                      }
                    />
                  ) : (
                    rate.long_stay_discount.toLocaleString() + "원"
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
                      onClick={() =>
                        startEdit(rate.id, {
                          peak_rate: rate.peak_rate,
                          winter_rate: rate.winter_rate,
                          long_stay_discount: rate.long_stay_discount,
                        })
                      }
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

  return (
    <div className="flex flex-col gap-6">
      {renderTable(lodging, "숙박")}
      {renderTable(camping, "캠핑")}
    </div>
  )
}
