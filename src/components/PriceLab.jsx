import { useEffect, useRef, useState } from 'react';
import { candles, swing } from '../lib/market.js';
import { formatNumber as f } from '../lib/calculations.js';
import { original } from '../content.js';

const keys = {retr:'retracement',ext:'extension',cycle:'time',zones:'zones',square:'square',gann:'fan'};
const overlayOptions = original.lab.overlays.map(option => ({...option,key:keys[option.key]}));
const nf = (value, digits = 1) => Number.isFinite(value) ? f(value, digits) : '-';
const signed = (value, digits = 1) => (value > 0 ? '+' : value < 0 ? '−' : '') + nf(Math.abs(value), digits);

function StudyChart({ selected, setSelected, overlays }) {
  const container = useRef(null);
  const [width, setWidth] = useState(680);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(270, Math.round(entry.contentRect.width))));
    observer.observe(container.current); return () => observer.disconnect();
  }, []);
  const index = selected ?? 96;
  const height = width < 500 ? 290 : 340;
  const left = 14, right = width - 46, top = 34, bottom = height - 31;
  const x = bar => left + bar / 145 * (right - left);
  const y = price => bottom - (price - 85) / 120 * (bottom - top);
  const inspect = event => { const rect = event.currentTarget.getBoundingClientRect(); const bar = Math.round(((event.clientX - rect.left) / rect.width * width - left) / (right - left) * 145); setSelected(Math.max(0, Math.min(119, bar))); };
  const handleKey = event => {
    const next = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: 119 }[event.key];
    if (next !== undefined) { event.preventDefault(); setSelected(Math.max(0, Math.min(119, next))); }
  };
  return <div ref={container} className="study-chart">
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Chart simulasi Time & Price, bar ${selected}, harga ${f(candles[index].close)}. Gunakan panah kiri atau kanan untuk memilih bar.`} tabIndex="0" onKeyDown={handleKey} onPointerMove={event => { if (event.pointerType === 'mouse') inspect(event); }} onPointerDown={inspect}>
      <defs><clipPath id="plot-area"><rect x={left} y={top} width={right - left} height={bottom - top} /></clipPath></defs>
      {[100, 125, 150, 175, 200].map(price => <g key={price}><line x1={left} x2={right} y1={y(price)} y2={y(price)} className="chart-grid" /><text x={right + 9} y={y(price) + 4} className="chart-tick">{price}</text></g>)}
      {[0, 40, 68, 96, 119].map(bar => <g key={bar}><line x1={x(bar)} x2={x(bar)} y1={top} y2={bottom} className="chart-grid" /><text x={x(bar)} y={height - 8} textAnchor="middle" className="chart-tick">{bar}</text></g>)}
      <g clipPath="url(#plot-area)">
        {overlays.square && <rect x={x(swing.barA)} y={y(swing.priceB)} width={x(swing.barB + swing.duration) - x(swing.barA)} height={y(swing.priceA) - y(swing.priceB)} fill="#2340f0" fillOpacity=".045" stroke="#2340f0" strokeOpacity=".28" strokeDasharray="5 5" />}
        {overlays.zones && [5, 8, 13, 21, 34, 55].map(offset => <line key={offset} x1={x(swing.barA + offset)} x2={x(swing.barA + offset)} y1={top} y2={bottom} stroke="#2340f0" strokeOpacity=".14" strokeWidth="5" />)}
        {overlays.time && [0.618, 1, 1.618].map(ratio => <line key={ratio} x1={x(swing.barB + swing.duration * ratio)} x2={x(swing.barB + swing.duration * ratio)} y1={top} y2={bottom} stroke="#2340f0" strokeOpacity=".5" strokeDasharray="3 4" />)}
        {overlays.retracement && (width < 500 ? [0.5, 0.618] : [0.382, 0.5, 0.618, 0.786]).map(ratio => <g key={ratio}><line x1={x(swing.barA)} x2={right - 8} y1={y(swing.priceB - ratio * swing.delta)} y2={y(swing.priceB - ratio * swing.delta)} stroke="#343832" strokeOpacity=".3" strokeDasharray="4 4" /><text x={right - 11} y={y(swing.priceB - ratio * swing.delta) - 5} textAnchor="end" className="chart-tick">{f(ratio, 3)}</text></g>)}
        {overlays.extension && [1.272, 1.618].map(ratio => <g key={ratio}><line x1={x(swing.barA)} x2={right} y1={y(swing.priceA + swing.delta * ratio)} y2={y(swing.priceA + swing.delta * ratio)} stroke="#343832" strokeOpacity=".4" strokeDasharray="7 4" /><text x={x(43)} y={y(swing.priceA + swing.delta * ratio) - 5} className="chart-tick">{f(ratio, 3)}</text></g>)}
        {overlays.fan && [0.5, 1, 2].map(ratio => <line key={ratio} x1={x(swing.barB)} y1={y(swing.priceB)} x2={x(128)} y2={y(swing.priceB - 60 * swing.delta / swing.duration * ratio)} stroke="#2340f0" strokeOpacity={ratio === 1 ? '.6' : '.25'} />)}
        {candles.map(candle => { const up = candle.close >= candle.open; return <g key={candle.bar} opacity={selected !== null && candle.bar > selected ? '.17' : '1'}><line x1={x(candle.bar)} x2={x(candle.bar)} y1={y(candle.high)} y2={y(candle.low)} stroke={up ? '#2340f0' : '#272b27'} strokeWidth="1" /><rect x={x(candle.bar) - Math.max(1, (right - left) / 145 * 0.27)} y={y(Math.max(candle.open, candle.close))} width={Math.max(2, (right - left) / 145 * 0.54)} height={Math.max(1.5, Math.abs(y(candle.close) - y(candle.open)))} fill={up ? '#2340f0' : '#272b27'} /></g>; })}
        {selected !== null && <g><line x1={x(selected)} x2={x(selected)} y1={top} y2={bottom} stroke="#2340f0" strokeOpacity=".8" />
        <circle cx={x(selected)} cy={y(candles[index].close)} r="4.5" fill="#2340f0" stroke="#f2f3f0" strokeWidth="2" /></g>}
      </g>
      {overlays.time && [0.618, 1, 1.618].map(ratio => <text key={ratio} x={x(swing.barB + swing.duration * ratio)} y={top - 10} className="chart-time" textAnchor="middle">{width > 520 ? `${f(ratio, 3)}×` : ratio === 1 ? '1×' : ''}</text>)}
      <text x={x(swing.barA)} y={y(swing.priceA) + 24} textAnchor="middle" className="chart-pivot">L</text><text x={x(swing.barB)} y={y(swing.priceB) - 12} textAnchor="middle" className="chart-pivot">H</text>
    </svg>
  </div>;
}

export default function PriceLab() {
  const [selected, setSelected] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [overlays, setOverlays] = useState({ retracement: true, time: true, square: true, extension: false, zones: false, fan: false });
  useEffect(() => {
    if (!playing) return undefined;
    const timer = setInterval(() => setSelected(bar => Math.min(119, (bar ?? 0) + 1)), 280);
    return () => clearInterval(timer);
  }, [playing]);
  useEffect(() => { if (selected >= 119) setPlaying(false); }, [selected]);
  const selectBar = bar => { setPlaying(false); setSelected(bar); };
  const candle = selected === null ? null : candles[selected], dt = selected === null ? null : selected - swing.barB;
  const labels = ['Bar','Harga','Waktu sejak High','Rasio waktu (k)','Jarak dari High','Retracement (r)','Selisih ke garis 1×1'];
  const values = candle ? [selected,nf(candle.close),(dt >= 0 ? '+' : '−') + Math.abs(dt) + ' bar',nf(dt / swing.duration,2),signed(candle.close - swing.priceB),nf((swing.priceB - candle.close) / swing.delta,3),dt >= 0 ? signed(candle.close - (swing.priceB - swing.delta / swing.duration * dt)) : 'sebelum High'] : labels.map(() => '-');
  return <section id="lab" className="lab-section section"><div className="wrap">
    <div className="section-heading grid gap-6 md:grid-cols-2 md:items-end"><h2>{original.lab.heading}</h2><p className="section-description md:ml-auto">{original.lab.intro}</p></div>
    <div className="lab-shell"><div className="lab-grid"><div className="lab-main">
      <div className="overlay-controls" aria-label="Pilih overlay">{overlayOptions.map((option,index) => <span className="overlay-option" key={option.key}>{index % 2 === 0 && <span className="overlay-group">{['Harga','Waktu','Keselarasan'][index / 2]}</span>}<label><input type="checkbox" checked={overlays[option.key]} onChange={() => setOverlays(previous => ({...previous,[option.key]:!previous[option.key]}))} /><span>{option.label}</span></label></span>)}</div>
      <StudyChart selected={selected} setSelected={selectBar} overlays={overlays} />
      <div className="replay-controls"><button type="button" className="replay-button" aria-pressed={playing} aria-label={playing ? 'Jeda replay' : 'Putar ulang'} onClick={() => { if (playing) setPlaying(false); else { setSelected(0); setPlaying(true); } }}><span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span>Putar ulang</button><label className="bar-control">Bar <input type="range" min="0" max="119" step="1" value={selected ?? 96} onChange={event => selectBar(Number(event.target.value))} aria-label="Pilih bar chart" /><output>{selected ?? '-'}</output></label></div>
    </div><aside className="lab-reading original-readout"><h3 className="reading-title">Di bawah kursor</h3><dl aria-live="polite" aria-atomic="true">{labels.map((label,index) => <div key={label}><dt>{label}</dt><dd>{values[index]}</dd></div>)}</dl><p className="reading-note">Swing naik dari bar <b>{swing.barA}</b> ({nf(swing.priceA)}) ke bar <b>{swing.barB}</b> ({nf(swing.priceB)}).<br />ΔP = {nf(swing.delta)}, Δt = {swing.duration} bar, jadi s = {nf(swing.delta / swing.duration,2)} poin per bar.<br /><br />Koreksi berakhir di bar <b>{swing.correctionBar}</b>, yaitu <span>{nf((swing.correctionBar - swing.barB) / swing.duration,2)}×Δt</span> setelah high, pada retracement <b>{nf((swing.priceB - swing.correctionPrice) / swing.delta,3)}</b>. Waktu hampir persis 1,0×Δt, harga di sekitar 0,618. Itu contoh keselarasan price-time.</p></aside></div></div>
  </div></section>;
}