
"use client"

import { useEffect, useState } from "react"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TiptapEditor } from "@/components/ui/tiptap-editor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCategories } from "@/hooks/use-category"
import { addCategory, updateCategory, deleteCategory } from "@/lib/action/category"
import { Notice } from "@/types/notices"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { PlusCircle, Trash2Icon } from "lucide-react"


export interface NoticeFormModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSave: (data: {
    title: string
    content: string
    active: boolean
    category: string
    pinned: boolean
    images?: string[]
  }) => void
  notice: Notice | null
}

export function NoticeFormModal({ isOpen, onOpenChange, onSave, notice }: NoticeFormModalProps) {
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [active, setActive] = useState<boolean>(true)
  const [pinned, setPinned] = useState<boolean>(false)
  const [category, setCategory] = useState<string>("")
  const [newCategory, setNewCategory] = useState<string>("") 
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false)
  const [editCategoryName, setEditCategoryName] = useState<string>("") 
  const [selectedCategory, setSelectedCategory] = useState<string>("") 
  const [categoryTab, setCategoryTab] = useState<string>("add")
  const { categories, setCategories } = useCategories()
  

  useEffect(() => {
    if (isOpen) {
      if (notice) {
        setTitle(notice.title)
        setContent(notice.content || "")
        setActive(notice.active)
        setPinned(notice.pinned || false)
        setCategory(notice.category)
      } else {
        setTitle("")
        setContent("")
        setActive(true)
        setPinned(false)
        setCategory("")
      }
    }
  }, [notice, isOpen])

  const isContentEmpty = (html: string) => {
    if (!html) return true
    const stripped = html
      .replace(/<br\s*\/?\s*>/gi, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/<[^>]+>/g, "")
      .trim()
    return stripped.length === 0
  }

  const handleSubmit = () => {
    if (title === "" || isContentEmpty(content) || category === "") {
      toast({
        title: "❌ 오류 발생",
        description: "카테고리, 제목, 내용은 필수입니다.",
        variant: "destructive"
      })
      return
    }
    onSave({ title, content, active, pinned, category })
  }
  
  const handleAddCategory = async () => {
    if (!newCategory || newCategory.trim() === "") {
      toast({
        title: "❌ 오류 발생",
        description: "카테고리명을 입력해주세요.",
        variant: "destructive"
      })
      return
    }
    
    try {
      const { success, data, error } = await addCategory(newCategory.trim())
      
      if (success && data) {
        // Update categories list
        setCategories([...categories, data])
        setCategory(data)  // Select the newly added category
        setNewCategory("") // Clear the input
        setIsAddingCategory(false) // Close popover
        
        toast({
          title: "✅ 카테고리 추가 완료",
          description: `'${data}' 카테고리가 추가되었습니다.`
        })
      } else {
        toast({
          title: "❌ 카테고리 추가 실패",
          description: error || "카테고리 추가 중 오류가 발생했습니다.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Category addition error:", error)
      toast({
        title: "❌ 오류 발생",
        description: "카테고리 추가 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }
  
  const handleEditCategory = async () => {
    if (!selectedCategory || !editCategoryName || editCategoryName.trim() === "") {
      toast({
        title: "❌ 오류 발생",
        description: "수정할 카테고리와 새 이름을 입력해주세요.",
        variant: "destructive"
      })
      return
    }
    
    try {
      const { success, data, error } = await updateCategory(selectedCategory, editCategoryName.trim())
      
      if (success && data) {
        // Update categories list
        const updatedCategories = categories.map(cat => cat === selectedCategory ? data : cat)
        setCategories(updatedCategories)
        
        // Update selected category if it was the one being edited
        if (category === selectedCategory) {
          setCategory(data)
        }
        
        setEditCategoryName("") // Clear the input
        setSelectedCategory("") // Clear selection
        setIsAddingCategory(false) // Close popover
        
        toast({
          title: "✅ 카테고리 수정 완료",
          description: `'${selectedCategory}'에서 '${data}'로 수정되었습니다.`
        })
      } else {
        toast({
          title: "❌ 카테고리 수정 실패",
          description: error || "카테고리 수정 중 오류가 발생했습니다.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Category update error:", error)
      toast({
        title: "❌ 오류 발생",
        description: "카테고리 수정 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }
  
  const handleDeleteCategory = async () => {
    if (!selectedCategory) {
      toast({
        title: "❌ 오류 발생",
        description: "삭제할 카테고리를 선택해주세요.",
        variant: "destructive"
      })
      return
    }
    
    try {
      const { success, error } = await deleteCategory(selectedCategory)
      
      if (success) {
        // Update categories list
        const updatedCategories = categories.filter(cat => cat !== selectedCategory)
        setCategories(updatedCategories)
        
        // If the deleted category was the selected one, reset it
        if (category === selectedCategory) {
          setCategory("")
        }
        
        setSelectedCategory("") // Clear selection
        setIsAddingCategory(false) // Close popover
        
        toast({
          title: "✅ 카테고리 삭제 완료",
          description: `'${selectedCategory}' 카테고리가 삭제되었습니다.`
        })
      } else {
        toast({
          title: "❌ 카테고리 삭제 실패",
          description: error || "카테고리 삭제 중 오류가 발생했습니다.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Category deletion error:", error)
      toast({
        title: "❌ 오류 발생",
        description: "카테고리 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{notice ? "공지 수정" : "새 공지 작성"}</DialogTitle>
          <DialogDescription>{notice ? "공지사항을 수정합니다." : "새로운 공지사항을 등록합니다."}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="write">작성</TabsTrigger>
            <TabsTrigger value="preview">미리보기</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="mt-4">
            <div className="border rounded-md p-6 min-h-[300px]">
              <div className="border-b border-foreground pb-4 mb-4">
                <p className="text-sm text-foreground/80 mb-1">{category || "(카테고리 미선택)"}</p>
                <h1 className="text-2xl font-bold text-foreground">
                  {pinned && (
                    <span className="text-xs bg-foreground text-background px-1.5 py-0.5 mr-2 align-middle">고정</span>
                  )}
                  {title || "(제목 없음)"}
                </h1>
                <div className="flex items-center gap-3 text-xs text-foreground/60 mt-2">
                  <span>상태: {active ? "게시 중" : "비게시"}</span>
                </div>
              </div>
              {content && content !== "<p></p>" ? (
                <div
                  className="prose max-w-none [&_img]:max-w-full [&_img]:h-auto"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <p className="text-sm text-muted-foreground italic">(내용이 비어있습니다)</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="write" className="mt-4">
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">제목</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>내용</Label>
            <TiptapEditor content={content} onChange={setContent} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="category">카테고리</Label>
                <Popover open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 px-2">
                      <PlusCircle className="h-4 w-4 mr-1" /> 카테고리 관리
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="end">
                    <Tabs defaultValue="add" value={categoryTab} onValueChange={setCategoryTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="add">추가</TabsTrigger>
                        <TabsTrigger value="edit">수정</TabsTrigger>
                        <TabsTrigger value="delete">삭제</TabsTrigger>
                      </TabsList>
                      <TabsContent value="add" className="mt-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">새 카테고리 추가</h4>
                          <p className="text-sm text-muted-foreground">
                            추가할 카테고리명을 입력하세요.
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Input
                              id="new-category"
                              value={newCategory}
                              onChange={(e) => setNewCategory(e.target.value)}
                              placeholder="카테고리명"
                              className="col-span-2 h-8"
                            />
                            <Button onClick={handleAddCategory} size="sm" className="px-3">
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
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                              <Input
                                id="edit-category"
                                value={editCategoryName}
                                onChange={(e) => setEditCategoryName(e.target.value)}
                                placeholder="새 카테고리명"
                                className="h-8"
                              />
                              <Button onClick={handleEditCategory} size="sm" className="px-3">
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
                            <span className="text-destructive font-semibold">해당 카테고리의 공지가 없어야 삭제 가능합니다.</span>
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                              <SelectTrigger>
                                <SelectValue placeholder="삭제할 카테고리 선택" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button 
                              onClick={handleDeleteCategory} 
                              size="sm" 
                              variant="destructive"
                              className="px-3"
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </PopoverContent>
                </Popover>
              </div>
              <Select value={category} onValueChange={(value: string) => setCategory(value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder={categories.length > 0 ? "카테고리 선택" : "먼저 '카테고리 관리'에서 카테고리를 추가하세요"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>게시 상태</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="status"
                  checked={active}
                  onCheckedChange={(checked) => setActive(checked)}
                />
                <Label htmlFor="status">{active ? "게시 중" : "비게시"}</Label>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <Switch
                  id="pinned"
                  checked={pinned}
                  onCheckedChange={(checked) => setPinned(checked)}
                />
                <Label htmlFor="pinned">{pinned ? "상단 고정" : "일반"}</Label>
              </div>
            </div>
          </div>
        </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
