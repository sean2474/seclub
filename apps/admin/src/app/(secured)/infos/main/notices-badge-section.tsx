"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@seclub/ui/card"
import { Switch } from "@seclub/ui/switch"
import { Label } from "@seclub/ui/label"
import { useToast } from "@seclub/ui/use-toast"
import { useHeroText } from "@/hooks/use-hero-text"
import { updateHeroText } from "@/lib/action/hero-text"

export function NoticesBadgeSection() {
  const { toast } = useToast()
  const { heroText, setHeroText } = useHeroText()
  const [enabled, setEnabled] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (heroText) setEnabled(heroText.notices_new_badge)
  }, [heroText])

  const handleToggle = async (next: boolean) => {
    if (saving) return
    const prev = enabled
    setEnabled(next)
    setSaving(true)
    try {
      const { success, data, error } = await updateHeroText({ notices_new_badge: next })
      if (success && data) {
        setHeroText(data)
        toast({
          title: next ? "N 뱃지 노출" : "N 뱃지 숨김",
          description: next
            ? "메인 사이트 공지·이벤트 메뉴에 N 뱃지가 표시됩니다."
            : "메인 사이트 공지·이벤트 메뉴의 N 뱃지가 숨겨집니다.",
        })
      } else {
        setEnabled(prev)
        toast({
          title: "변경 실패",
          description: error || "N 뱃지 설정 변경 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Notices badge toggle error:", err)
      setEnabled(prev)
      toast({
        title: "오류 발생",
        description: "변경 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>공지·이벤트 메뉴 N 뱃지</CardTitle>
        <CardDescription>
          메인 사이트 상단 헤더의 &quot;공지·이벤트&quot; 메뉴 옆에 노출되는 N 뱃지를 직접 제어합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-1">
            <Label htmlFor="notices-new-badge" className="text-base">
              N 뱃지 노출
            </Label>
            <p className="text-sm text-muted-foreground">
              {enabled ? "현재 메인 사이트에 노출 중입니다." : "현재 숨겨진 상태입니다."}
            </p>
          </div>
          <Switch
            id="notices-new-badge"
            checked={enabled}
            disabled={saving}
            onCheckedChange={handleToggle}
          />
        </div>
      </CardContent>
    </Card>
  )
}
