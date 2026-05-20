import { createClient } from "@seclub/supabase/server";
import { RoomData, RoomInfo, RoomCardProps } from "@/types";
import { getIcon } from "./icon-map";
import { parseOverview } from "./parse-highlight";

function parseRoomData(slug: string, raw: unknown): RoomData | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.title !== "string" || typeof r.subtitle !== "string") {
    console.warn(`room_infos.data for slug "${slug}" is missing required fields`);
    return null;
  }
  return {
    slug,
    name: typeof r.name === "string" ? r.name : "",
    title: r.title,
    subtitle: r.subtitle,
    heroImage: typeof r.heroImage === "string" ? r.heroImage : "",
    mainImages: Array.isArray(r.mainImages) ? r.mainImages.filter((v): v is string => typeof v === "string") : [],
    overview: typeof r.overview === "string" ? r.overview : "",
    amenities: Array.isArray(r.amenities) ? (r.amenities as RoomData["amenities"]) : [],
    features: Array.isArray(r.features) ? (r.features as RoomData["features"]) : [],
    additionalInfo: Array.isArray(r.additionalInfo) ? (r.additionalInfo as RoomData["additionalInfo"]) : [],
  };
}

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

  const parsed = parseRoomData(data.slug, data.data);
  return parsed ? transformRoomData(data.slug, parsed) : null;
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

  return data
    .map((room) => {
      const parsed = parseRoomData(room.slug, room.data);
      return parsed ? transformRoomData(room.slug, parsed) : null;
    })
    .filter((r): r is RoomInfo => r !== null);
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
