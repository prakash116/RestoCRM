/**
 * Social marks.
 *
 * Drawn inline because lucide v1 no longer ships brand glyphs, and pulling a
 * second icon package for four shapes is not worth the bytes. Each is a single
 * `currentColor` path so it inherits the surrounding text colour.
 */

type IconProps = { className?: string };

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M3 3h4.2l5 6.7L17.9 3H21l-7.1 8.2L21.4 21h-4.2l-5.3-7.1L5.6 21H2.5l7.5-8.6L3 3Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="4" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M7.2 10.2v7M7.2 7.1v.05M11.4 17v-3.9c0-1.2.9-2.1 2-2.1s2 .9 2 2.1V17M11.4 10.2V17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function YouTubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="2" y="5" width="20" height="14" rx="4.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M10.4 9.4v5.2l4.4-2.6-4.4-2.6Z" fill="currentColor" />
    </svg>
  );
}
