import test from 'node:test';
import assert from 'node:assert/strict';
import { describeLabBar } from '../src/lib/lab-explanation.js';
import { candles, swing } from '../src/lib/market.js';

const reference = { priceA: 100, priceB: 200, delta: 100, barA: 0, barB: 10, duration: 10 };

test('a bar before the reference high is not described as a completed correction', () => {
  const text = describeLabBar({ bar: 7, close: 150 }, reference);
  assert.match(text.price, /sebelum high acuan/);
  assert.match(text.time, /3 bar sebelum high/);
  assert.doesNotMatch(text.price, /mengoreksi 50/);
});

test('the high bar distinguishes the wick high from its closing price', () => {
  const text = describeLabBar({ bar: 10, close: 195 }, reference);
  assert.match(text.price, /tertinggi candle, yaitu 200,0/);
  assert.match(text.price, /penutupan bar yang sama adalah 195,0/);
  assert.match(text.time, /masih 0/);
});

test('half-price and half-time correction lies exactly on the 1x1 line', () => {
  const text = describeLabBar({ bar: 15, close: 150 }, reference);
  assert.match(text.price, /50,0%.*0,500/);
  assert.match(text.time, /5 bar.*0,50×.*bar 20/);
  assert.match(text.alignment, /garis 1×1 berada di 150,0/);
  assert.match(text.alignment, /adalah 0,0 poin/);
});

test('prices outside the reference swing are explained without calling them ordinary retracements', () => {
  assert.match(describeLabBar({ bar: 20, close: 210 }, reference).price, /10,0 poin di atas high.*negatif/);
  assert.match(describeLabBar({ bar: 20, close: 90 }, reference).price, /10,0 poin di bawah low.*melebihi 100%/);
});

test('the actual correction bar explanation uses the same close-based numbers as the Lab readout', () => {
  const text = describeLabBar(candles[96], swing);
  assert.match(text.price, /139,0.*58,4%.*0,584/);
  assert.match(text.time, /26 bar.*0,90×.*bar 99/);
  assert.match(text.alignment, /\+17,8 poin/);
});
