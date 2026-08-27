import { useState } from 'react';

// Inline SVG fallback — used if logo_main.png cannot be loaded
// (e.g. when the single-file build is viewed without the assets folder).
const FALLBACK =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>` +
      `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
      `<stop offset='0' stop-color='#3046aa'/><stop offset='1' stop-color='#4a1460'/>` +
      `</linearGradient></defs>` +
      `<rect width='64' height='64' rx='16' fill='url(#g)'/>` +
      `<circle cx='22' cy='26' r='5' fill='rgba(255,255,255,0.9)'/>` +
      `<circle cx='42' cy='40' r='4' fill='rgba(255,255,255,0.65)'/>` +
      `<line x1='25' y1='28' x2='39' y2='38' stroke='rgba(255,255,255,0.55)' stroke-width='2'/>` +
      `</svg>`,
  );

export default function BrandImg({ className, alt = 'Catalytica logo' }: { className?: string; alt?: string }) {
  const [err, setErr] = useState(false);
  return (
    <img
      src={err ? FALLBACK : 'logo_main.png'}
      alt={alt}
      className={className}
      onError={() => {
        if (!err) setErr(true);
      }}
    />
  );
}
