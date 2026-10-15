import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyCapitalization, caseInsensitiveCopy } from '../src/content-capitalization.js';

const source = JSON.parse(readFileSync(new URL('../src/original-content.json', import.meta.url), 'utf8'));
const display = applyCapitalization(source);

test('capitalization pass preserves every word, number, punctuation mark and data field', () => {
  function compare(before, after, path = '') {
    if (typeof before === 'string') assert.equal(caseInsensitiveCopy(after), caseInsensitiveCopy(before), path);
    else if (before && typeof before === 'object') {
      assert.deepEqual(Object.keys(after), Object.keys(before), path);
      for (const key of Object.keys(before)) compare(before[key], after[key], `${path}.${key}`);
    } else assert.equal(after, before, path);
  }
  compare(source, display);
});

test('program names, headings, CTA labels and brand names use consistent case', () => {
  assert.equal(display.program.heading, 'Choose your study');
  assert.deepEqual(display.program.items.map(program => program.name), ['Foundation', 'Menthorsip', 'Stage 2 Xerion Capital']);
  assert.deepEqual(display.program.items.map(program => program.cta), ['Choose study', 'Choose your study', 'Choose study']);
  assert.equal(display.calculate.heading, 'Calculate');
  assert.equal(display.results.rows[2][0], 'GBPJPY');
  assert.equal(display.closing.heading, 'Time then Price');
});

test('FAQ retains all five original questions and answers with case-only changes', () => {
  assert.equal(display.faq.items.length, 5);
  for (let i = 0; i < 5; i++) {
    assert.equal(display.faq.items[i].question, source.faq.items[i].question);
    assert.equal(caseInsensitiveCopy(display.faq.items[i].answer), caseInsensitiveCopy(source.faq.items[i].answer));
  }
  assert.equal(display.faq.items[3].answer, 'Sierra Char/TradingView, MT5, Discord, Investopedia');
});

test('source copy stays immutable and formulas, prices, addresses and examples remain intact', () => {
  assert.equal(source.program.heading, 'choose your study');
  assert.deepEqual(display.program.items.map(program => program.href), source.program.items.map(program => program.href));
  assert.deepEqual(display.method.equations.map(equation => equation.formula), source.method.equations.map(equation => equation.formula));
  assert.deepEqual(display.results.quotes, source.results.quotes);
  assert.equal(display.program.items[0].price, '30$');
  assert.equal(display.program.items[1].price, '140$');
});
