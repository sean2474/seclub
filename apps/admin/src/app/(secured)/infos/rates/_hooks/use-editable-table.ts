"use client"

import { useEffect, useState } from "react"
import { toast } from "@seclub/ui/use-toast"

interface UseEditableTableOptions<TRow extends { id: TId }, TPatch, TId = number> {
  fetch: () => Promise<{ data: TRow[] | null; error: string | null }>
  update: (id: TId, patch: TPatch) => Promise<{ success: boolean; error: string | null }>
  labels?: {
    fetchError?: string
    saveSuccess?: string
    saveFailure?: string
  }
}

/**
 * Shared CRUD lifecycle for the admin "rates" tables.
 * Encapsulates fetch-on-mount + toast, optimistic merge on save, and editing
 * state so each section only owns its rendering.
 */
export function useEditableTable<TRow extends { id: TId }, TPatch, TId = number>(
  { fetch, update, labels }: UseEditableTableOptions<TRow, TPatch, TId>,
) {
  const [rows, setRows] = useState<TRow[]>([])
  const [editingId, setEditingId] = useState<TId | null>(null)
  const [editValues, setEditValues] = useState<Partial<TPatch>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    fetch().then(({ data, error }) => {
      if (!active) return
      if (error) {
        toast({
          title: "오류",
          description: error || labels?.fetchError || "데이터를 불러오지 못했습니다.",
          variant: "destructive",
        })
      }
      if (data) setRows(data)
    })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startEdit = (id: TId, initial: Partial<TPatch>) => {
    setEditingId(id)
    setEditValues(initial)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValues({})
  }

  const save = async (id: TId) => {
    setSaving(true)
    const { success, error } = await update(id, editValues as TPatch)
    if (success) {
      setRows((prev) =>
        prev.map((r) => (r.id === id ? ({ ...r, ...(editValues as Partial<TRow>) } as TRow) : r)),
      )
      toast({
        title: "저장 완료",
        description: labels?.saveSuccess || "변경 사항이 저장되었습니다.",
      })
      setEditingId(null)
      setEditValues({})
    } else {
      toast({
        title: "저장 실패",
        description: error || labels?.saveFailure || "오류가 발생했습니다.",
        variant: "destructive",
      })
    }
    setSaving(false)
    return success
  }

  return {
    rows,
    setRows,
    editingId,
    editValues,
    setEditValues,
    saving,
    startEdit,
    cancelEdit,
    save,
  }
}
