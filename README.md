# Xerion Capital — React + Tailwind

Versi pengembangan dari kode yang diberikan. **Teks, bahasa Inggris, ejaan, kapitalisasi, isi FAQ, materi, paket, hasil contoh dan testimoni contoh mengikuti HTML asli. Jangan menyunting isinya tanpa permintaan pengguna.**

Atas permintaan pengguna pada 15 Oktober 2026, kapitalisasi tampilan dirapikan: awal kalimat/judul, nama program, merek, dan singkatan. Kata, bahasa, harga, dan isi FAQ tetap dipertahankan.

Sumber asli: `../Xerion_Capital_VSCode/index (1).html`, dari `FILE/xerioncapital.rar`. File asli tidak ditimpa. Revisi ini menggantikan versi pengembangan awal yang sempat mengubah copy.

## Jalankan

Gunakan Node.js 24 LTS. Buka terminal pada folder aplikasi:

```powershell
npm ci
npm run dev
```

```powershell
npm test
npm run build
npm run preview
```

Hasil produksi berada di `dist/`. React memerlukan proses build; jangan membuka index.html langsung dengan klik ganda.

## Aturan konten

- `src/original-content.json` menyimpan teks yang diambil dari HTML asli; yang dinormalisasi hanya whitespace HTML.
- `scripts/extract-content.mjs` mengekstrak teks dari dokumen yang dipilih, tanpa menjalankan script di dalam dokumen.
- `tests/fixtures/original.html` merupakan salinan sumber untuk pembandingan. Jangan menggantinya untuk sekadar membuat tes lolos.
- `tests/content.test.js` membandingkan konten dengan sumber dan memastikan heading Inggris, kelima FAQ, materi, paket, jurnal dan contoh member dipertahankan.
- Jangan menerjemahkan, membetulkan typo, menambah janji, mengganti CTA, atau mengubah jawaban FAQ tanpa permintaan pengguna.
- `src/content-capitalization.js` memuat penyesuaian kapitalisasi tampilan yang diminta pengguna. File sumber asli tetap utuh; guard dan `tests/capitalization.test.js` memastikan perubahan hanya pada kapitalisasi dan spasi.
- Ejaan asli seperti `menthorsip` tetap dipertahankan, dengan kapitalisasi tampilan seperti `Menthorsip`, `Choose your study`, `Time then Price`, dan `Lets join us`.

Jika perlu mengekstrak ulang salinan sumber yang sama:

```powershell
node scripts/extract-content.mjs tests/fixtures/original.html
npm test
```

## Struktur

- `src/App.jsx`: navigasi, hero, metode, paket, FAQ dan footer dengan teks sumber.
- `src/components/Curriculum.jsx`: enam materi asli dalam panel interaktif.
- `src/components/PriceLab.jsx`: enam overlay dengan label asli, data candle asli, readout, slider, keyboard dan replay.
- `src/components/Calculators.jsx`: label, deskripsi, default input, tabel proyeksi, dan narasi hasil asli.
- `src/lib/calculations.js`: validasi perhitungan dan pembulatan lot ke bawah agar anggaran risiko tidak terlampaui. Langkah lot dipakai 0,01 pada UI sumber.
- `src/components/Results.jsx`: simulasi 120 trade dari parameter asli, equity chart, hasil bulanan, jurnal dan member contoh. Label Data contoh / Contoh tetap ditampilkan.
- `src/lib/market.js`: algoritma candle dan pencarian swing dari sumber.
- `src/styles.css`: Tailwind dan desain khusus yang responsif, termasuk mode terang/gelap.
- `src/components/Brand.jsx`: logo orbital yang diadaptasi dari SVG sumber.

## Vercel

Repository: https://github.com/fikrialter-ai/xerion-capital

Import repository tersebut ke Vercel dengan Root Directory `.`. `vercel.json` menetapkan framework Vite, install `npm ci`, build `npm run build`, dan output `dist`. Versi Node 24.x ditetapkan dalam package.json.
## Netlify

Upload isi folder `dist/`, atau gunakan `FILE/xerion-academy-netlify.zip`. Root ZIP deploy harus berisi `index.html`, `favicon.svg`, `_headers`, dan `assets/`.

Jika menggunakan Git dengan seluruh workspace ini, base directory adalah `xerion-academy`, build command `npm run build`, publish directory `dist`. Konfigurasi berada di `netlify.toml`.

Website Netlify lama tetap terpisah. Deployment dari repository GitHub ini dapat dikelola melalui Vercel. File ZIP sumber dan deploy mengikuti revisi teks asli.

## Aset dan batas

Logo SVG dari sumber sudah digunakan. Foto/profil mentor, foto kegiatan, atau aset tambahan dapat dimasukkan setelah diberikan pengguna, tanpa mengubah teks yang ada.

Versi ini merupakan landing page dan tools belajar publik. Belum ada login member, LMS, pembayaran atau penyimpanan jurnal. WhatsApp hanya membuka percakapan dengan pesan sumber; tidak mengirim otomatis. Chart dan laporan contoh tetap menggunakan simulasi sumber. Google Fonts memakai koneksi internet dan memiliki fallback font lokal.

Lihat `VERIFICATION.md` untuk hasil pemeriksaan revisi terkini.
