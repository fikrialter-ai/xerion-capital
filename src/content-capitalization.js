// User-authorized capitalization pass. Raw source copy stays in original-content.json.
// Sentence case for prose/headings, proper case for program/product names and acronyms.
export const capitalizationEdits = [
  ['hero.lines.0', 'They can manipulate price'],
  ['hero.description', 'Xerion Capital is platform menthorsip for trader or proprierty trader and we will give your big advantages and monitoring risk management about time and price'],
  ['method.equations.0.title', 'Price'],
  ['calculate.heading', 'Calculate'],
  ['calculate.titles.0', 'Proyeksi Time & Price'],
  ['results.intro', 'Satu R adalah risiko awal sebuah trade, dengan satuan ini, hasil akun besar dan kecil bisa dibandingkan dengan realitas <span class="tag">Data contoh</span> Angka di bawah dihasilkan dari simulasi 120 trade untuk menunjukkan format laporan. Ganti dengan hasil akun terverifikasi milikmu (lihat bagian <code>RESULTS</code> di kode).'],
  ['results.headers.6', 'Dasar Time & Price'],
  ['results.rows.2.0', 'GBPJPY'],
  ['curriculum.heading', '6 bulan Menthorsip'],
  ['curriculum.intro', 'Menggunakan konsep modeling menthorsip selama 6 bulan, dengan fee yang berbeda dan jika 6 bulan selesai tidak diwajibkan payment SPP untuk berada di menthorsip, namun diwajibkan jika mau melanjutkan study new materi'],
  ['curriculum.items.0.title', 'Structure price action'],
  ['curriculum.items.0.body', 'Menggunakan konsep ICT Time then Price, dengan algorithm yang advance serta time cycle versi Xerion Capital dengan adanya sbuah tools tambahan yang hanya ada di Xerion Capital untuk menentukan suatu narative.'],
  ['curriculum.items.1.title', 'Price level and time dilatation'],
  ['curriculum.items.1.body', 'Perlu menggunakan konsep quarterly dan price level tertentu untuk dilatation, dan menggunakan konsep PO3'],
  ['curriculum.items.2.body', 'Mengukur Δt, proyeksi 0,618 / 1 / 1,618, membedakan time window yang bermakna.'],
  ['curriculum.items.3.body', 'Menggunakan konsep algorithm narative - confluence - execution'],
  ['curriculum.items.4.title', 'Risk, position, and psikologis'],
  ['curriculum.items.4.body', 'Ukuran posisi berbasis stop loss, ekspektasi, drawdown<ul> <li>Batas risk harian dan mingguan</li> <li>Plan saat losing a row</li> </ul>'],
  ['curriculum.items.5.body', 'Live session, Discord bareng, journal review admin, journal review and koreksi member, fase set up 1 on 1, fundamental area'],
  ['program.heading', 'Choose your study'],
  ['program.items.0.features.0', 'Fundamental intermediate dan akses 1 Discord Xerion'],
  ['program.items.0.features.2', 'Template jurnal trading. Beberapa tools'],
  ['program.items.0.features.3', 'Komunitas peserta, Discord with admin'],
  ['program.items.0.cta', 'Choose study'],
  ['program.items.1.name', 'Menthorsip'],
  ['program.items.1.features.0', 'Join Discord 2 Xerion Capital'],
  ['program.items.1.features.2', 'Review jurnal pribadi, materi Time then Price dan seputar Xerion Capital'],
  ['program.items.1.features.3', 'Menggunakan tools dari Xerion Capital'],
  ['program.items.1.cta', 'Choose your study'],
  ['program.items.2.name', 'Stage 2 Xerion Capital'],
  ['program.items.2.price', 'Only member Xerion jika lanjutan'],
  ['program.items.2.features.0', 'Lanjutan Time then Price, offline session jika satu lokasi'],
  ['program.items.2.features.3', 'Koreksi tiap journal dan review lanjutan, mendapatkan akses tools dan software, dan free sertifikat'],
  ['program.items.2.cta', 'Choose study'],
  ['faq.items.0.answer', 'Tidak, tidak ada mentor yang bisa menjamin profit. Yang kami ajarkan adalah how to build narative dan gimana eksekusi sesuai model sendiri tanpa adanya sinyal'],
  ['faq.items.1.answer', 'Cocok, tapi tidak dengan kemalasan, di Xerion tidak cocok malas'],
  ['faq.items.2.answer', 'Modal yang dibutuhkan kemungkinan berdasarkan equity, dan kemungkinan diberikan modal funded free sebagai evaluasi journal'],
  ['faq.items.3.answer', 'Sierra Char/TradingView, MT5, Discord, Investopedia'],
  ['faq.items.4.answer', 'Hasil akun mentor dipublikasikan lewat laporan terverifikasi, dan review journal mu melalui Discord dan di koreksi secara real time'],
  ['closing.heading', 'Time then Price'],
  ['closing.cta', 'Lets join us'],
];

export const caseInsensitiveCopy = value => value.toLocaleLowerCase('id-ID').replace(/\s+/g, '');

export function applyCapitalization(source) {
  const content = structuredClone(source);
  for (const [path, value] of capitalizationEdits) {
    const keys = path.split('.');
    const last = keys.pop();
    const target = keys.reduce((node, key) => node[key], content);
    if (typeof target[last] !== 'string' || caseInsensitiveCopy(target[last]) !== caseInsensitiveCopy(value)) {
      throw new Error(`Capitalization edit would change copy at ${path}`);
    }
    target[last] = value;
  }
  return content;
}
