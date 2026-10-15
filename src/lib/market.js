// Candle generation and pivots preserved from the supplied Xerion HTML script.
const pivots = [[0, 100], [22, 141], [40, 117], [68, 172], [96, 139], [119, 184]];
export function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const random = mulberry32(7);
let previous = pivots[0][1];
export const candles = Array.from({ length: 120 }, (_, i) => {
  let k = 0; while (k < pivots.length - 2 && i > pivots[k + 1][0]) k++;
  const [i0, p0] = pivots[k], [i1, p1] = pivots[k + 1];
  const base = p0 + (p1 - p0) * (i - i0) / (i1 - i0);
  const proximity = Math.min(1, Math.min(...pivots.map(([bar]) => Math.abs(bar - i))) / 5);
  const close = base + (random() - 0.5) * 7.5 * proximity;
  const open = i === 0 ? close - 1 : previous;
  const wick = (0.5 + random() * 3.2) * (0.35 + 0.65 * proximity);
  previous = close;
  return { bar: i, open, close, high: Math.max(open, close) + wick, low: Math.min(open, close) - wick };
});
const extremum = (start, end, field, greater) => { let at = start; for (let i = start; i <= end; i++) if (greater ? candles[i][field] > candles[at][field] : candles[i][field] < candles[at][field]) at = i; return at; };
const barA = extremum(34, 46, 'low', false), barB = extremum(62, 74, 'high', true), correctionBar = extremum(90, 102, 'low', false);
export const swing = { priceA: candles[barA].low, priceB: candles[barB].high, barA, barB, duration: barB - barA, delta: candles[barB].high - candles[barA].low, correctionBar, correctionPrice: candles[correctionBar].low };
