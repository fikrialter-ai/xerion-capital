import { useState } from 'react';
import { calculateRisk, calculateProjection, formatNumber as f } from '../lib/calculations.js';
import { swing } from '../lib/market.js';
import { original } from '../content.js';

const nf = (value, digits = 1) => Number.isFinite(value) ? f(value, digits) : '—';
const signed = value => (value > 0 ? '+' : value < 0 ? '−' : '') + nf(Math.abs(value), 2);
const duration = hours => hours < 48 ? `${nf(hours, hours % 1 ? 1 : 0)} jam` : `${nf(hours / 24, 1)} hari`;

function NumberField({ id, label, value, onChange, step = 'any', max }) {
  return <label className="number-field" htmlFor={id}><span>{label}</span><input id={id} name={id} type="number" inputMode="decimal" step={step} max={max} value={value} onChange={event => onChange(event.target.value)} autoComplete="off" /></label>;
}

function ProjectionTable({ caption, headers, rows }) {
  return <div className="original-table-scroll" role="region" aria-label={caption} tabIndex="0"><table><caption>{caption}</caption><thead><tr>{headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, column) => <td key={column}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

function ProjectionCalculator() {
  const [values, setValues] = useState({ priceA: '117', priceB: '172', barA: '40', barB: '68', hours: '4' });
  const update = key => value => setValues(previous => ({ ...previous, [key]: value }));
  const result = calculateProjection(values);
  return <div className="calculator-grid"><div>
    <p className="calculator-intro">{original.calculate.descriptions[0]}</p>
    <div className="number-grid">
      <NumberField id="priceA" label="Harga pivot A" value={values.priceA} onChange={update('priceA')} />
      <NumberField id="barA" label="Bar pivot A" value={values.barA} onChange={update('barA')} step="1" />
      <NumberField id="priceB" label="Harga pivot B" value={values.priceB} onChange={update('priceB')} />
      <NumberField id="barB" label="Bar pivot B" value={values.barB} onChange={update('barB')} step="1" />
      <label className="number-field" htmlFor="hours"><span>Durasi satu bar</span><select id="hours" name="hours" value={values.hours} onChange={event => update('hours')(event.target.value)}><option value="0.25">M15 (15 menit)</option><option value="1">H1 (1 jam)</option><option value="4">H4 (4 jam)</option><option value="24">D1 (1 hari)</option></select></label>
    </div>
    <button type="button" className="text-button sync-button" onClick={() => setValues(previous => ({ ...previous, priceA: swing.priceA.toFixed(1), priceB: swing.priceB.toFixed(1), barA: String(swing.barA), barB: String(swing.barB) }))}>Gunakan swing dari Lab</button>
  </div><div className="calculation-output projection-output" aria-live="polite" aria-atomic="true">
    {result.error ? <p className="calculation-error">{result.error}</p> : <>
      <dl className="result-list"><div><dt>Arah swing</dt><dd>{result.direction}</dd></div><div><dt>Skala (poin per bar)</dt><dd>{nf(result.scale, 3)}</dd></div><div><dt>Durasi swing</dt><dd>{result.duration} bar</dd></div><div><dt>Setara waktu</dt><dd>{duration(result.duration * Number(values.hours))}</dd></div></dl>
      <ProjectionTable caption="Proyeksi waktu" headers={['k × Δt', 'Bar', 'Setelah B']} rows={result.times.map(time => [nf(time.ratio, 3), nf(time.bar), duration(time.hours)])} />
      <ProjectionTable caption="Level retracement" headers={['Rasio', 'Harga']} rows={result.retracements.map(level => [nf(level.ratio, 3), nf(level.price, 2)])} />
      <p className="output-note">Proyeksi menjadi acuan pengamatan, bukan sinyal entry.</p>
    </>}
  </div></div>;
}

function RiskCalculator() {
  const [values, setValues] = useState({ balance: '10000', risk: '1', entry: '138.6', stop: '134.2', target: '161.4', pointValue: '100', lotStep: '0.01', winRate: '45' });
  const update = key => value => setValues(previous => ({ ...previous, [key]: value }));
  const result = calculateRisk(values);
  return <div className="calculator-grid"><div>
    <p className="calculator-intro">{original.calculate.descriptions[1]}</p>
    <div className="number-grid">
      <NumberField id="balance" label="Saldo akun ($)" value={values.balance} onChange={update('balance')} />
      <NumberField id="risk" label="Risiko per transaksi (%)" value={values.risk} onChange={update('risk')} step="0.1" max="100" />
      <NumberField id="entry" label="Entry" value={values.entry} onChange={update('entry')} />
      <NumberField id="stop" label="Stop loss" value={values.stop} onChange={update('stop')} />
      <NumberField id="target" label="Take profit" value={values.target} onChange={update('target')} />
      <NumberField id="pointValue" label="Nilai per poin per lot ($)" value={values.pointValue} onChange={update('pointValue')} />
      <label className="number-field winrate-field" htmlFor="winRate"><span>Perkiraan win rate: <output>{values.winRate}%</output></span><input id="winRate" name="winRate" aria-label="Perkiraan win rate" type="range" min="20" max="80" step="1" value={values.winRate} onChange={event => update('winRate')(event.target.value)} /></label>
    </div>
  </div><div className="calculation-output" aria-live="polite" aria-atomic="true">
    {result.error ? <p className="calculation-error">{result.error}</p> : <>
      <dl className="result-list">
        <div><dt>Batas risiko</dt><dd>${nf(result.budget, 2)}</dd></div>
        <div><dt>Risiko posisi</dt><dd>${nf(result.actualRisk, 2)}</dd></div>
        <div><dt>Ukuran posisi</dt><dd>{nf(result.lots, 2)} lot</dd></div>
        <div><dt>Risiko : imbal hasil</dt><dd>1 : {nf(result.rewardRisk, 2)}</dd></div>
        <div><dt>Win rate impas</dt><dd>{nf(result.breakEven)}%</dd></div>
        <div><dt>Ekspektasi per transaksi</dt><dd>{signed(result.expectancy)}R</dd></div>
      </dl>
      <p className="output-note">Lot dibulatkan ke bawah dalam kelipatan 0,01. Perhitungan belum mencakup spread dan komisi.</p>
    </>}
  </div></div>;
}

export default function Calculators() {
  const [active, setActive] = useState('projection');
  return <section id="hitung" className="section calculator-section"><div className="wrap">
    <div className="section-heading heading-grid"><h2>{original.calculate.heading}</h2><p className="section-description">{original.calculate.intro}</p></div>
    <div className="calculator-shell"><div className="calculator-tabs" aria-label="Pilih kalkulator">
      <button type="button" id="projection-tab" aria-pressed={active === 'projection'} aria-controls="calculator-panel" onClick={() => setActive('projection')}>{original.calculate.titles[0]}</button>
      <button type="button" id="risk-tab" aria-pressed={active === 'risk'} aria-controls="calculator-panel" onClick={() => setActive('risk')}>{original.calculate.titles[1]}</button>
    </div><div id="calculator-panel" role="region" aria-labelledby={active === 'projection' ? 'projection-tab' : 'risk-tab'}>{active === 'projection' ? <ProjectionCalculator /> : <RiskCalculator />}</div></div>
  </div></section>;
}
