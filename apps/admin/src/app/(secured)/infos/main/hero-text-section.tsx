"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useHeroText } from "@/hooks/use-hero-text"
import { updateHeroText } from "@/lib/action/hero-text"
import { ChevronRight, Save } from "lucide-react"

export function HeroTextSection() {
  const { toast } = useToast()
  const { heroText, setHeroText } = useHeroText()
  const [saving, setSaving] = useState(false)

  const [tagline, setTagline] = useState("")
  const [headingLine1, setHeadingLine1] = useState("")
  const [headingLine2, setHeadingLine2] = useState("")
  const [buttonText, setButtonText] = useState("")

  useEffect(() => {
    if (heroText) {
      setTagline(heroText.tagline)
      setHeadingLine1(heroText.heading_line1)
      setHeadingLine2(heroText.heading_line2)
      setButtonText(heroText.button_text)
    }
  }, [heroText])

  const handleSave = async () => {
    if (!tagline.trim() || !headingLine1.trim() || !headingLine2.trim() || !buttonText.trim()) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const { success, data, error } = await updateHeroText({
        tagline: tagline.trim(),
        heading_line1: headingLine1.trim(),
        heading_line2: headingLine2.trim(),
        button_text: buttonText.trim(),
      })

      if (success && data) {
        setHeroText(data)
        toast({
          title: "수정 완료",
          description: "메인 문구가 성공적으로 수정되었습니다.",
        })
      } else {
        toast({
          title: "수정 실패",
          description: error || "메인 문구 수정 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Hero text save error:", error)
      toast({
        title: "오류 발생",
        description: "수정 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>메인 비주얼 문구</CardTitle>
          <CardDescription>
            메인 페이지 히어로 섹션에 표시되는 텍스트를 수정합니다.
            {heroText?.updated_at && (
              <span className="ml-2 text-xs text-muted-foreground">
                마지막 수정: {new Date(heroText.updated_at).toLocaleString("ko-KR")}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tagline">소제목 (태그라인)</Label>
              <Input
                id="tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="당신만의 힐링"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonText">예약 버튼 텍스트</Label>
              <Input
                id="buttonText"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="지금 예약하기"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headingLine1">메인 제목 1번째 줄</Label>
              <Input
                id="headingLine1"
                value={headingLine1}
                onChange={(e) => setHeadingLine1(e.target.value)}
                placeholder="SE Club에서 누리는"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headingLine2">메인 제목 2번째 줄</Label>
              <Input
                id="headingLine2"
                value={headingLine2}
                onChange={(e) => setHeadingLine2(e.target.value)}
                placeholder="완벽한 휴식"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "저장 중..." : "저장"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 실시간 미리보기 */}
      <Card>
        <CardHeader>
          <CardTitle>미리보기</CardTitle>
          <CardDescription>실제 메인 페이지에 표시되는 모습입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full aspect-[16/7] rounded-lg overflow-hidden bg-gray-900">
            <div
              className="absolute inset-0 opacity-60"
              style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 flex flex-col items-start justify-center h-full pl-8 md:pl-16 text-white">
              <p className="text-xs md:text-sm mb-1 font-medium opacity-90">
                {tagline || "소제목"}
              </p>
              <h1 className="text-lg md:text-3xl font-medium leading-tight">
                <span className="font-thin">{headingLine1 || "메인 제목 1줄"}</span>
                <br />
                {headingLine2 || "메인 제목 2줄"}
              </h1>
              <div className="mt-3 md:mt-4 border border-white px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm flex items-center gap-1 rounded-xs bg-white text-gray-900">
                {buttonText || "버튼 텍스트"} <ChevronRight className="h-3 w-3 md:h-4 md:w-4" strokeWidth={1} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
