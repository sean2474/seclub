import { Metadata } from "next"

export const generateMetadata = (title: string, description: string): () => Promise<Metadata> => {
  return () => Promise.resolve({
    title,
    description,
  })
}