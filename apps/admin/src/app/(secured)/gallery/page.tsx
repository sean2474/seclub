"use client"

import { useState, type ChangeEvent, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, PlusCircle, Upload, Trash2 } from "lucide-react"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

// Import gallery actions
import {
  fetchGalleryImages,
  uploadGalleryImages,
  deleteGalleryImage,
  deleteGalleryImages,
  type GalleryItem
} from "@/lib/action/gallery"

export default function GalleryPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const newItemsRef = useRef<GalleryItem[]>([])
  
  // Fetch images from Supabase storage when component mounts
  useEffect(() => {
    async function loadGalleryImages() {
      try {
        setIsLoading(true)
        const { items, error } = await fetchGalleryImages()
        
        if (error) {
          throw error
        }
        
        setItems(items)
      } catch (error) {
        console.error('Error fetching gallery images:', error)
        toast({
          title: '이미지 로드 오류',
          description: '갤러리 이미지를 불러오는 중 오류가 발생했습니다.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadGalleryImages()
  }, [])

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const readFileAsDataURL = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    }

    try {
      const newItemsPromises = Array.from(files).map(async (file) => {
        const previewUrl = await readFileAsDataURL(file)
        const newItem: GalleryItem = {
          id: `g${Date.now()}-${Math.random()}`,
          title: file.name,
          date: new Date().toISOString().split("T")[0],
          file: file,
          previewUrl: previewUrl,
        }
        return newItem
      })

      newItemsRef.current = await Promise.all(newItemsPromises)
      setUploadProgress(0)
    } catch (error) {
      console.error("Error reading files:", error)
      toast({
        title: "파일 읽기 오류",
        description: "파일을 읽는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      e.target.value = ""
    }
  }

  useEffect(() => {
    if (uploadProgress === null) return

    if (uploadProgress >= 100) {
      // Upload to Supabase storage
      const handleUpload = async () => {
        try {
          // Format the items for upload
          const itemsToUpload = newItemsRef.current.map(item => ({
            id: item.id,
            title: item.title,
            date: item.date,
            file: item.file as File
          }))
          
          // Upload using action function
          const { uploadedItems, error } = await uploadGalleryImages(itemsToUpload)
          
          if (error) throw error
          
          // Update UI with the new images
          setItems((prev) => [...uploadedItems, ...prev])
          toast({
            title: "업로드 완료",
            description: `${uploadedItems.length}개 이미지가 추가되었습니다.`,
          })
        } catch (error) {
          console.error('Error uploading images:', error)
          toast({
            title: "업로드 오류",
            description: "이미지 업로드 중 오류가 발생했습니다.",
            variant: "destructive",
          })
        } finally {
          setUploadProgress(null)
          newItemsRef.current = []
        }
      }
      
      handleUpload()
      return
    }

    const timer = setTimeout(() => {
      setUploadProgress((p) => (p !== null ? p + 20 : 0))
    }, 200)

    return () => clearTimeout(timer)
  }, [uploadProgress, toast])

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    setSelectedIds(checked ? items.map((item) => item.id) : [])
  }

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)))
  }

  const handleDelete = async () => {
    if (deletingId) {
      try {
        const itemToDelete = items.find(item => item.id === deletingId)
        if (!itemToDelete || !itemToDelete.path) {
          throw new Error('삭제할 항목을 찾을 수 없습니다.')
        }
        
        // Delete using action function
        const { success, error } = await deleteGalleryImage(itemToDelete.path)
          
        if (error) throw error
        if (!success) throw new Error('삭제 중 오류가 발생했습니다.')
        
        // Update local state
        setItems((prev) => prev.filter((item) => item.id !== deletingId))
        toast({ title: "삭제 완료", description: "이미지가 삭제되었습니다." })
      } catch (error) {
        console.error('Error deleting image:', error)
        toast({
          title: "삭제 오류",
          description: "이미지를 삭제하는 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      } finally {
        setDeletingId(null)
      }
    }
  }

  const handleBulkDelete = async () => {
    if (isBulkDeleting && selectedIds.length > 0) {
      try {
        // Get paths for all selected items
        const itemsToDelete = items
          .filter(item => selectedIds.includes(item.id))
          .map(item => item.path)
          .filter(Boolean) as string[]
        
        if (itemsToDelete.length === 0) {
          throw new Error('선택된 이미지가 없습니다.')
        }
        
        // Delete using action function
        const { success, error } = await deleteGalleryImages(itemsToDelete)
          
        if (error) throw error
        if (!success) throw new Error('삭제 중 오류가 발생했습니다.')
        
        // Update local state
        setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
        toast({ title: "일괄 삭제 완료", description: `${selectedIds.length}개 이미지가 삭제되었습니다.` })
        setSelectedIds([])
      } catch (error) {
        console.error('Error bulk deleting images:', error)
        toast({
          title: "일괄 삭제 오류",
          description: "이미지를 삭제하는 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsBulkDeleting(false)
      }
    } else {
      setIsBulkDeleting(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">갤러리 관리</h1>
          <div className="ml-auto">
            <Button onClick={() => document.getElementById("file-upload")?.click()}>
              <PlusCircle className="mr-2 h-4 w-4" /> 새 이미지 추가
            </Button>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              multiple
            />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>이미지 업로드</CardTitle>
            <CardDescription>이미지를 드래그 앤 드롭하거나 파일을 선택하여 업로드하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                </p>
                <p className="text-xs text-muted-foreground">SVG, PNG, JPG, GIF</p>
              </div>
            </label>
            {uploadProgress !== null && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-center mt-2 text-muted-foreground">업로드 중... {uploadProgress}%</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>이미지 목록</CardTitle>
              <CardDescription>
                {selectedIds.length > 0
                  ? `${selectedIds.length}개 이미지 선택됨`
                  : `${items.length}개의 이미지가 있습니다.`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={
                    selectedIds.length === items.length && items.length > 0
                      ? true
                      : selectedIds.length > 0
                        ? "indeterminate"
                        : false
                  }
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all">전체 선택</Label>
              </div>
              <div className="flex items-center gap-2 border-l pl-4">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setIsBulkDeleting(true)}
                  disabled={selectedIds.length === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  선택 삭제
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-12">
                  <p className="text-muted-foreground">이미지를 불러오는 중입니다...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="col-span-full flex justify-center py-12">
                  <p className="text-muted-foreground">갤러리에 이미지가 없습니다. 새 이미지를 추가하세요.</p>
                </div>
              ) : items.map((item) => (
                <div key={item.id} className="relative group aspect-square">
                  <Image
                    src={item.previewUrl || `/placeholder.svg?width=200&height=200&query=${item.title}`}
                    alt={item.title}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full rounded-lg"
                  />
                  <div
                    onClick={() => handleSelect(item.id, !selectedIds.includes(item.id))}
                    className={cn(
                      "absolute inset-0 rounded-lg transition-all cursor-pointer",
                      selectedIds.includes(item.id) ? "ring-2 ring-primary ring-offset-2" : "group-hover:bg-black/20",
                    )}
                  />
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={(checked) => handleSelect(item.id, !!checked)}
                    className="absolute top-3 left-3 h-5 w-5 bg-background/80 data-[state=checked]:bg-primary"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>작업</DropdownMenuLabel>
                        <DropdownMenuItem className="text-red-600" onClick={() => setDeletingId(item.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/70 to-transparent rounded-b-lg">
                    <div className="flex items-center justify-end w-full">
                      <p className="text-xs text-white/90 font-medium">{item.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 이미지가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isBulkDeleting} onOpenChange={setIsBulkDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 {selectedIds.length}개의 이미지를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 선택된 이미지들이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
