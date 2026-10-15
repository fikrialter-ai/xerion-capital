import { useState } from 'react';
import { original } from '../content.js';
import { Arrow } from './Brand.jsx';

export default function Curriculum() {
  const [active, setActive] = useState(0);
  const course = original.curriculum, lesson = course.items[active];
  return <section id="kurikulum" className="section curriculum-section"><div className="wrap">
    <div className="section-heading grid gap-6 md:grid-cols-2 md:items-end"><h2>{course.heading}</h2><p className="section-description md:ml-auto">{course.intro}</p></div>
    <div className="curriculum-grid"><div className="month-list" aria-label="Pilih materi">{course.items.map((item, index) => <button type="button" id={`month-${index}`} key={item.numeral} aria-pressed={active === index} aria-controls="lesson-panel" className={`month-button ${active === index ? 'selected' : ''}`} onClick={() => setActive(index)}><span className="month-number">{item.numeral}</span><span>{item.title}</span><Arrow /></button>)}</div><div id="lesson-panel" className="lesson-panel" role="region" aria-labelledby={`month-${active}`} aria-live="polite"><h3>{lesson.title}</h3><div className="original-lesson" dangerouslySetInnerHTML={{__html:lesson.body}} /><div className="lesson-progress" aria-hidden="true">{course.items.map((_, index) => <span key={index} className={index <= active ? 'filled' : ''} />)}</div></div></div>
  </div></section>;
}
