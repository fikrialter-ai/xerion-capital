import { original } from '../content.js';

export default function Results() {
  const content = original.results;
  return <section id="hasil" className="section results-section"><div className="wrap">
    <div className="section-heading"><h2>{content.heading}</h2><p className="results-intro">{content.intro}</p></div>
    <div className="original-journal"><h3 id="journal-heading">{content.journalHeading}</h3><p className="results-note" id="journal-description">{content.journalDescription}</p>
      <div className="journal-scroll" role="region" aria-labelledby="journal-heading" tabIndex="0"><table aria-labelledby="journal-heading" aria-describedby="journal-description">
        <thead><tr>{content.headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead>
        <tbody>{content.rows.map((row, index) => <tr key={index}>{row.map((cell, column) => <td key={column}>{cell}</td>)}</tr>)}</tbody>
      </table></div>
    </div>
  </div></section>;
}
