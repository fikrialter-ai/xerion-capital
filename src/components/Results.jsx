import { useEffect, useRef, useState } from 'react';
import { original } from '../content.js';
import { mulberry32 } from '../lib/market.js';
import { formatNumber as f } from '../lib/calculations.js';

const random = mulberry32(2026);
const trades = Array.from({length:120},()=>random()<.48?1.2+random()*1.4:-(random()<.8?1:.5+random()*.4));
const equity=[0]; trades.forEach(value=>equity.push(equity[equity.length-1]+value));
const wins=trades.filter(value=>value>0),losses=trades.filter(value=>value<0);
const grossProfit=wins.reduce((sum,value)=>sum+value,0),grossLoss=Math.abs(losses.reduce((sum,value)=>sum+value,0));
let peak=0,drawdown=0; equity.forEach(value=>{peak=Math.max(peak,value);drawdown=Math.max(drawdown,peak-value);});
const signed=(value,digits=1)=>(value>0?'+':value<0?'−':'')+f(Math.abs(value),digits);
const months=['Nov','Des','Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt'].map((label,index)=>({label,value:trades.slice(index*10,(index+1)*10).reduce((sum,value)=>sum+value,0)}));
const facts=[['Total hasil',signed(equity.at(-1))+'R'],['Jumlah trade','120'],['Win rate',f(wins.length/120*100,0)+'%'],['Rata-rata menang / kalah',f(grossProfit/wins.length,1)+'R / '+f(grossLoss/losses.length,1)+'R'],['Profit factor',f(grossProfit/grossLoss,2)],['Drawdown maksimum',f(drawdown,1)+'R'],['Ekspektasi per trade',signed(equity.at(-1)/120,2)+'R']];

export default function Results() {
  const [hover,setHover]=useState(null);
  const container=useRef(null), [width,setWidth]=useState(690);
  useEffect(()=>{ const observer=new ResizeObserver(([entry])=>setWidth(Math.max(200,Math.round(entry.contentRect.width)))); observer.observe(container.current); return ()=>observer.disconnect(); },[]);
  const content=original.results;
  const minimum=Math.min(0,...equity)-5,maximum=Math.max(...equity)+5;
  const x=index=>20+index/120*(width-65),y=value=>250-(value-minimum)/(maximum-minimum)*215;
  const points=equity.map((value,index)=>`${x(index)},${y(value)}`).join(' ');
  const inspect=event=>{const rect=event.currentTarget.getBoundingClientRect();setHover(Math.max(0,Math.min(120,Math.round(((event.clientX-rect.left)/rect.width*width-20)/(width-65)*120))));};
  return <section id="hasil" className="section results-section"><div className="wrap"><div className="section-heading"><h2>{content.heading}</h2><p className="results-intro" dangerouslySetInnerHTML={{__html:content.intro}} /></div><div className="results-grid"><dl className="original-facts">{facts.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div><div className="equity-chart" ref={container}><p>{hover===null?'Kurva ekuitas dalam R':<>Trade <b>{hover}</b>: <b>{signed(equity[hover])}R</b> kumulatif{hover>0?`, trade ini ${signed(trades[hover-1])}R`:''}</>}</p><svg viewBox={`0 0 ${width} 290`} role="img" aria-label="Kurva ekuitas dalam satuan R" onPointerMove={inspect} onPointerDown={inspect} onPointerLeave={()=>setHover(null)}>{[0,10,20,30,40,50].map(value=><g key={value}><line x1="20" x2={width-45} y1={y(value)} y2={y(value)} className="equity-grid" /><text x={width-36} y={y(value)+4}>{value}R</text></g>)}<polygon points={`20,${y(0)} ${points} ${width-45},${y(0)}`} fill="var(--accent)" opacity=".1" /><polyline points={points} stroke="currentColor" strokeWidth="2" fill="none" />{hover!==null&&<g><line x1={x(hover)} x2={x(hover)} y1="35" y2="250" stroke="var(--accent)" strokeDasharray="3 3"/><circle cx={x(hover)} cy={y(equity[hover])} r="4" fill="var(--accent)"/></g>}<text x={width/2} y="280" textAnchor="middle">Trade ke-</text>{[0,30,90,120].map(index=><text key={index} x={x(index)} y="280" textAnchor="middle">{index}</text>)}</svg></div><div className="results-months" aria-label="Hasil per bulan dalam R">{months.map(month=><div key={month.label} className={month.value<0?'loss':''}><span>{month.label}</span><strong>{signed(month.value)}</strong></div>)}</div><p className="results-note">{content.monthNote}</p></div></div><div className="original-journal"><h3>{content.journalHeading}</h3><p className="results-note">{content.journalDescription}</p><div className="journal-scroll"><table><thead><tr>{content.headers.map(header=><th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{content.rows.map((row,index)=><tr key={index}>{row.map((cell,column)=><td key={column}>{cell}</td>)}</tr>)}</tbody></table></div></div><div className="original-quotes"><h3 dangerouslySetInnerHTML={{__html:content.memberHeading}} /><div>{content.quotes.map(quote=><figure key={quote.author}><blockquote>{quote.quote}</blockquote><figcaption>{quote.author}</figcaption></figure>)}</div></div></div></section>;
}
