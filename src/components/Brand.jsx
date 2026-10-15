export function OrbitalMark({ className = '', decorative = true }) {
  return <svg className={className} viewBox="0 0 400 400" fill="none" role={decorative ? undefined : 'img'} aria-hidden={decorative || undefined} aria-label={decorative ? undefined : 'Logo Xerion Capital, huruf X dengan jam dan orbit'}>
    <circle cx="200" cy="205" r="184" stroke="currentColor" opacity=".13" />
    <circle cx="200" cy="205" r="162" stroke="currentColor" strokeDasharray="2 8" opacity=".2" />
    <text x="200" y="321" textAnchor="middle" fontFamily="Bodoni Moda,Didot,Georgia,serif" fontSize="330" fontWeight="500" fill="currentColor">X</text>
    <path d="M145 208a55 55 0 0 1 110 0" stroke="currentColor" strokeWidth="2" />
    {[0, 30, 60, 90, 120, 150, 180].map(angle => <path key={angle} d="M147 208h7" stroke="currentColor" strokeWidth="2" transform={`rotate(${angle} 200 208)`} />)}
    <path d="m200 208 29-33" stroke="var(--background, #000)" strokeWidth="8" strokeLinecap="round" />
    <path d="m200 208 29-33" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <circle cx="200" cy="208" r="4" fill="currentColor" />
    <g transform="translate(200 214) rotate(-18)">
      <ellipse rx="169" ry="44" stroke="var(--background, #000)" strokeWidth="13" />
      <ellipse rx="169" ry="44" stroke="currentColor" strokeWidth="4.3" />
      <circle cx="165" cy="-9" r="12" fill="var(--accent, #8da0ff)" opacity=".18" />
      <circle cx="165" cy="-9" r="5" fill="var(--accent, #8da0ff)" />
    </g>
  </svg>;
}

export default function Brand() {
  return <a className="brand" href="#beranda" aria-label="Xerion Capital, beranda"><OrbitalMark /><span className="brand-word">Xerion<span>Capital</span></span></a>;
}

export function Arrow({ diagonal = false, className = '' }) {
  return <svg className={`arrow ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{diagonal ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}</svg>;
}

export function Check() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>;
}
