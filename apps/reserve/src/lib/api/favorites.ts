import type { AccommodationType, FavoriteItem } from "@/types";

// 목업 데이터
const mockFavorites: FavoriteItem[] = [
  {
    id: "fav-001",
    accommodationType: "room",
    accommodationId: "ocean-pool-villa",
    name: "해수풀빌라",
    category: "풀빌라",
    image: "/placeholder.svg?height=400&width=600",
    price: 990000,
    addedAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "fav-002",
    accommodationType: "room",
    accommodationId: "condo-standard",
    name: "콘도 스탠다드",
    category: "콘도",
    image: "/placeholder.svg?height=400&width=600",
    price: 150000,
    addedAt: "2026-02-15T14:30:00.000Z",
  },
  {
    id: "fav-003",
    accommodationType: "site",
    accommodationId: "l-site",
    name: "L사이트 (대형)",
    category: "캠핑장",
    image: "/placeholder.svg?height=400&width=600",
    price: 100000,
    addedAt: "2026-02-20T09:00:00.000Z",
  },
  {
    id: "fav-004",
    accommodationType: "room",
    accommodationId: "camping-house",
    name: "캠핑하우스",
    category: "캠핑하우스",
    image: "/placeholder.svg?height=400&width=600",
    price: 120000,
    addedAt: "2026-03-05T16:00:00.000Z",
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 즐겨찾기 목록 조회
 */
export async function getMyFavorites(userId: string): Promise<FavoriteItem[]> {
  await delay(300);
  return mockFavorites;
}

/**
 * 즐겨찾기 추가
 */
export async function addFavorite(
  userId: string,
  accommodationType: AccommodationType,
  accommodationId: string
): Promise<{ success: boolean; error?: string }> {
  await delay(200);
  
  const exists = mockFavorites.some(
    (f) => f.accommodationType === accommodationType && f.accommodationId === accommodationId
  );
  
  if (exists) {
    return { success: false, error: "이미 즐겨찾기에 추가되어 있습니다." };
  }
  
  // 실제로는 DB에 추가
  return { success: true };
}

/**
 * 즐겨찾기 삭제
 */
export async function removeFavorite(
  userId: string,
  favoriteId: string
): Promise<{ success: boolean; error?: string }> {
  await delay(200);
  
  const index = mockFavorites.findIndex((f) => f.id === favoriteId);
  
  if (index === -1) {
    return { success: false, error: "즐겨찾기를 찾을 수 없습니다." };
  }
  
  // 실제로는 DB에서 삭제
  mockFavorites.splice(index, 1);
  return { success: true };
}

/**
 * 즐겨찾기 여부 확인
 */
export async function isFavorite(
  userId: string,
  accommodationType: AccommodationType,
  accommodationId: string
): Promise<boolean> {
  await delay(100);
  return mockFavorites.some(
    (f) => f.accommodationType === accommodationType && f.accommodationId === accommodationId
  );
}
