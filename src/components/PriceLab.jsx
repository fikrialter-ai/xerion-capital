import { useEffect, useRef, useState } from 'react';
import { candles, swing } from '../lib/market.js';
import { formatNumber as f } from '../lib/calculations.js';
import { original } from '../content.js';
import { describeLabBar } from '../lib/lab-explanation.js';

const nf = (value, digits = 1) => Number.isFinite(value) ? f(value, digits) : '—';
const signed = (value, digits = 1) => (value > 0 ? '+' : value < 0 ? '−' : '') + nf(Math.abs(value), digits);
const timeRatios = [0.618, 1, 1.618];

function StudyChart({ selected, setSelected, overlays }) {
  const container = useRef(null);
  const [width, setWidth] = useState(680);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(270, Math.round(entry.contentRect.width))));
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const height = width < 500 ? 290 : 340;
  const left = 14, right = width - 46, top = 34, bottom = height - 31;
  const x = bar => left + bar / 145 * (right - left);
  const maximumPrice = overlays.ext ? Math.max(205, Math.ceil((swing.priceA + swing.delta * 1.618 + 8) / 25) * 25) : 205;
  const priceTicks = Array.from({ length: Math.floor((maximumPrice - 100) / 25) + 1 }, (_, index) => 100 + index * 25);
  const y = price => bottom - (price - 85) / (maximumPrice - 85) * (bottom - top);
  function inspect(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const bar = Math.round(((event.clientX - rect.left) / rect.width * width - left) / (right - left) * 145);
    setSelected(Math.max(0, Math.min(candles.length - 1, bar)));
  }
  function handleKey(event) {
    const next = { ArrowLeft: selected - 1, ArrowRight: selected + 1, Home: 0, End: candles.length - 1 }[event.key];
    if (next !== undefined) { event.preventDefault(); setSelected(Math.max(0, Math.min(candles.length - 1, next))); }
  }
  return <div ref={container} className="study-chart">
    <svg viewBox={`0 0 ${width} ${height}`} role="slider" aria-label="Chart simulasi Time & Price" aria-valuemin="0" aria-valuemax={candles.length - 1} aria-valuenow={selected} aria-valuetext={`Bar ${selected}, harga ${nf(candles[selected].close)}`} aria-orientation="horizontal" tabIndex="0" onKeyDown={handleKey} onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); inspect(event); }} onPointerMove={event => { if (event.buttons === 1) inspect(event); }}>
      <defs><clipPath id="plot-area"><rect x={left} y={top} width={right - left} height={bottom - top} /></clipPath></defs>
      {priceTicks.map(price => <g key={price}><line x1={left} x2={right} y1={y(price)} y2={y(price)} className="chart-grid" /><text x={right + 9} y={y(price) + 4} className="chart-tick">{price}</text></g>)}
      {[0, 40, 68, 96, 119].map(bar => <text key={bar} x={x(bar)} y={height - 8} textAnchor="middle" className="chart-tick">{bar}</text>)}
      <g clipPath="url(#plot-area)">
        {overlays.square && <rect x={x(swing.barA)} y={y(swing.priceB)} width={x(swing.barB + swing.duration) - x(swing.barA)} height={y(swing.priceA) - y(swing.priceB)} fill="var(--foreground)" fillOpacity=".04" stroke="var(--muted)" strokeOpacity=".7" strokeDasharray="5 5" />}
        {overlays.zones && <g data-overlay="zones">{[5, 8, 13, 21, 34, 55].map(offset => <line key={offset} x1={x(swing.barA + offset)} x2={x(swing.barA + offset)} y1={top} y2={bottom} stroke="var(--chart-time)" strokeOpacity=".18" strokeWidth="5" />)}</g>}
        {overlays.cycle && timeRatios.map(ratio => <line key={ratio} x1={x(swing.barB + swing.duration * ratio)} x2={x(swing.barB + swing.duration * ratio)} y1={top} y2={bottom} stroke="var(--chart-time)" strokeDasharray="3 4" />)}
        {overlays.retr && (width < 500 ? [0.5, 0.618] : [0.382, 0.5, 0.618, 0.786]).map(ratio => <g key={ratio}><line x1={x(swing.barA)} x2={right - 8} y1={y(swing.priceB - ratio * swing.delta)} y2={y(swing.priceB - ratio * swing.delta)} stroke="var(--muted)" strokeDasharray="4 4" /><text x={right - 11} y={y(swing.priceB - ratio * swing.delta) - 5} textAnchor="end" className="chart-tick">{f(ratio, 3)}</text></g>)}
        {overlays.ext && <g data-overlay="ext">{[1.272, 1.618].map(ratio => <g key={ratio}><line x1={x(swing.barA)} x2={right - 8} y1={y(swing.priceA + swing.delta * ratio)} y2={y(swing.priceA + swing.delta * ratio)} stroke="var(--foreground)" strokeOpacity=".7" strokeDasharray="8 5" /><text x={right - 11} y={y(swing.priceA + swing.delta * ratio) - 5} textAnchor="end" className="chart-tick">{f(ratio, 3)}</text></g>)}</g>}
        {overlays.gann && <g data-overlay="gann">{[0.5, 1, 2].map(ratio => <line key={ratio} x1={x(swing.barB)} y1={y(swing.priceB)} x2={x(128)} y2={y(swing.priceB - (128 - swing.barB) * swing.delta / swing.duration * ratio)} stroke="var(--foreground)" strokeOpacity={ratio === 1 ? '.7' : '.4'} strokeDasharray={ratio === 1 ? undefined : '2 3'} />)}</g>}
        {candles.map(candle => {
          const up = candle.close >= candle.open;
          const halfWidth = Math.max(1, (right - left) / 145 * 0.27);
          return <g key={candle.bar}>
            <line x1={x(candle.bar)} x2={x(candle.bar)} y1={y(candle.high)} y2={y(candle.low)} stroke={up ? 'var(--chart-up)' : 'var(--chart-down)'} />
            <rect x={x(candle.bar) - halfWidth} y={y(Math.max(candle.open, candle.close))} width={halfWidth * 2} height={Math.max(1.5, Math.abs(y(candle.close) - y(candle.open)))} fill={up ? 'var(--subtle)' : 'var(--chart-down)'} stroke={up ? 'var(--chart-up)' : 'var(--chart-down)'} />
          </g>;
        })}
        <line x1={x(selected)} x2={x(selected)} y1={top} y2={bottom} stroke="var(--foreground)" strokeOpacity=".6" />
        <circle cx={x(selected)} cy={y(candles[selected].close)} r="4" fill="var(--foreground)" stroke="var(--subtle)" strokeWidth="2" />
      </g>
      {overlays.cycle && timeRatios.map(ratio => <text key={ratio} x={x(swing.barB + swing.duration * ratio)} y={top - 10} className="chart-time" textAnchor="middle">{width > 520 ? `${f(ratio, 3)}×` : ratio === 1 ? '1×' : ''}</text>)}
      <text x={x(swing.barA)} y={y(swing.priceA) + 24} textAnchor="middle" className="chart-pivot">L</text><text x={x(swing.barB)} y={y(swing.priceB) - 12} textAnchor="middle" className="chart-pivot">H</text>
    </svg>
  </div>;
}

export default function PriceLab() {
  const [selected, setSelected] = useState(swing.correctionBar);
  const [overlays, setOverlays] = useState({ retr: true, ext: false, cycle: true, zones: false, square: true, gann: false });
  const candle = candles[selected];
  const explanation = describeLabBar(candle, swing);
  const dt = selected - swing.barB;
  const labels = ['Bar', 'Harga', 'Bar sejak high', 'Rasio waktu (k)', 'Jarak dari high', 'Retracement (r)', 'Selisih ke garis 1×1'];
  const values = [selected, nf(candle.close), signed(dt, 0), nf(dt / swing.duration, 2), signed(candle.close - swing.priceB), nf((swing.priceB - candle.close) / swing.delta, 3), dt >= 0 ? signed(candle.close - (swing.priceB - swing.delta / swing.duration * dt)) : 'Sebelum high'];
  return <section id="lab" className="lab-section section"><div className="wrap">
    <div className="section-heading heading-grid"><h2>{original.lab.heading}</h2><p className="section-description">{original.lab.intro}</p></div>
    <div className="lab-shell"><div className="lab-grid"><div className="lab-main">
      <div className="overlay-controls" role="group" aria-label="Pilih overlay">{original.lab.overlays.map(option => <label key={option.key}><input type="checkbox" checked={overlays[option.key]} onChange={() => setOverlays(previous => ({ ...previous, [option.key]: !previous[option.key] }))} /><span>{option.label}</span></label>)}</div>
      <StudyChart selected={selected} setSelected={setSelected} overlays={overlays} />
      <label className="bar-control">Bar <input type="range" min="0" max={candles.length - 1} step="1" value={selected} onChange={event => setSelected(Number(event.target.value))} aria-label="Pilih bar chart" /><output>{selected}</output></label>
      <p className="chart-help">Klik atau geser chart. Gunakan tombol panah untuk berpindah bar.</p>
    </div><aside className="lab-reading"><h3>Detail bar</h3><dl>{labels.map((label, index) => <div key={label}><dt>{label}</dt><dd>{values[index]}</dd></div>)}</dl><p className="reading-note">Swing acuan: bar {swing.barA}–{swing.barB}.<br />ΔP {nf(swing.delta)} · Δt {swing.duration} bar.</p></aside></div></div>
    <div className="lab-explanation" aria-labelledby="lab-explanation-heading">
      <h3 id="lab-explanation-heading">Memahami bar {selected}</h3>
      <p className="lab-reference">Swing acuan naik dari low {nf(swing.priceA)} di bar {swing.barA} ke high {nf(swing.priceB)} di bar {swing.barB}: perubahan {nf(swing.delta)} poin dalam {swing.duration} bar. Pembacaan bar menggunakan harga penutupan candle.</p>
      <div className="lab-explanation-grid">
        <div><h4>Harga</h4><p>{explanation.price}</p></div>
        <div><h4>Waktu</h4><p>{explanation.time}</p></div>
        <div><h4>Keselarasan harga–waktu</h4><p>{explanation.alignment}{!overlays.gann && ' Aktifkan Gann Fan untuk melihat garis 1×1 di chart.'}</p></div>
      </div>
      <a className="lab-calculator-link" href="#hitung">Coba proyeksi dan hitung risiko dengan data Anda</a>
    </div>
  </div></section>;
}
