import { useEffect, useRef, useState } from 'react';
import Brand, { Arrow, Check, OrbitalMark } from './components/Brand.jsx';
import Curriculum from './components/Curriculum.jsx';
import PriceLab from './components/PriceLab.jsx';
import Calculators from './components/Calculators.jsx';
import Results from './components/Results.jsx';
import { original, faqs, programs, whatsappLink } from './content.js';

const navigation = [{ href: '#metode', text: 'Methode' }, { href: '#lab', text: 'Time & Price Lab' }, { href: '#hitung', text: 'calculate' }, { href: '#hasil', text: 'result' }, { href: '#kurikulum', text: 'material' }, { href: '#program', text: 'program' }];

function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
  const menuButton = useRef(null), header = useRef(null);
  useEffect(() => {
    const onKey = event => { if (event.key === 'Escape' && open) { setOpen(false); menuButton.current?.focus(); } };
    const onPointer = event => { if (open && !header.current?.contains(event.target)) setOpen(false); };
    const media = matchMedia('(min-width: 1024px)');
    const closeDesktop = () => { if (media.matches) setOpen(false); };
    document.addEventListener('keydown', onKey); document.addEventListener('pointerdown', onPointer);
    media.addEventListener('change', closeDesktop);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onPointer); media.removeEventListener('change', closeDesktop); };
  }, [open]);
  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'; setTheme(next);
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]').setAttribute('content', next === 'dark' ? '#000000' : '#f2f3f0');
    try { localStorage.setItem('xerion-theme', next); } catch { /* Theme remains usable without storage. */ }
  }
  return <header className="site-header" ref={header}><div className="wrap header-inner"><Brand /><nav className="desktop-navigation" aria-label="Navigasi utama">{navigation.map(item => <a key={item.href} href={item.href}>{item.text}</a>)}</nav><div className="header-actions"><button type="button" className="theme-button" onClick={toggleTheme} aria-label="Ganti tema terang atau gelap" title="Ganti tema"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" /></svg></button><a className="button button-small header-consult" href={whatsappLink()} target="_blank" rel="noopener noreferrer">Daftar <Arrow diagonal /></a><button ref={menuButton} type="button" className="menu-button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Tutup menu' : 'Buka menu'} onClick={() => setOpen(value => !value)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{open ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 8h16M4 16h16" />}</svg></button></div></div>
    <nav id="mobile-navigation" className="mobile-navigation" aria-label="Navigasi ponsel" hidden={!open}>{navigation.map(item => <a href={item.href} key={item.href} onClick={() => setOpen(false)}>{item.href === '#program' ? 'Program' : item.text}<Arrow /></a>)}<a className="mobile-consult" href={whatsappLink()} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Daftar <Arrow diagonal /></a></nav>
  </header>;
}

function Hero() {
  return <section id="beranda" className="hero-section original-hero"><div className="wrap"><div className="hero-grid">
    <div className="hero-copy"><h1>{original.hero.lines.map((line, index) => <span key={line} className={index ? 'original-time-line' : ''}>{line}{index === 0 ? ' ' : ''}</span>)}</h1><p className="hero-description">{original.hero.description}</p><div className="hero-buttons"><a className="button" href="#program">{original.hero.ctas[0]} <Arrow /></a><a className="button button-outline" href="#lab">{original.hero.ctas[1]}</a></div></div>
    <div className="hero-study" aria-label="Logo Xerion Capital: huruf X dengan jam dan orbit" role="img"><div className="study-axis axis-horizontal" /><div className="study-axis axis-vertical" /><div className="orbital-stage"><OrbitalMark decorative /></div><span className="study-point point-a" /><span className="study-point point-b" /></div>
  </div></div></section>;
}

function Approach() {
  return <section id="metode" className="section approach-section"><div className="wrap"><div className="section-heading grid gap-6 md:grid-cols-2 md:items-end"><h2>{original.method.heading}</h2><p className="section-description md:ml-auto">{original.method.intro}</p></div><div className="original-equations">{original.method.equations.map(equation => <article key={equation.title}><h3><span className="small-dot" />{equation.title}</h3><div className="original-formula" dangerouslySetInnerHTML={{__html: equation.formula}} /><p>{equation.description}</p></article>)}</div></div></section>;
}

function Programs() {
  return <section id="program" className="section programs-section"><div className="wrap"><div className="section-heading"><h2>{original.program.heading}</h2></div><div className="program-grid">{programs.map((program, index) => <article className={`program-card ${program.featured ? 'featured' : ''}`} key={program.name}><h3>{program.name}</h3><div className={`program-price ${index === 2 ? 'stage-price' : ''}`}>{program.price}</div>{program.period && <p className="program-period">{program.period}</p>}<ul>{program.features.map(feature => <li key={feature}><Check /><span>{feature}</span></li>)}</ul><div className="program-bottom"><a className={`button ${program.featured ? '' : 'button-outline'}`} href={program.href} target="_blank" rel="noopener noreferrer">{program.cta}<Arrow diagonal /></a></div></article>)}</div></div></section>;
}

function FAQ() {
  return <section id="faq" className="section faq-section"><div className="wrap faq-grid"><h2>{original.faq.heading}</h2><div className="faq-list">{faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span className="faq-toggle" aria-hidden="true" /></summary><p>{faq.answer}</p></details>)}</div></div></section>;
}

function Footer() {
  return <><section className="closing-section"><div className="wrap closing-inner"><div><h2>{original.closing.heading}</h2><a className="button" href={whatsappLink()} target="_blank" rel="noopener noreferrer">{original.closing.cta} <Arrow diagonal /></a></div><OrbitalMark className="closing-mark" /></div></section><footer className="site-footer"><div className="wrap"><p className="risk-disclosure">{original.footer.risk}</p><div className="footer-bottom"><span>{original.footer.copyright}</span></div></div></footer></>;
}

export default function App() {
  return <><a className="skip-link" href="#konten">Lewati ke konten utama</a><Header /><main id="konten"><Hero /><Approach /><PriceLab /><Calculators /><Results /><Curriculum /><Programs /><FAQ /></main><Footer /></>;
}
