const number = (value) => typeof value === 'string' && value.trim() === '' ? NaN : value == null ? NaN : Number(value);
export const formatNumber = (value, digits = 2) => new Intl.NumberFormat('id-ID', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
export const formatUSD = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);

export function calculateRisk(values) {
  const { balance, risk, entry, stop, target, pointValue, lotStep, winRate } = Object.fromEntries(
    ['balance', 'risk', 'entry', 'stop', 'target', 'pointValue', 'lotStep', 'winRate'].map(key => [key, number(values[key])]),
  );
  if (![balance, risk, entry, stop, target, pointValue, lotStep, winRate].every(Number.isFinite)) return { error: 'Lengkapi semua angka dengan nilai yang valid.' };
  if (balance <= 0 || pointValue <= 0 || lotStep <= 0 || lotStep < 0.00000001) return { error: 'Saldo, nilai per poin, dan langkah lot harus lebih dari 0. Langkah lot minimum 0,00000001.' };
  if (risk <= 0 || risk > 100) return { error: 'Isi risiko lebih dari 0% dan maksimal 100%.' };
  if (winRate < 0 || winRate > 100) return { error: 'Win rate harus berada antara 0% dan 100%.' };
  if ([entry, stop, target].some(n => n <= 0)) return { error: 'Entry, stop loss, dan take profit harus lebih dari 0.' };
  if (entry === stop) return { error: 'Stop loss harus berbeda dari entry agar risiko dapat dihitung.' };
  const side = stop < entry ? 'Buy' : 'Sell';
  if ((side === 'Buy' && target <= entry) || (side === 'Sell' && target >= entry)) return { error: `Untuk posisi ${side.toLowerCase()}, take profit harus ${side === 'Buy' ? 'di atas' : 'di bawah'} entry.` };
  const distance = Math.abs(entry - stop), budget = balance * risk / 100;
  const rawLots = budget / (distance * pointValue);
  const costPerLot = distance * pointValue;
  if (![budget, rawLots, costPerLot].every(Number.isFinite) || costPerLot <= 0) return { error: 'Nilai terlalu besar atau terlalu kecil untuk dihitung. Gunakan angka yang sesuai kontrak instrumen.' };
  let units = Math.floor((rawLots + Number.EPSILON * Math.max(1, rawLots) * 8) / lotStep);
  if (!Number.isSafeInteger(units)) return { error: 'Ukuran posisi terlalu besar. Periksa jarak stop loss dan langkah lot.' };
  let lots = Number((units * lotStep).toFixed(8));
  if (lots * costPerLot > budget) { units -= 1; lots = Number((units * lotStep).toFixed(8)); }
  if (lots <= 0) return { error: 'Batas risiko belum cukup untuk langkah lot ini. Kurangi langkah lot jika broker mendukung, atau tinjau rencana trade.' };
  const rewardRisk = Math.abs(target - entry) / distance;
  if (!Number.isFinite(rewardRisk)) return { error: 'Jarak harga tidak valid. Periksa entry, stop loss, dan take profit.' };
  return { side, budget, lots, actualRisk: lots * costPerLot, rewardRisk, breakEven: 100 / (1 + rewardRisk), expectancy: winRate / 100 * rewardRisk - (1 - winRate / 100) };
}

export function calculateProjection(values) {
  const { priceA, priceB, barA, barB, hours } = Object.fromEntries(['priceA', 'priceB', 'barA', 'barB', 'hours'].map(key => [key, number(values[key])]));
  if (![priceA, priceB, barA, barB, hours].every(Number.isFinite)) return { error: 'Lengkapi harga, nomor bar, dan timeframe dengan angka yang valid.' };
  if (priceA <= 0 || priceB <= 0 || hours <= 0 || barA < 0 || barB < 0) return { error: 'Harga dan timeframe harus lebih dari 0; nomor bar tidak boleh negatif.' };
  if (!Number.isInteger(barA) || !Number.isInteger(barB)) return { error: 'Nomor bar harus berupa bilangan bulat.' };
  if (barB <= barA) return { error: 'Bar B harus setelah bar A. Masukkan swing secara berurutan.' };
  if (priceA === priceB) return { error: 'Harga pivot A dan B harus berbeda untuk membentuk swing.' };
  const duration = barB - barA, delta = priceB - priceA;
  const retracements = [0.382, 0.5, 0.618, 0.786].map(ratio => ({ ratio, price: priceB - ratio * delta }));
  const times = [0.618, 1, 1.618].map(ratio => ({ ratio, bars: duration * ratio, hours: duration * ratio * hours, bar: barB + duration * ratio }));
  if (![duration * hours, delta / duration, ...times.flatMap(t => [t.hours, t.bar]), ...retracements.map(r => r.price)].every(Number.isFinite)) return { error: 'Nilai terlalu besar untuk dihitung. Periksa harga, bar, dan timeframe.' };
  return { direction: delta > 0 ? 'Naik' : 'Turun', duration, scale: Math.abs(delta) / duration, retracements, times };
}
