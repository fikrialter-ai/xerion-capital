import { formatNumber as f } from './calculations.js';

// The explanation uses the same closing price and reference swing as the readout.
export function describeLabBar(candle, swing) {
  const elapsed = candle.bar - swing.barB;
  const retracement = (swing.priceB - candle.close) / swing.delta;
  let price;
  if (elapsed < 0) {
    price = `Harga penutupan bar ini ${f(candle.close, 1)}. Bar masih berada sebelum high acuan; pembacaan koreksi digunakan setelah high terbentuk.`;
  } else if (elapsed === 0) {
    price = `High acuan memakai harga tertinggi candle, yaitu ${f(swing.priceB, 1)}. Harga penutupan bar yang sama adalah ${f(candle.close, 1)}. Keduanya dapat berbeda karena sumbu candle.`;
  } else if (retracement < 0) {
    price = `Harga penutupan ${f(candle.close, 1)} berada ${f(candle.close - swing.priceB, 1)} poin di atas high acuan. Rasio retracement negatif berarti harga telah melewati puncak swing.`;
  } else if (retracement > 1) {
    price = `Harga penutupan ${f(candle.close, 1)} berada ${f(swing.priceA - candle.close, 1)} poin di bawah low acuan. Koreksi telah melebihi 100% kenaikan swing.`;
  } else {
    price = `Harga penutupan ${f(candle.close, 1)} mengoreksi ${f(retracement * 100, 1)}% kenaikan swing (r = ${f(retracement, 3)}). Garis retracement menjadi acuan untuk membandingkan kedalaman koreksi.`;
  }

  const time = elapsed < 0
    ? `Bar ini berada ${Math.abs(elapsed)} bar sebelum high acuan. Durasi koreksi belum dihitung pada bagian ini.`
    : elapsed === 0
      ? 'Ini bar high acuan, titik awal pengukuran waktu koreksi. Rasio waktunya masih 0.'
      : `Sudah ${elapsed} bar sejak high, setara ${f(elapsed / swing.duration, 2)}× durasi swing. Proyeksi waktu 1× jatuh pada bar ${swing.barB + swing.duration}, saat durasinya sama dengan swing awal.`;

  const squarePrice = swing.priceB - swing.delta / swing.duration * elapsed;
  const gap = candle.close - squarePrice;
  const alignment = elapsed <= 0
    ? `Garis 1×1 membandingkan proporsi perubahan harga dan waktu setelah high. Dalam ${swing.duration} bar, garis ini bergerak dari high ${f(swing.priceB, 1)} ke level low ${f(swing.priceA, 1)}.`
    : `Pada bar ini, garis 1×1 berada di ${f(squarePrice, 1)}. Selisih harga penutupan terhadap garis adalah ${gap > 0 ? '+' : gap < 0 ? '−' : ''}${f(Math.abs(gap), 1)} poin. Selisih 0 berarti harga berada pada garis; baca bersama level harga dan proyeksi waktu.`;

  return { price, time, alignment };
}
