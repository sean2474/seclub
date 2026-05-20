import type { AccommodationType } from "./index";

export interface FavoriteItem {
  id: string;
  accommodationType: AccommodationType;
  accommodationId: string;
  name: string;
  category: string;
  image: string;
  price: number;
  addedAt: string;
}
