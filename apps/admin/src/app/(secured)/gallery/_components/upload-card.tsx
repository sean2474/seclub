"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@seclub/ui/card"
import { Progress } from "@seclub/ui/progress"
import { Upload } from "lucide-react"

export function UploadCard({
  uploadProgress,
  inputId = "file-upload",
}: {
  uploadProgress: number | null
  inputId?: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>이미지 업로드</CardTitle>
        <CardDescription>이미지를 드래그 앤 드롭하거나 파일을 선택하여 업로드하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <label
          htmlFor={inputId}
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
            <p className="text-sm text-center mt-2 text-muted-foreground">
              업로드 중... {uploadProgress}%
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
