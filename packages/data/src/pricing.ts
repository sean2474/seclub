import { createClient } from "@seclub/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@seclub/supabase/types";

type PricingClient = SupabaseClient<Database>;

type RoomRateRow = {
  name: string
  type: string
  peak_rate: number
  winter_rate: number
  long_stay_discount: number | null
}

export interface RatesByName {
  [name: string]: {
    rates: { 최성수기: number; 동절기: number }
    longStayDiscount?: number
  }
}

export interface LateCheckoutRate {
  name: string
  "3시간": number
  "6시간": number
}

export interface Discounts {
  highSeason: {
    camping: Record<string, number>
    lodging: Record<string, number>
  }
  winterSeason: Record<string, number>
}

async function fetchRoomRateRows(client?: PricingClient): Promise<RoomRateRow[]> {
  const supabase = client ?? (await createClient())
  const { data, error } = await supabase
    .from("room_rates")
    .select("name, type, peak_rate, winter_rate, long_stay_discount")
    .order("display_order")

  if (error || !data) {
    console.error("Room rates fetch error:", error)
    return []
  }
  return data as RoomRateRow[]
}

function rowsToRatesByName(rows: RoomRateRow[]): RatesByName {
  const result: RatesByName = {}
  rows.forEach((row) => {
    result[row.name] = {
      rates: { 최성수기: row.peak_rate, 동절기: row.winter_rate },
      longStayDiscount: row.long_stay_discount ?? undefined,
    }
  })
  return result
}

export async function fetchLodgingRates(client?: PricingClient): Promise<RatesByName> {
  const rows = await fetchRoomRateRows(client)
  return rowsToRatesByName(rows.filter((r) => r.type === "lodging"))
}

export async function fetchCampingRates(client?: PricingClient): Promise<RatesByName> {
  const rows = await fetchRoomRateRows(client)
  return rowsToRatesByName(rows.filter((r) => r.type === "camping"))
}

export async function fetchLateCheckoutRates(client?: PricingClient): Promise<LateCheckoutRate[]> {
  const supabase = client ?? (await createClient())
  const { data, error } = await supabase
    .from("late_checkout_rates")
    .select("hours_3, hours_6, room_rates(name)")

  if (error || !data) {
    console.error("Late checkout rates fetch error:", error)
    return []
  }

  return data
    .filter((row) => row.room_rates)
    .map((row) => ({
      name: (row.room_rates as unknown as { name: string }).name,
      "3시간": row.hours_3,
      "6시간": row.hours_6,
    }))
}

export async function fetchDiscounts(client?: PricingClient): Promise<Discounts> {
  const supabase = client ?? (await createClient())
  const { data, error } = await supabase
    .from("discount_rates")
    .select("season, category, nights, discount_percent")

  if (error || !data) {
    console.error("Discount rates fetch error:", error)
    return { highSeason: { camping: {}, lodging: {} }, winterSeason: {} }
  }

  const result: Discounts = {
    highSeason: { camping: {}, lodging: {} },
    winterSeason: {},
  }

  data.forEach((row) => {
    if (row.season === "highSeason") {
      if (row.category === "camping") result.highSeason.camping[row.nights] = row.discount_percent
      else if (row.category === "lodging") result.highSeason.lodging[row.nights] = row.discount_percent
    } else if (row.season === "winterSeason") {
      result.winterSeason[row.nights] = row.discount_percent
    }
  })

  return result
}

/**
 * One-shot loader that hits `room_rates` exactly once and partitions in
 * memory, then fans out to `late_checkout` and `discount_rates` in parallel.
 */
export async function fetchAllPricing(client?: PricingClient) {
  const [roomRows, lateCheckoutRates, discounts] = await Promise.all([
    fetchRoomRateRows(client),
    fetchLateCheckoutRates(client),
    fetchDiscounts(client),
  ])
  return {
    lodgingRates: rowsToRatesByName(roomRows.filter((r) => r.type === "lodging")),
    campingRates: rowsToRatesByName(roomRows.filter((r) => r.type === "camping")),
    lateCheckoutRates,
    discounts,
  }
}
