import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { extractContent, text } from '../scripts/extract-content.mjs';

const source=readFileSync(new URL('./fixtures/original.html',import.meta.url),'utf8');
const content=JSON.parse(readFileSync(new URL('../src/original-content.json',import.meta.url),'utf8'));
test('all extracted copy matches the supplied HTML without rewriting',()=>assert.deepEqual(content,extractContent(source)));
test('original five FAQ questions and answers are preserved verbatim',()=>{
  assert.equal(content.faq.items.length,5);
  for(const item of content.faq.items) { assert.ok(text(source).includes(item.question)); assert.ok(text(source).includes(item.answer)); }
  assert.equal(content.faq.items[1].answer,'Cocok, tapi tidak dengan kemalasan, di xerion tidak cocok malas');
});
test('English headings, spelling and package labels remain unchanged',()=>{
  assert.deepEqual(content.hero.lines,['they can manipulate price','but they cant manipulate time']);
  assert.equal(content.program.heading,'choose your study');
  assert.equal(content.program.items[1].name,'menthorsip');
  assert.equal(content.program.items[1].period,'/ 6 month');
  assert.equal(content.closing.heading,'TIME THEN PRICE');
  assert.equal(content.closing.cta,'lets join us');
});
test('all original method descriptions, curriculum, examples and journal rows are retained',()=>{
  assert.equal(content.method.equations.length,4);
  assert.ok(content.method.equations.every(equation=>equation.description.length>20));
  assert.equal(content.curriculum.items.length,6);
  assert.equal(content.results.quotes.length,3);
  assert.equal(content.results.rows.length,6);
  assert.equal(content.results.rows[2][0],'gbpjpy');
  assert.ok(content.results.intro.includes('RESULTS'));
});
