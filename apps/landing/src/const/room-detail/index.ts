import { oceanCondoData } from "./ocean-condo-data";
import { poolVillaData } from "./pool-villa-data";
import { campingHouseData } from "./camping-house-data";
import { spaVillaData } from "./spa-villa-data";
import { oceanCondoExtendedData } from "./ocean-condo-extended-data";
import { premiumVillaData } from "./premium-villa-data";
import { RoomCardProps, RoomInfo } from "@/types";

export const roomDetailData: Record<string, RoomInfo> = {
  'pool-villa': poolVillaData,
  'ocean-condo': oceanCondoData,
  'ocean-condo-extended': oceanCondoExtendedData,
  'camping-house': campingHouseData,
  'spa-villa': spaVillaData,
  'premium-villa': premiumVillaData,
}

export const roomData: RoomCardProps[] = Object.entries(roomDetailData).map(([slug, data]) => ({
  slug,
  title: data.title,
  subtitle: data.subtitle,
  features: data.features,
  images: Array(data.heroImage).concat(data.mainImages),
}))