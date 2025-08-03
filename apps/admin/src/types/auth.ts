export type Role = "admin" | "user" | "gallery_manager" | "reservation_manager"

export interface Profile {
  created_at: string
  id: string
  image_path?: string
  name?: string
  role: Role
  updated_at: string
}