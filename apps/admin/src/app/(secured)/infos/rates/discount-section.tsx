"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@seclub/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@seclub/ui/table"
import { Input } from "@seclub/ui/input"
import { Button } from "@seclub/ui/button"
import { getDiscountRates, updateDiscountRate } from "@/lib/action/discount-rates"
import type { DiscountRate } from "@/types/rooms"
import { Save } from "lucide-react"
import { useEditableTable } from "./_hooks/use-editable-table"

const seasonLabel: Record<string, string> = { highSeason: "최성수기", winterSeason: "동절기" }
const categoryLabel: Record<string, string> = { camping: "캠핑", lodging: "숙박" }

type DiscountPatch = { discount_percent: number }

export function DiscountSection() {
  const {
    rows: rates,
    editingId,
    editValues,
    setEditValues,
    saving,
    startEdit,
    cancelEdit,
    save,
  } = useEditableTable<DiscountRate, DiscountPatch>({
    fetch: getDiscountRates,
    update: updateDiscountRate,
    labels: { saveSuccess: "할인율이 수정되었습니다." },
  })

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
              <CardTitle>
                {seasonLabel[season] || season} — {categoryLabel[category] || category}
              </CardTitle>
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
                  {items.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell className="font-medium">{rate.nights}</TableCell>
                      <TableCell>
                        {editingId === rate.id ? (
                          <Input
                            type="number"
                            className="w-20"
                            value={editValues.discount_percent ?? 0}
                            onChange={(e) =>
                              setEditValues({ discount_percent: Number(e.target.value) })
                            }
                          />
                        ) : (
                          rate.discount_percent + "%"
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
                              startEdit(rate.id, { discount_percent: rate.discount_percent })
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
      })}
    </div>
  )
}
