import { createClient } from "@seclub/supabase/server";
import { RoomData, RoomInfo, RoomCardProps } from "@/types";
import { getIcon } from "./icon-map";
import { parseOverview } from "./parse-highlight";

// DB에서 단일 객실 정보 조회
export async function getRoomBySlug(slug: string): Promise<RoomInfo | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("room_infos")
    .select("slug, data")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    console.error("Room fetch error:", error);
    return null;
  }

  return transformRoomData(data.slug, data.data as unknown as RoomData);
}

// DB에서 모든 객실 정보 조회
export async function getAllRooms(): Promise<RoomInfo[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("room_infos")
    .select("slug, data")
    .eq("is_active", true);

  if (error || !data) {
    console.error("Rooms fetch error:", error);
    return [];
  }

  return data.map((room) => transformRoomData(room.slug, room.data as unknown as RoomData));
}

// 카드 목록용 데이터 조회
export async function getRoomCards(): Promise<RoomCardProps[]> {
  const rooms = await getAllRooms();
  
  return rooms.map((room) => ({
    slug: room.slug,
    title: room.title,
    subtitle: room.subtitle,
    features: room.features,
    images: [room.heroImage, ...room.mainImages],
  }));
}

// DB 데이터를 렌더링용 RoomInfo로 변환
function transformRoomData(slug: string, data: RoomData): RoomInfo {
  return {
    slug,
    name: data.name,
    title: data.title,
    subtitle: data.subtitle,
    heroImage: data.heroImage,
    mainImages: data.mainImages,
    overview: parseOverview(data.overview),
    amenities: data.amenities,
    features: data.features.map((f) => ({
      icon: getIcon(f.icon),
      label: f.label,
      value: f.value,
    })),
    additionalInfo: data.additionalInfo,
  };
}
