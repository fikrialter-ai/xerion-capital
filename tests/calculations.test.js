import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRisk, calculateProjection } from '../src/lib/calculations.js';

const buy = { balance: '10000', risk: '1', entry: '2650', stop: '2640', target: '2680', pointValue: '100', lotStep: '0.01', winRate: '45' };
const projection = { priceA: '117', priceB: '172', barA: '40', barB: '68', hours: '4' };

test('valid buy uses contract value, lot step and net reward/risk expectancy', () => {
  const result = calculateRisk(buy);
  assert.equal(result.side, 'Buy'); assert.equal(result.lots, 0.1);
  assert.equal(result.actualRisk, 100); assert.equal(result.rewardRisk, 3);
  assert.equal(result.breakEven, 25); assert.ok(Math.abs(result.expectancy - 0.8) < 1e-12);
});
test('valid sell uses the same risk budget', () => {
  const result = calculateRisk({ ...buy, stop: '2660', target: '2620' });
  assert.equal(result.side, 'Sell'); assert.equal(result.lots, 0.1); assert.equal(result.rewardRisk, 3);
});
test('lot rounding cannot exceed budget, including the original 4.4-point example', () => {
  const result = calculateRisk({ ...buy, entry: '138.6', stop: '134.2', target: '161.4' });
  assert.equal(result.lots, 0.22); assert.ok(result.actualRisk <= result.budget);
});
test('risk budget is respected over varied balances, distances and lot steps', () => {
  for (const balance of [10, 1234, 10000, 99999]) for (const risk of [0.1, 1, 5]) for (const distance of [0.1, 1.3, 4.4, 15]) for (const lotStep of [0.001, 0.01, 0.1, 1]) {
    const result = calculateRisk({ ...buy, balance, risk, entry: 100, stop: 100 - distance, target: 110, lotStep });
    if (!result.error) { assert.ok(result.actualRisk <= result.budget, JSON.stringify(result)); assert.ok(result.lots > 0); }
  }
});
test('zero, negative, nonfinite, missing and empty inputs do not calculate', () => {
  for (const field of Object.keys(buy)) for (const value of ['', ' ', 'x', Infinity, NaN, undefined, null]) assert.ok(calculateRisk({ ...buy, [field]: value }).error, field);
  for (const field of ['balance', 'risk', 'entry', 'stop', 'target', 'pointValue', 'lotStep']) for (const value of [0, -1]) assert.ok(calculateRisk({ ...buy, [field]: value }).error, field);
});
test('stop at entry and wrong-side targets return actionable errors', () => {
  assert.match(calculateRisk({ ...buy, stop: buy.entry }).error, /berbeda/);
  assert.match(calculateRisk({ ...buy, target: '2645' }).error, /di atas/);
  assert.match(calculateRisk({ ...buy, stop: '2660', target: '2680' }).error, /di bawah/);
});
test('untradeably small lots never round up to a risky position', () => {
  assert.ok(calculateRisk({ ...buy, balance: '10' }).error);
});
test('percentages outside bounds and numeric overflow are rejected', () => {
  for (const winRate of [-1, 101]) assert.ok(calculateRisk({ ...buy, winRate }).error);
  assert.ok(calculateRisk({ ...buy, risk: 101 }).error);
  assert.ok(calculateRisk({ ...buy, balance: 1e308, pointValue: 1e-308 }).error);
});
test('projection produces correct retracement and duration from the original swing', () => {
  const result = calculateProjection(projection);
  assert.equal(result.duration, 28); assert.equal(result.direction, 'Naik');
  assert.equal(result.retracements[1].price, 144.5);
  assert.equal(result.times[1].bar, 96); assert.equal(result.times[1].hours, 112);
});
test('downward swing retracement correctly goes above pivot B', () => {
  const result = calculateProjection({ ...projection, priceA: '172', priceB: '117' });
  assert.equal(result.direction, 'Turun'); assert.equal(result.retracements[1].price, 144.5);
});
test('bars must be chronological, whole, nonnegative and nonempty', () => {
  for (const values of [{ barB: 40 }, { barB: 39 }, { barA: -1 }, { barA: 0.5 }, { barB: '' }]) assert.ok(calculateProjection({ ...projection, ...values }).error);
});
test('zero swing and invalid price/timeframe cannot generate a projection', () => {
  for (const values of [{ priceA: 172 }, { priceA: 0 }, { priceB: '' }, { hours: 0 }, { priceB: Infinity }, { hours: 1e308 }]) assert.ok(calculateProjection({ ...projection, ...values }).error);
});
