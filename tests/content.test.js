import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { extractContent } from '../scripts/extract-content.mjs';

const content = JSON.parse(readFileSync(new URL('../src/original-content.json', import.meta.url), 'utf8'));
const legacy = extractContent(readFileSync(new URL('./fixtures/original.html', import.meta.url), 'utf8'));
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const strings = value => typeof value === 'string' ? [value] : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : [];

test('metadata, corrected English hero and font requests match the monochrome brief', () => {
  assert.deepEqual(content.hero.lines, ['They can manipulate price,', "but they can't manipulate time."]);
  assert.equal(content.hero.description, 'Edukasi dan mentorship trading berbasis Time & Price. Fokus pada struktur likuiditas, siklus waktu, dan manajemen risiko terukur untuk retail maupun proprietary trader.');
  for (const [tag, value] of [['title', content.title], ['description', content.description]]) {
    const escaped = value.replaceAll('&', '&amp;');
    assert.ok(html.includes(tag === 'title' ? `<title>${escaped}</title>` : `<meta name="description" content="${escaped}"`));
  }
  assert.ok(html.includes('family=Inter:wght@400;500;600'));
  assert.ok(html.includes('family=JetBrains+Mono:wght@400;500&display=swap'));
  assert.doesNotMatch(html, /Bodoni|Jost|Instrument|Jakarta/);
  assert.ok(html.includes("'#000000' : '#ffffff'"));
  assert.equal(content.calculate.heading, 'Kalkulator Risiko & Proyeksi');
  assert.deepEqual(content.closing, {heading:'Time, Then Price.', cta:'Hubungi via WhatsApp'});
});

test('program pricing, periods and WhatsApp messages match the requested offers', () => {
  assert.equal(content.program.heading, 'Program Belajar');
  assert.deepEqual(content.program.items.map(p => [p.name, p.price, p.period, p.cta, p.featured]), [
    ['Foundation', '$30', 'Sekali bayar', 'Pilih Foundation', false],
    ['Core Mentorship', '$140', '/ 6 bulan', 'Daftar Mentorship', true],
    ['Stage 2', 'Invite Only', 'Khusus alumni Mentorship', 'Tanyakan Stage 2', false],
  ]);
  assert.deepEqual(content.program.items.map(p => p.features), [
    ['Materi fondasi Time & Price','Akses penuh Time & Price Lab','Template jurnal & kalkulator risiko','Komunitas Discord Tier 1'],
    ['Kurikulum penuh 6 bulan & Discord Tier 2','Live session mingguan & sesi 1-on-1','Audit dan koreksi jurnal pribadi','Akses penuh tools internal Xerion Capital'],
    ['Riset lanjutan Time-then-Price & sesi offline','1-on-1 pembuatan sistem model mandiri','Kombinasi algoritma fundamental & teknikal','Audit jurnal intensif, software lanjutan & sertifikat'],
  ]);
  const messages = ['Halo Xerion Capital, saya ingin join Foundation', 'Halo Xerion Capital, saya ingin join Core Mentorship', 'Halo Xerion Capital, saya ingin tanya Stage 2'];
  content.program.items.forEach((program, index) => {
    const url = new URL(program.href);
    assert.equal(url.origin, 'https://wa.me');
    assert.equal(url.pathname, '/+62881027154083');
    assert.equal(url.searchParams.get('text'), messages[index]);
  });
});

test('six curriculum modules use the requested titles and the revised access policy', () => {
  assert.equal(content.curriculum.heading, 'Kurikulum 6 Bulan');
  assert.equal(content.curriculum.intro, 'Pendampingan terstruktur selama 6 bulan. Setelah lulus, anggota tetap mendapatkan akses komunitas tanpa biaya bulanan tambahan.');
  assert.deepEqual(content.curriculum.items.map(item => [item.numeral, item.title]), [
    ['I','Struktur Harga & Narasi Waktu'], ['II','Level Harga & Time Dilation'], ['III','Siklus Waktu & Jendela Reaksi'],
    ['IV','Keselarasan Price-Time'], ['V','Manajemen Risiko & Psikologi'], ['VI','Eksekusi Live & Audit Jurnal'],
  ]);
  assert.match(content.curriculum.items[1].body, /Power of Three \(PO3\)/);
  assert.match(content.curriculum.items[4].body, /<ul><li>Batas risiko harian dan mingguan<\/li><li>Protokol saat menghadapi losing streak<\/li><\/ul>$/);
});

test('journal retains the source example rows while modeled performance and testimonials are removed', () => {
  assert.equal(content.results.heading, 'Jurnal Eksekusi Berbasis R');
  assert.equal(content.results.intro, 'Satu R adalah satu unit risiko per transaksi. Kami tidak menjual klaim angka nominal, melainkan konsistensi eksekusi di mana setiap entry wajib memiliki alasan waktu dan harga yang terukur.');
  assert.equal(content.results.journalHeading, 'Contoh Pencatatan Jurnal');
  assert.equal(content.results.journalDescription, 'Format standar pencatatan transaksi anggota di dalam komunitas.');
  assert.deepEqual(content.results.rows, legacy.results.rows.map(row => [row[0].toUpperCase(), ...row.slice(1)]));
  assert.equal(content.results.headers.length, 7);
  assert.equal('monthNote' in content.results, false);
  assert.equal('quotes' in content.results, false);
  assert.equal('memberHeading' in content.results, false);
  assert.deepEqual(content.lab.overlays, [
    {key:'retr',label:'Retracement'}, {key:'ext',label:'Ekstensi'},
    {key:'cycle',label:'Proyeksi Siklus Waktu'}, {key:'zones',label:'Zona Waktu Fibonacci'},
    {key:'square',label:'Kotak Price-Time'}, {key:'gann',label:'Gann Fan'},
  ]);
  assert.deepEqual(content.footer, legacy.footer);
});

test('five concise FAQ answers and all current copy are free from legacy typos and code instructions', () => {
  assert.equal(content.faq.items.length, 5);
  assert.match(content.faq.items[0].answer, /^Tidak\./);
  assert.match(content.faq.items[1].answer, /disiplin/);
  assert.match(content.faq.items[2].answer, /akun demo/);
  assert.equal(content.faq.items[3].answer, 'Sierra Chart, TradingView, MT5, dan Discord.');
  assert.match(content.faq.items[4].answer, /jurnal transaksi di Discord/);
  content.faq.items.forEach(item => assert.ok(item.answer.length < 250));
  for (const copy of strings(content)) assert.doesNotMatch(copy, /menthorsip|proprierty|narative|dilatation|sbuah|sierra char\b|Data contoh|class=|RESULTS|di kode/i);
});
