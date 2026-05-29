import {
  fetchAllPricing,
  fetchCampingRates,
  fetchDiscounts,
  fetchLateCheckoutRates,
  fetchLodgingRates,
} from "@seclub/data/pricing"
import { createClient as createPublicClient } from "@seclub/supabase/public"

export const getLodgingRates = () => fetchLodgingRates(createPublicClient())
export const getCampingRates = () => fetchCampingRates(createPublicClient())
export const getLateCheckoutRates = () => fetchLateCheckoutRates(createPublicClient())
export const getDiscounts = () => fetchDiscounts(createPublicClient())
export const getAllPricing = () => fetchAllPricing(createPublicClient())
