import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const decode = value => value.replace(/&amp;/g, '&').replace(/&nbsp;/g, '\u00a0').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
export const text = value => decode(value.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
const matches = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'))].map(match => match[1]);
const first = (html, tag) => matches(html, tag)[0] || '';
export function extractContent(source) {
  const section = id => source.match(new RegExp(`<section\\b[^>]*\\bid="${id}"[^>]*>([\\s\\S]*?)<\\/section>`))[1];
  const hero = section('hero'), method = section('metode'), lab = section('lab'), calculate = section('hitung'), results = section('hasil'), course = section('kurikulum'), program = section('program'), faq = section('faq');
  const closing = source.match(/<section class="band final">([\s\S]*?)<\/section>/)[1];
  const heroHeading = first(hero, 'h1');
  const eqs = [...method.matchAll(/<div class="eq">([\s\S]*?<\/p>)\s*<\/div>/g)].map(([_, html]) => ({ title: text(first(html, 'h3')), formula: html.match(/<div class="f">([\s\S]*?)<\/div>/)[1].trim(), description: text(first(html, 'p')) }));
  const courses = matches(course, 'details').map(html => ({ numeral: text(html.match(/<span class="rom">([\s\S]*?)<\/span>/)[1]), title: text(html.match(/<span class="ttl">([\s\S]*?)<\/span>/)[1]), body: html.match(/<div class="body">([\s\S]*?)<\/div>/)[1].replace(/\s+/g, ' ').trim() }));
  const plans = matches(program, 'article').map((html, index) => ({ name: text(first(html, 'h3')), price: text(html.match(/<div class="price">([\s\S]*?)<\/div>/)[1].replace(/<small>[\s\S]*?<\/small>/, '')), period: text(first(html, 'small')), features: matches(html, 'li').map(text), cta: text(first(html, 'a')), href: decode(html.match(/href="([^"]+)"/)[1]), featured: index === 1 }));
  return {
    title: text(first(source, 'title')),
    description: source.match(/name="description"\s+content="([^"]+)"/)[1],
    hero: { lines: matches(heroHeading, 'span').map(text), description: text(first(hero, 'p')), ctas: matches(hero, 'a').map(text) },
    method: { heading: text(first(method, 'h2')), intro: text(first(method, 'p')), equations: eqs },
    lab: { heading: text(first(lab, 'h2')), intro: text(first(lab, 'p')), overlays: [...lab.matchAll(/data-ov="([^"]+)"[^>]*><span>([^<]+)<\/span>/g)].map(match => ({ key: match[1], label: text(match[2]) })) },
    calculate: { heading: text(first(calculate, 'h2')), intro: text(first(calculate, 'p')), titles: matches(calculate, 'h3').map(text), descriptions: matches(calculate, 'p').slice(1).map(text) },
    results: { heading: text(first(results, 'h2')), intro: first(results, 'p').replace(/\s+/g, ' ').trim(), journalHeading: text(first(results, 'h3')), journalDescription: text(matches(results, 'p')[2]), monthNote: text(matches(results, 'p')[1]), headers: matches(results, 'th').map(text), rows: matches(first(results, 'tbody'), 'tr').map(row => matches(row, 'td').map(text)), memberHeading: matches(results, 'h3')[1].replace(/\s+/g, ' ').trim(), quotes: matches(results, 'figure').map(html => ({ quote: text(first(html, 'blockquote')), author: text(first(html, 'figcaption')) })) },
    curriculum: { heading: text(first(course, 'h2')), intro: text(first(course, 'p')), items: courses },
    program: { heading: text(first(program, 'h2')), items: plans },
    faq: { heading: text(first(faq, 'h2')), items: matches(faq, 'details').map(html => ({ question: text(first(html, 'summary')), answer: text(first(html, 'p')) })) },
    closing: { heading: text(first(closing, 'h2')), cta: text(first(closing, 'a')) },
    footer: { risk: text(first(first(source, 'footer'), 'p')), copyright: text(matches(first(source, 'footer'), 'p')[1]) },
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const source = readFileSync(process.argv[2], 'utf8');
  writeFileSync(new URL('../src/original-content.json', import.meta.url), JSON.stringify(extractContent(source), null, 2) + '\n');
}
