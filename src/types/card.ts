export interface CardData {
  slug: string;
  title: string;
  image: string;
  description: string;
  items: {
    title: string;
    href: string;
  }[];
}