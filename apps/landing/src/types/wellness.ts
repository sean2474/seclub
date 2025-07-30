export interface WellnessPageHeader {
  title: string
  subtitle: string
  type: string
  location: string
  hours: string
  image: string
}
export interface WellnessPageData {
  header: WellnessPageHeader
  contents: string[]
  images: string[]
}

export interface WellnessCardProps {
  slug: string;
  title: string;
  type: string;
  location: string;
  hours: string;
  image: string;
}