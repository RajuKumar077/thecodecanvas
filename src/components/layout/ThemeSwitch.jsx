import { useRef } from 'react';
import { useTheme } from '../../hooks/useTheme';

const OPTIONS = [
  {
    value: 'light',
    label: 'Light',
    icon: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
      </>
    ),
  },
  {
    value: 'system',
    label: 'System',
    icon: (
      <>
        <rect x="3" y="4.5" width="18" height="12" rx="2.2" />
        <path d="M8.5 20h7M12 16.5V20" />
      </>
    ),
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.8 6.8 0 0 0 10.7 10.7Z" />,
  },
];

/**
 * Light · System · Dark — a three-way segmented control (ARIA radiogroup with
 * roving tabindex and arrow-key support). The thumb slides under the choice.
 */
export default function ThemeSwitch() {
  const { preference, setPreference } = useTheme();
  const groupRef = useRef(null);

  const onKeyDown = (e) => {
    const i = OPTIONS.findIndex((o) => o.value === preference);
    let n;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % OPTIONS.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i + OPTIONS.length - 1) % OPTIONS.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = OPTIONS.length - 1;
    else return;
    e.preventDefault();
    setPreference(OPTIONS[n].value);
    groupRef.current?.querySelectorAll('button')[n]?.focus();
  };

  return (
    <div
      ref={groupRef}
      className="theme-switch"
      role="radiogroup"
      aria-label="Colour theme"
      data-pref={preference}
      data-no-magnet
      onKeyDown={onKeyDown}
    >
      <span className="theme-switch__thumb" aria-hidden="true" />
      {OPTIONS.map(({ value, label, icon }) => {
        const checked = preference === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={label}
            title={`${label} theme`}
            tabIndex={checked ? 0 : -1}
            className="theme-switch__opt"
            onClick={() => setPreference(value)}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {icon}
            </svg>
          </button>
        );
      })}
    </div>
  );
}
