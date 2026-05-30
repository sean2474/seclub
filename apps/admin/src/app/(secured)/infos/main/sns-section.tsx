"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@seclub/ui/card"
import { Button } from "@seclub/ui/button"
import { Input } from "@seclub/ui/input"
import { Switch } from "@seclub/ui/switch"
import { useToast } from "@seclub/ui/use-toast"
import { ChevronDown, ChevronUp, Save } from "lucide-react"
import { useSnsLinks } from "@/hooks/use-sns-links"
import { saveSnsLinks, type AdminSnsLink } from "@/lib/action/sns-links"

export function SnsSection() {
  const { toast } = useToast()
  const { snsLinks, setSnsLinks } = useSnsLinks()
  const [rows, setRows] = useState<AdminSnsLink[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setRows(snsLinks)
  }, [snsLinks])

  const updateRow = (id: string, patch: Partial<AdminSnsLink>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  const move = (index: number, dir: "up" | "down") => {
    const target = dir === "up" ? index - 1 : index + 1
    if (target < 0 || target >= rows.length) return
    setRows((prev) => {
      const next = [...prev]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = rows.map((r, index) => ({
        id: r.id,
        url: r.url,
        active: r.active,
        sort_order: (index + 1) * 10,
      }))

      const { success, error } = await saveSnsLinks(payload)

      if (success) {
        const saved = rows.map((r, index) => ({ ...r, sort_order: (index + 1) * 10 }))
        setRows(saved)
        setSnsLinks(saved)
        toast({ title: "저장 완료", description: "SNS 링크가 저장되었습니다." })
      } else {
        toast({
          title: "저장 실패",
          description: error || "SNS 링크 저장 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("SNS save error:", error)
      toast({
        title: "오류 발생",
        description: "저장 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SNS 버튼 관리</CardTitle>
        <CardDescription>
          사이트 우측 하단 플로팅 SNS 버튼을 설정합니다. URL이 비어 있거나 노출이 꺼진 항목은
          사이트에 표시되지 않습니다. 아이콘은 플랫폼별로 고정되어 있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">불러오는 중...</p>
        ) : (
          rows.map((row, index) => (
            <div
              key={row.id}
              className="flex items-center gap-3 rounded-lg border p-3"
            >
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => move(index, "up")}
                  disabled={index === 0}
                  className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                  aria-label="위로"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, "down")}
                  disabled={index === rows.length - 1}
                  className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                  aria-label="아래로"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <span className="w-24 shrink-0 text-sm font-medium">{row.label}</span>

              <Input
                value={row.url}
                onChange={(e) => updateRow(row.id, { url: e.target.value })}
                placeholder="https://..."
                className="flex-1"
              />

              <div className="flex shrink-0 items-center gap-2">
                <Switch
                  checked={row.active}
                  onCheckedChange={(checked) => updateRow(row.id, { active: checked })}
                  aria-label="노출 여부"
                />
                <span className="w-8 text-xs text-muted-foreground">
                  {row.active ? "노출" : "숨김"}
                </span>
              </div>
            </div>
          ))
        )}

        <div className="flex justify-end pt-1">
          <Button onClick={handleSave} disabled={saving || rows.length === 0}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "저장 중..." : "저장"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
