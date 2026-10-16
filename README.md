# Xerion Capital — Minimal Monochrome

Revisi 16 Oktober 2026: desain hitam-putih dengan Inter dan JetBrains Mono, struktur halaman yang ringkas, serta copy baru sesuai brief pengguna. React 19, Vite 7, dan Tailwind 4; tanpa dependensi tambahan.

## Jalankan lokal

Gunakan Node.js 24 LTS dari folder aplikasi:

```powershell
npm ci
npm run dev
```

Untuk pratinjau build produksi:

```powershell
npm test
npm run build
npm run preview -- --port 4173 --strictPort
```

Pratinjau: http://127.0.0.1:4173/ . Build berada di `dist/`.

## Konten dan komponen

- `src/original-content.json` adalah sumber copy editorial terkini. Nama file dipertahankan untuk kompatibilitas. Arahan pengguna terbaru menggantikan batasan lama yang hanya mengizinkan perubahan kapitalisasi.
- `src/content-capitalization.js` menyalin data tanpa substitusi lama. `src/content.js` menyediakan model konten untuk komponen.
- `tests/fixtures/original.html` merupakan arsip historis, dipakai untuk memastikan angka contoh jurnal dan peringatan risiko tidak berubah. Jangan mengekstrak ulang arsip ini untuk menimpa copy terkini.
- `src/App.jsx`: hero → metode → kurikulum → Lab → kalkulator → jurnal → program → FAQ. Navigasi memakai Bahasa Indonesia.
- `src/styles.css`: tema monokrom gelap/terang, Inter untuk teks, JetBrains Mono untuk rumus dan data. Tidak ada ilustrasi besar, tier label, panel kesesuaian, atau CSS untuk grafik performa dummy.
- `PriceLab.jsx`: enam overlay (retracement, ekstensi, proyeksi siklus waktu, zona waktu Fibonacci, kotak price-time, Gann fan). Tiga overlay inti aktif saat pertama dibuka; indikator tambahan dapat diaktifkan satu per satu. Pemilihan bar lewat klik/geser, keyboard, dan slider. Data chart tetap simulasi latihan; tidak ada replay otomatis.
- Di bawah chart, penjelasan harga, waktu, dan keselarasan mengikuti bar terpilih. `src/lib/lab-explanation.js` menggunakan harga penutupan yang sama dengan readout, membedakannya dari high/low sumbu candle. Tautan setelah penjelasan menuju kalkulator untuk latihan dengan data sendiri.
- `Calculators.jsx`: proyeksi waktu/retracement dan kalkulator risiko dengan validasi dari helper numerik. Risiko posisi aktual ditampilkan setelah lot dibulatkan ke bawah.
- `Results.jsx`: satu tabel contoh pencatatan jurnal, tanpa kurva ekuitas, statistik dummy, kotak bulanan, atau testimoni.
- `Curriculum.jsx`: enam materi interaktif dengan copy yang diberikan pengguna.
- `src/lib/calculations.js` dan `src/lib/market.js` tidak diubah. Pengujian angka, pembulatan, dan input tidak valid tetap tersedia.
- File draft alternatif tetap disimpan lokal dan dapat dibuka lewat `/draft/` saat `npm run dev`. Build produksi hanya menggunakan `index.html` utama, sehingga draft tidak ikut dipublikasikan.

## Status

Branch `main` di repository `fikrialter-ai/xerion-capital` terhubung ke Vercel. Build produksi memakai `npm ci`, `npm run build`, dan output `dist/` sesuai `vercel.json`. ZIP lama tidak mewakili perubahan terbaru.

Google Fonts memerlukan koneksi internet dan memiliki fallback lokal. WhatsApp hanya membuka percakapan; belum ada login, LMS, pembayaran, atau penyimpanan jurnal. Lihat `VERIFICATION.md` untuk hasil pemeriksaan.
