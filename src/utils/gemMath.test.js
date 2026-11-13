import { breakEven, savingRate, directCost } from './gemMath';

test('10레벨 260만 골드, 현금 11만원, 100:6', () => {
  expect(breakEven(110000, 2600000)).toBeCloseTo(4.2308, 3);
  expect(savingRate(110000, 2600000, 6)).toBeCloseTo(0.2949, 3);
  expect(directCost(2600000, 6)).toBe(156000);
  expect(savingRate(156000, 2600000, 6)).toBeCloseTo(0, 9);
});
