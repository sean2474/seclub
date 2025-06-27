import { RoomType } from "@/types";
import { CampingHouse, OceanCondo, PoolVilla, SpaVilla } from "./rooms";

export const RoomDetail = ({roomType}: {roomType: RoomType}) => {
  switch (roomType) {
    case "pool-villa":
      return <PoolVilla />;
    case "ocean-condo":
      return <OceanCondo />;
    case "spa-villa":
      return <SpaVilla />;
    case "camping-house":
      return <CampingHouse />;
    default:
      return <div>Room Type Not Found</div>;
  }
}

