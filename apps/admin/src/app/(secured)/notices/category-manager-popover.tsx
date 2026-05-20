"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@seclub/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@seclub/ui/tabs"
import { Input } from "@seclub/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@seclub/ui/select"
import { Button } from "@seclub/ui/button"
import { useToast } from "@seclub/ui/use-toast"
import { PlusCircle, Trash2Icon } from "lucide-react"
import { addCategory, updateCategory, deleteCategory } from "@/lib/action/category"

interface CategoryManagerPopoverProps {
  categories: string[]
  setCategories: React.Dispatch<React.SetStateAction<string[]>>
  /** Currently selected category in the parent form (so we can keep it in sync on rename/delete). */
  currentCategory: string
  onCategoryChange: (next: string) => void
}

export function CategoryManagerPopover({
  categories,
  setCategories,
  currentCategory,
  onCategoryChange,
}: CategoryManagerPopoverProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState("add")
  const [newCategory, setNewCategory] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [editCategoryName, setEditCategoryName] = useState("")

  const handleAdd = async () => {
    if (!newCategory.trim()) {
      toast({ title: "❌ 오류 발생", description: "카테고리명을 입력해주세요.", variant: "destructive" })
      return
    }
    const { success, data, error } = await addCategory(newCategory.trim())
    if (success && data) {
      setCategories([...categories, data])
      onCategoryChange(data)
      setNewCategory("")
      setOpen(false)
      toast({ title: "✅ 카테고리 추가 완료", description: `'${data}' 카테고리가 추가되었습니다.` })
    } else {
      toast({
        title: "❌ 카테고리 추가 실패",
        description: error || "카테고리 추가 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async () => {
    if (!selectedCategory || !editCategoryName.trim()) {
      toast({
        title: "❌ 오류 발생",
        description: "수정할 카테고리와 새 이름을 입력해주세요.",
        variant: "destructive",
      })
      return
    }
    const { success, data, error } = await updateCategory(selectedCategory, editCategoryName.trim())
    if (success && data) {
      setCategories(categories.map((c) => (c === selectedCategory ? data : c)))
      if (currentCategory === selectedCategory) onCategoryChange(data)
      setEditCategoryName("")
      setSelectedCategory("")
      setOpen(false)
      toast({
        title: "✅ 카테고리 수정 완료",
        description: `'${selectedCategory}'에서 '${data}'로 수정되었습니다.`,
      })
    } else {
      toast({
        title: "❌ 카테고리 수정 실패",
        description: error || "카테고리 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!selectedCategory) {
      toast({ title: "❌ 오류 발생", description: "삭제할 카테고리를 선택해주세요.", variant: "destructive" })
      return
    }
    const { success, error } = await deleteCategory(selectedCategory)
    if (success) {
      setCategories(categories.filter((c) => c !== selectedCategory))
      if (currentCategory === selectedCategory) onCategoryChange("")
      setSelectedCategory("")
      setOpen(false)
      toast({
        title: "✅ 카테고리 삭제 완료",
        description: `'${selectedCategory}' 카테고리가 삭제되었습니다.`,
      })
    } else {
      toast({
        title: "❌ 카테고리 삭제 실패",
        description: error || "카테고리 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2">
          <PlusCircle className="h-4 w-4 mr-1" /> 카테고리 관리
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="add">추가</TabsTrigger>
            <TabsTrigger value="edit">수정</TabsTrigger>
            <TabsTrigger value="delete">삭제</TabsTrigger>
          </TabsList>
          <TabsContent value="add" className="mt-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">새 카테고리 추가</h4>
              <p className="text-sm text-muted-foreground">추가할 카테고리명을 입력하세요.</p>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="카테고리명"
                  className="col-span-2 h-8"
                />
                <Button onClick={handleAdd} size="sm" className="px-3">
                  추가
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="edit" className="mt-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">카테고리 수정</h4>
              <p className="text-sm text-muted-foreground">
                수정할 카테고리를 선택하고 새 이름을 입력하세요.
              </p>
              <div className="space-y-2 mt-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="수정할 카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Input
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    placeholder="새 카테고리명"
                    className="h-8"
                  />
                  <Button onClick={handleEdit} size="sm" className="px-3">
                    수정
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="delete" className="mt-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">카테고리 삭제</h4>
              <p className="text-sm text-muted-foreground">
                삭제할 카테고리를 선택하세요.
                <span className="text-destructive font-semibold">
                  해당 카테고리의 공지가 없어야 삭제 가능합니다.
                </span>
              </p>
              <div className="flex gap-2 mt-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="삭제할 카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleDelete} size="sm" variant="destructive" className="px-3">
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
