import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyCapitalization, capitalizationEdits } from '../src/content-capitalization.js';

const source = JSON.parse(readFileSync(new URL('../src/original-content.json', import.meta.url), 'utf8'));
const display = applyCapitalization(source);

test('approved editorial copy reaches the display without legacy capitalization substitutions', () => {
  assert.deepEqual(capitalizationEdits, []);
  assert.deepEqual(display, source);
  assert.notStrictEqual(display, source);
});

test('capitalization adapter preserves source immutability at nested levels', () => {
  const isolated = applyCapitalization(source);
  isolated.program.items[0].name = 'Changed in consumer';
  isolated.faq.items[0].answer = 'Changed in consumer';
  assert.equal(source.program.items[0].name, 'Foundation');
  assert.match(source.faq.items[0].answer, /^Tidak\./);
});

test('programs, technical acronyms and instrument symbols use approved casing', () => {
  assert.deepEqual(display.program.items.map(p => p.name), ['Foundation', 'Core Mentorship', 'Stage 2']);
  assert.equal(display.calculate.heading, 'Kalkulator Risiko & Proyeksi');
  assert.equal(display.closing.heading, 'Time, Then Price.');
  for (const row of display.results.rows) assert.match(row[0], /^[A-Z0-9]+$/);
  assert.match(display.curriculum.items[1].body, /Power of Three \(PO3\)/);
  assert.equal(display.faq.items[3].answer, 'Sierra Chart, TradingView, MT5, dan Discord.');
});

test('new wording, punctuation, prices, formulas and FAQ are preserved exactly by the compatibility adapter', () => {
  assert.deepEqual(display.faq, source.faq);
  assert.deepEqual(display.method, source.method);
  assert.deepEqual(display.program, source.program);
  assert.equal(display.hero.lines[1], "but they can't manipulate time.");
  assert.equal(display.program.items[0].price, '$30');
  assert.equal(display.program.items[1].price, '$140');
  assert.equal(display.program.items[2].price, 'Invite Only');
});
