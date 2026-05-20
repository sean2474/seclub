"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@seclub/ui/card"
import { Input } from "@seclub/ui/input"
import { Label } from "@seclub/ui/label"
import { Textarea } from "@seclub/ui/textarea"
import { Button } from "@seclub/ui/button"
import { useToast } from "@seclub/ui/use-toast"
import { getCampingGuide, updateCampingGuide, type CampingGuideSection } from "@/lib/action/camping-guide"
import { Save, Plus, Trash2 } from "lucide-react"

export default function GuideManagement() {
  const { toast } = useToast()
  const [guideId, setGuideId] = useState<string | null>(null)
  const [sections, setSections] = useState<CampingGuideSection[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await getCampingGuide()
      if (error) toast({ title: "오류", description: error, variant: "destructive" })
      if (data) {
        setGuideId(data.id)
        setSections(data.sections)
      }
    }
    fetch()
  }, [])

  const handleSave = async () => {
    if (!guideId) return
    setSaving(true)
    const { success, error } = await updateCampingGuide(guideId, sections)
    if (success) {
      toast({ title: "저장 완료", description: "이용 가이드가 수정되었습니다." })
    } else {
      toast({ title: "저장 실패", description: error || "오류가 발생했습니다.", variant: "destructive" })
    }
    setSaving(false)
  }

  const updateSection = (index: number, updated: Partial<CampingGuideSection>) => {
    setSections(sections.map((s, i) => i === index ? { ...s, ...updated } : s))
  }

  const updateItem = (sectionIdx: number, itemIdx: number, value: string) => {
    const section = sections[sectionIdx]
    if (!section.items) return
    const newItems = [...section.items]
    const existing = newItems[itemIdx]
    if (typeof existing === "string") {
      newItems[itemIdx] = value
    } else {
      newItems[itemIdx] = { ...existing, value }
    }
    updateSection(sectionIdx, { items: newItems })
  }

  const addItem = (sectionIdx: number) => {
    const section = sections[sectionIdx]
    const items = section.items || []
    updateSection(sectionIdx, { items: [...items, ""] })
  }

  const removeItem = (sectionIdx: number, itemIdx: number) => {
    const section = sections[sectionIdx]
    if (!section.items) return
    updateSection(sectionIdx, { items: section.items.filter((_, i) => i !== itemIdx) })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">이용 가이드 관리</h1>
        <Button onClick={handleSave} disabled={saving || !guideId}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "저장 중..." : "전체 저장"}
        </Button>
      </div>

      {sections.map((section, sIdx) => (
        <Card key={section.key}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            <CardDescription>섹션 키: {section.key}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 단순 항목 리스트 */}
            {section.items && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">항목</Label>
                {section.items.map((item, iIdx) => (
                  <div key={iIdx} className="flex items-center gap-2">
                    {typeof item === "string" ? (
                      <Input
                        value={item}
                        onChange={e => updateItem(sIdx, iIdx, e.target.value)}
                      />
                    ) : (
                      <div className="flex gap-2 flex-1">
                        <Input
                          className="w-40 shrink-0"
                          value={item.label}
                          onChange={e => {
                            const newItems = [...section.items!]
                            newItems[iIdx] = { ...(newItems[iIdx] as { label: string; value: string }), label: e.target.value }
                            updateSection(sIdx, { items: newItems })
                          }}
                        />
                        <Input
                          value={item.value}
                          onChange={e => updateItem(sIdx, iIdx, e.target.value)}
                        />
                      </div>
                    )}
                    <Button size="icon" variant="ghost" className="shrink-0 h-8 w-8 text-red-500" onClick={() => removeItem(sIdx, iIdx)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={() => addItem(sIdx)}>
                  <Plus className="h-3 w-3 mr-1" /> 항목 추가
                </Button>
              </div>
            )}

            {/* 노트 */}
            {section.notes && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">비고</Label>
                {section.notes.map((note, nIdx) => (
                  <div key={nIdx} className="flex items-center gap-2">
                    <Input
                      value={note}
                      onChange={e => {
                        const newNotes = [...section.notes!]
                        newNotes[nIdx] = e.target.value
                        updateSection(sIdx, { notes: newNotes })
                      }}
                    />
                    <Button size="icon" variant="ghost" className="shrink-0 h-8 w-8 text-red-500" onClick={() => {
                      updateSection(sIdx, { notes: section.notes!.filter((_, i) => i !== nIdx) })
                    }}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* 하단 문구 */}
            {section.footer !== undefined && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">하단 문구</Label>
                <Input value={section.footer} onChange={e => updateSection(sIdx, { footer: e.target.value })} />
              </div>
            )}

            {/* 서브섹션 */}
            {section.subsections && section.subsections.map((sub, subIdx) => (
              <Card key={subIdx} className="bg-muted/20">
                <CardContent className="pt-4 space-y-2">
                  <Label className="font-medium">{sub.title}</Label>
                  {sub.content !== undefined && (
                    <Textarea
                      value={sub.content}
                      onChange={e => {
                        const newSubs = [...section.subsections!]
                        newSubs[subIdx] = { ...newSubs[subIdx], content: e.target.value }
                        updateSection(sIdx, { subsections: newSubs })
                      }}
                    />
                  )}
                  {sub.items && sub.items.map((item, iIdx) => (
                    <div key={iIdx} className="flex items-center gap-2">
                      {typeof item === "string" ? (
                        <Input
                          value={item}
                          onChange={e => {
                            const newSubs = [...section.subsections!]
                            const newItems = [...newSubs[subIdx].items!]
                            newItems[iIdx] = e.target.value
                            newSubs[subIdx] = { ...newSubs[subIdx], items: newItems }
                            updateSection(sIdx, { subsections: newSubs })
                          }}
                        />
                      ) : (
                        <div className="flex gap-2 flex-1">
                          <Input className="w-40 shrink-0" value={item.label} onChange={e => {
                            const newSubs = [...section.subsections!]
                            const newItems = [...newSubs[subIdx].items!] as { label: string; value: string }[]
                            newItems[iIdx] = { ...newItems[iIdx], label: e.target.value }
                            newSubs[subIdx] = { ...newSubs[subIdx], items: newItems }
                            updateSection(sIdx, { subsections: newSubs })
                          }} />
                          <Input value={item.value} onChange={e => {
                            const newSubs = [...section.subsections!]
                            const newItems = [...newSubs[subIdx].items!] as { label: string; value: string }[]
                            newItems[iIdx] = { ...newItems[iIdx], value: e.target.value }
                            newSubs[subIdx] = { ...newSubs[subIdx], items: newItems }
                            updateSection(sIdx, { subsections: newSubs })
                          }} />
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
