import AnimatedText from './AnimatedText';
import { sectionIndex } from '../../data/portfolio';

/**
 * Consistent section heading: numbered eyebrow, split-text title
 * (second line muted) and an optional lede in the right-hand columns.
 */
export default function SectionHeading({ id, eyebrow, lines, lede, titleId }) {
  return (
    <header className="section-head">
      <p className="section-head__eyebrow t-eyebrow">
        <b>{sectionIndex(id)}</b> {eyebrow}
      </p>
      <AnimatedText
        as="h2"
        id={titleId}
        className="section-title"
        lines={lines}
        lineClassNames={['', 'is-muted']}
        accentPeriod
      />
      {lede ? (
        <p className="section-lede" data-reveal>
          {lede}
        </p>
      ) : null}
    </header>
  );
}
