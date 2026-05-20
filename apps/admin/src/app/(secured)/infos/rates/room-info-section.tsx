"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@seclub/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@seclub/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@seclub/ui/dialog"
import { Input } from "@seclub/ui/input"
import { Label } from "@seclub/ui/label"
import { Textarea } from "@seclub/ui/textarea"
import { Button } from "@seclub/ui/button"
import { Switch } from "@seclub/ui/switch"
import { useToast } from "@seclub/ui/use-toast"
import { getRoomInfos, updateRoomInfo } from "@/lib/action/rooms"
import type { RoomInfo } from "@/types/rooms"
import { FileEdit, Plus, Trash2 } from "lucide-react"

export function RoomInfoSection() {
  const { toast } = useToast()
  const [rooms, setRooms] = useState<RoomInfo[]>([])
  const [editingRoom, setEditingRoom] = useState<RoomInfo | null>(null)
  const [formData, setFormData] = useState<RoomInfo["data"] | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await getRoomInfos()
      if (error) toast({ title: "오류", description: error, variant: "destructive" })
      if (data) setRooms(data)
    }
    fetch()
  }, [])

  const openEdit = (room: RoomInfo) => {
    setEditingRoom(room)
    setFormData(JSON.parse(JSON.stringify(room.data)))
  }

  const handleToggleActive = async (room: RoomInfo) => {
    const newActive = !room.is_active
    setRooms(rooms.map(r => r.slug === room.slug ? { ...r, is_active: newActive } : r))
    const { success } = await updateRoomInfo(room.slug, { is_active: newActive })
    if (success) {
      toast({ title: newActive ? "활성화" : "비활성화", description: `"${room.data.name}" 객실이 ${newActive ? "활성화" : "비활성화"}되었습니다.` })
    } else {
      setRooms(rooms.map(r => r.slug === room.slug ? { ...r, is_active: room.is_active } : r))
      toast({ title: "오류", description: "상태 변경 실패", variant: "destructive" })
    }
  }

  const handleSave = async () => {
    if (!editingRoom || !formData) return
    setSaving(true)
    const { success, error } = await updateRoomInfo(editingRoom.slug, { data: formData })
    if (success) {
      setRooms(rooms.map(r => r.slug === editingRoom.slug ? { ...r, data: formData } : r))
      toast({ title: "저장 완료", description: "객실 정보가 수정되었습니다." })
      setEditingRoom(null)
    } else {
      toast({ title: "저장 실패", description: error || "오류가 발생했습니다.", variant: "destructive" })
    }
    setSaving(false)
  }

  const updateAdditionalInfo = (index: number, field: "title" | "items", value: string | string[]) => {
    if (!formData) return
    const updated = [...formData.additionalInfo]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, additionalInfo: updated })
  }

  const addAdditionalInfo = () => {
    if (!formData) return
    setFormData({ ...formData, additionalInfo: [...formData.additionalInfo, { title: "", items: [""] }] })
  }

  const removeAdditionalInfo = (index: number) => {
    if (!formData) return
    setFormData({ ...formData, additionalInfo: formData.additionalInfo.filter((_, i) => i !== index) })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>객실 목록</CardTitle>
          <CardDescription>등록된 객실의 기본 정보를 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slug</TableHead>
                <TableHead>객실명</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map(room => (
                <TableRow key={room.slug}>
                  <TableCell className="font-mono text-sm">{room.slug}</TableCell>
                  <TableCell className="font-medium">{room.data.name}</TableCell>
                  <TableCell>
                    <Switch checked={room.is_active} onCheckedChange={() => handleToggleActive(room)} />
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(room)}>
                      <FileEdit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingRoom} onOpenChange={() => setEditingRoom(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>객실 정보 수정 — {formData?.name}</DialogTitle>
          </DialogHeader>
          {formData && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>객실명</Label>
                  <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>제목</Label>
                  <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>부제목</Label>
                <Input value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>소개 (Overview)</Label>
                <Textarea rows={4} value={formData.overview} onChange={e => setFormData({ ...formData, overview: e.target.value })} />
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">부가 정보</Label>
                  <Button size="sm" variant="outline" onClick={addAdditionalInfo}>
                    <Plus className="h-3 w-3 mr-1" /> 섹션 추가
                  </Button>
                </div>
                {formData.additionalInfo.map((info, i) => (
                  <Card key={i}>
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Input placeholder="섹션 제목" value={info.title} onChange={e => updateAdditionalInfo(i, "title", e.target.value)} />
                        <Button size="icon" variant="destructive" className="shrink-0 h-8 w-8" onClick={() => removeAdditionalInfo(i)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      {info.items.map((item, j) => (
                        <div key={j} className="flex items-center gap-2 pl-4">
                          <Input
                            value={item}
                            onChange={e => {
                              const newItems = [...info.items]
                              newItems[j] = e.target.value
                              updateAdditionalInfo(i, "items", newItems)
                            }}
                          />
                          <Button
                            size="icon" variant="ghost" className="shrink-0 h-8 w-8 text-red-500"
                            onClick={() => updateAdditionalInfo(i, "items", info.items.filter((_, k) => k !== j))}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button size="sm" variant="ghost" className="ml-4" onClick={() => updateAdditionalInfo(i, "items", [...info.items, ""])}>
                        <Plus className="h-3 w-3 mr-1" /> 항목 추가
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditingRoom(null)}>취소</Button>
                <Button onClick={handleSave} disabled={saving}>{saving ? "저장 중..." : "저장"}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
