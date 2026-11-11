import { Fragment, createElement } from 'react';

/**
 * Splits text into line → word masks so GSAP can reveal each word.
 * Screen readers get the whole sentence via aria-label; the split
 * markup itself is hidden from assistive tech.
 *
 * Targets for animation: `.at-word` (inside an overflow-hidden `.at-mask`).
 */
export default function AnimatedText({ as = 'p', lines, className = '', lineClassNames = [], accentPeriod = false, ...rest }) {
  const text = lines.join(' ');
  const lastLine = lines.length - 1;

  return createElement(
    as,
    { ...rest, className: `at ${className}`.trim(), 'aria-label': text },
    lines.map((line, li) => {
      const words = line.split(' ');
      return (
        <span key={li} className={`at-line ${lineClassNames[li] ?? ''}`.trim()} aria-hidden="true">
          {words.map((word, wi) => {
            const isLast = accentPeriod && li === lastLine && wi === words.length - 1 && word.endsWith('.');
            return (
              <Fragment key={wi}>
                <span className="at-mask">
                  <span className="at-word">
                    {isLast ? (
                      <>
                        {word.slice(0, -1)}
                        <span className="at-accent">.</span>
                      </>
                    ) : (
                      word
                    )}
                  </span>
                </span>
                {wi < words.length - 1 ? ' ' : null}
              </Fragment>
            );
          })}
        </span>
      );
    }),
  );
}
