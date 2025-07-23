export type Season = "최성수기" | "성수기" | "동절기"
export type CampingSite = "캠핑장/반려견캠핑존" | "S 사이트" | "연박할인"
export interface CampingRates {
  [site: string]: Partial<Record<Season, number>>
}
export type LodgingFacility = "풀빌라" | "오션스파빌리지" | "선셋 캠핑 하우스"
export interface LodgingRates {
  [fac: string]: {
    rates: Partial<Record<Season, number>>
    longStayDiscount?: number
  }
}
export type CondoType = "기본형" | "확장형"
export interface CondoRates {
  [type: string]: Partial<Record<Season, number>>
}
export interface Discounts {
  /** 성수기(3-6월,9-11월) 장박 특별할인 */
  highSeason: {
    camping: Record<number, number>
    lodging: Record<number, number>
  }
  /** 동절기(12-2월) 장박 특별할인 */
  winterSeason: Record<string, number>
}