"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getWellnessPrograms, upsertWellnessProgram, type WellnessProgram } from "@/lib/action/wellness"
import { Save, Plus, Trash2, ChevronDown } from "lucide-react"

export default function WellnessManagement() {
  const { toast } = useToast()
  const [programs, setPrograms] = useState<WellnessProgram[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [formData, setFormData] = useState<WellnessProgram | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await getWellnessPrograms()
      if (error) toast({ title: "오류", description: error, variant: "destructive" })
      if (data) setPrograms(data)
    }
    fetch()
  }, [])

  const selectProgram = (slug: string) => {
    const program = programs.find(p => p.slug === slug)
    if (program) {
      setSelectedSlug(slug)
      setFormData(JSON.parse(JSON.stringify(program)))
    }
  }

  const handleSave = async () => {
    if (!formData) return
    setSaving(true)
    const { success, error } = await upsertWellnessProgram(formData)
    if (success) {
      setPrograms(programs.map(p => p.slug === formData.slug ? formData : p))
      toast({ title: "저장 완료", description: "프로그램 정보가 수정되었습니다." })
    } else {
      toast({ title: "저장 실패", description: error || "오류가 발생했습니다.", variant: "destructive" })
    }
    setSaving(false)
  }

  const updateContent = (index: number, value: string) => {
    if (!formData) return
    const newContents = [...formData.contents]
    newContents[index] = value
    setFormData({ ...formData, contents: newContents })
  }

  const addContent = () => {
    if (!formData) return
    setFormData({ ...formData, contents: [...formData.contents, ""] })
  }

  const removeContent = (index: number) => {
    if (!formData) return
    setFormData({ ...formData, contents: formData.contents.filter((_, i) => i !== index) })
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">자연 체험 / 웰니스 관리</h1>

      {/* 프로그램 선택 */}
      <Card>
        <CardHeader>
          <CardTitle>프로그램 목록</CardTitle>
          <CardDescription>수정할 프로그램을 선택하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          {programs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">등록된 프로그램이 없습니다.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {programs.map(p => (
                <Button
                  key={p.slug}
                  variant={selectedSlug === p.slug ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => selectProgram(p.slug)}
                >
                  {p.header.title}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 편집 폼 */}
      {formData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{formData.header.title} 편집</CardTitle>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "저장 중..." : "저장"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 헤더 정보 */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">헤더 정보</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>제목</Label>
                  <Input value={formData.header.title} onChange={e => setFormData({ ...formData, header: { ...formData.header, title: e.target.value } })} />
                </div>
                <div className="space-y-2">
                  <Label>유형</Label>
                  <Input value={formData.header.type} onChange={e => setFormData({ ...formData, header: { ...formData.header, type: e.target.value } })} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>부제목</Label>
                  <Input value={formData.header.subtitle} onChange={e => setFormData({ ...formData, header: { ...formData.header, subtitle: e.target.value } })} />
                </div>
                <div className="space-y-2">
                  <Label>위치</Label>
                  <Input value={formData.header.location} onChange={e => setFormData({ ...formData, header: { ...formData.header, location: e.target.value } })} />
                </div>
                <div className="space-y-2">
                  <Label>운영 시간</Label>
                  <Input value={formData.header.hours} onChange={e => setFormData({ ...formData, header: { ...formData.header, hours: e.target.value } })} />
                </div>
              </div>
            </div>

            {/* 내용 항목 */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">내용 항목</Label>
                <Button size="sm" variant="outline" onClick={addContent}>
                  <Plus className="h-3 w-3 mr-1" /> 항목 추가
                </Button>
              </div>
              {formData.contents.map((content, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-sm text-muted-foreground mt-2.5 w-6 shrink-0">{i + 1}.</span>
                  <Input value={content} onChange={e => updateContent(i, e.target.value)} />
                  <Button size="icon" variant="ghost" className="shrink-0 h-8 w-8 text-red-500 mt-0.5" onClick={() => removeContent(i)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
