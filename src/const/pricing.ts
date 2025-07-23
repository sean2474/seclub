import { CampingRates, CondoRates, Discounts, LodgingRates } from "@/types/pricing"

export const discounts: Discounts = {
  highSeason: {
    camping: { 3: 0, 4: 20, 5: 20, 6: 25, 7: 25 },
    lodging: { 3: 15, 4: 20, 5: 20, 6: 25, 7: 25 },
  },
  winterSeason: {
    "3박": 20,
    "4박": 25,
    "5박": 25,
    "6박": 30,
    "7박": 30,
    "8박 이상": 35,
    "2주 이상": 40,
    "4주 이상": 50,
  },
}

export const campingRates: CampingRates = {
  "캠핑장/반려견캠핑존": {
    최성수기: 65_000,
    성수기: 55_000,
    동절기: 55_000,
  },
  "S 사이트": {
    최성수기: 75_000,
    성수기: 65_000,
    동절기: 65_000,
  },
  연박할인: {
    성수기: 5_000,
    동절기: 5_000,
  },
}

export const lodgingRates: LodgingRates = {
  풀빌라: {
    rates: {
      최성수기: 359_000,
      동절기: 289_000,
    },
    longStayDiscount: 30_000,
  },
  오션스파빌리지: {
    rates: {
      최성수기: 399_000,
      동절기: 349_000,
    },
    longStayDiscount: 30_000,
  },
  "선셋 캠핑 하우스": {
    rates: {
      최성수기: 359_000,
      동절기: 279_000,
    },
  },
}

export const condoRates: CondoRates = {
  기본형: {
    최성수기: 199_000,
    성수기: 169_000,
    동절기: 169_000,
  },
  확장형: {
    최성수기: 289_000,
    성수기: 249_000,
    동절기: 249_000,
  },
}