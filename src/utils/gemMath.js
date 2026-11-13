// 모든 비율은 "수수료 떼기 전" 기준 (시장에서 부르는 100골드:N원과 같은 기준)
export const FEE = 0.05;

// 보석 경로의 100골드당 원 = 손익분기 N
export const breakEven = (cash, gold) => (cash / gold) * 100;

// 직접 구매(100:N) 대비 보석 경로가 아끼는 비율. 양수면 보석이 이득
export const savingRate = (cash, gold, n) => 1 - breakEven(cash, gold) / n;

// 같은 골드를 직접 샀을 때 드는 원
export const directCost = (gold, n) => (gold / 100) * n;
