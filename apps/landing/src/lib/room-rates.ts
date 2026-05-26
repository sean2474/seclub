import {
  fetchAllPricing,
  fetchCampingRates,
  fetchDiscounts,
  fetchLateCheckoutRates,
  fetchLodgingRates,
} from "@seclub/data/pricing"

export const getLodgingRates = fetchLodgingRates
export const getCampingRates = fetchCampingRates
export const getLateCheckoutRates = fetchLateCheckoutRates
export const getDiscounts = fetchDiscounts
export const getAllPricing = fetchAllPricing
