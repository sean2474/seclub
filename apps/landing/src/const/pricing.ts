import { Discounts, LodgingRates } from "@/types/pricing"

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

export const lateCheckoutRates = [
  { name: "해수풀빌라", "3시간": 55000, "6시간": 70000 },
  { name: "오션스파빌라", "3시간": 60000, "6시간": 75000 },
  { name: "선셋 캠핑 하우스", "3시간": 50000, "6시간": 65000 },
  { name: "오션 콘도 스탠다드", "3시간": 35000, "6시간": 45000 },
  { name: "오션 콘도 디럭스", "3시간": 45000, "6시간": 60000 },
  { name: "캠핑장", "3시간": 20000, "6시간": 25000 },
]

export const campingRates: LodgingRates = {
  "캠핑장/반려견캠핑장": {
    rates: {
      최성수기: 65_000,
      동절기: 55_000,
    },
    longStayDiscount: 5_000,
  },
  "S 사이트": {
    rates: {
      최성수기: 75_000,
      동절기: 65_000,
    },
    longStayDiscount: 5_000,
  },
}

export const lodgingRates: LodgingRates = {
  "해수풀빌라": {
    rates: {
      최성수기: 359_000,
      동절기: 289_000,
    },
    longStayDiscount: 30_000,
  },
  "오션스파빌라": {
    rates: {
      최성수기: 399_000,
      동절기: 349_000,
    },
    longStayDiscount: 30_000,
  },
  "선셋 캠핑 하우스": {
    rates: {
      최성수기: 339_000,
      동절기: 279_000,
    },
    longStayDiscount: 30_000,
  },
  "오션 콘도 스탠다드": {
    rates: {
      최성수기: 199_000,
      동절기: 169_000,
    },
    longStayDiscount: 20_000,
  },
  "오션 콘도 디럭스": {
    rates: {
      최성수기: 289_000,
      동절기: 249_000,
    },
    longStayDiscount: 20_000,
  },
  "프리미엄 빌라": {
    rates: {
      최성수기: 1_890_000,
      동절기: 1_490_000,
    },
    longStayDiscount: 100_000,
  }
}