import { createClient } from "@seclub/supabase/server";
import { Discounts, LodgingRates } from "@/types/room-rate";

type RoomRateRow = {
  name: string;
  type: string;
  peak_rate: number;
  winter_rate: number;
  long_stay_discount: number | null;
};

async function fetchRoomRates(): Promise<RoomRateRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("room_rates")
    .select("name, type, peak_rate, winter_rate, long_stay_discount")
    .order("display_order");

  if (error || !data) {
    console.error("Room rates fetch error:", error);
    return [];
  }
  return data as RoomRateRow[];
}

function toLodgingRates(rows: RoomRateRow[]): LodgingRates {
  const result: LodgingRates = {};
  rows.forEach((row) => {
    result[row.name] = {
      rates: {
        "최성수기": row.peak_rate,
        "동절기": row.winter_rate,
      },
      longStayDiscount: row.long_stay_discount ?? undefined,
    };
  });
  return result;
}

// DB에서 숙박 요금 조회
export async function getLodgingRates(): Promise<LodgingRates> {
  const rows = await fetchRoomRates();
  return toLodgingRates(rows.filter((r) => r.type === "lodging"));
}

// DB에서 캠핑 요금 조회
export async function getCampingRates(): Promise<LodgingRates> {
  const rows = await fetchRoomRates();
  return toLodgingRates(rows.filter((r) => r.type === "camping"));
}

// DB에서 레이트체크아웃 요금 조회
export async function getLateCheckoutRates(): Promise<
  { name: string; "3시간": number; "6시간": number }[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("late_checkout_rates")
    .select("hours_3, hours_6, room_rates(name)");

  if (error || !data) {
    console.error("Late checkout rates fetch error:", error);
    return [];
  }

  return data
    .filter((row) => row.room_rates)
    .map((row) => ({
      name: (row.room_rates as unknown as { name: string }).name,
      "3시간": row.hours_3,
      "6시간": row.hours_6,
    }));
}

// DB에서 할인율 조회
export async function getDiscounts(): Promise<Discounts> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("discount_rates")
    .select("season, category, nights, discount_percent");

  if (error || !data) {
    console.error("Discount rates fetch error:", error);
    return {
      highSeason: { camping: {}, lodging: {} },
      winterSeason: {},
    };
  }

  const result: Discounts = {
    highSeason: { camping: {}, lodging: {} },
    winterSeason: {},
  };

  data.forEach((row) => {
    if (row.season === "highSeason") {
      if (row.category === "camping") {
        result.highSeason.camping[row.nights] = row.discount_percent;
      } else if (row.category === "lodging") {
        result.highSeason.lodging[row.nights] = row.discount_percent;
      }
    } else if (row.season === "winterSeason") {
      result.winterSeason[row.nights] = row.discount_percent;
    }
  });

  return result;
}

// 전체 요금 정보 한번에 조회
export async function getAllPricing() {
  const [roomRows, lateCheckoutRates, discounts] = await Promise.all([
    fetchRoomRates(),
    getLateCheckoutRates(),
    getDiscounts(),
  ]);

  return {
    lodgingRates: toLodgingRates(roomRows.filter((r) => r.type === "lodging")),
    campingRates: toLodgingRates(roomRows.filter((r) => r.type === "camping")),
    lateCheckoutRates,
    discounts,
  };
}
