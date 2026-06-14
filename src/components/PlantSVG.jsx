export default function PlantSVG({ size = 170 }) {
  return (
    <svg width={size} height={size * 1.12} viewBox="0 0 170 190" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 2 }}>
      <ellipse cx="85" cy="182" rx="32" ry="6" fill="rgba(34,197,94,0.07)" />
      <rect x="68" y="150" width="34" height="28" rx="5" fill="#1a2e20" />
      <rect x="64" y="145" width="42" height="9" rx="4" fill="#22C55E" opacity="0.35" />
      <rect x="76" y="94" width="9" height="54" rx="4" fill="#16a34a" />
      <ellipse cx="81" cy="80" rx="30" ry="24" fill="#22C55E" />
      <ellipse cx="57" cy="92" rx="18" ry="14" fill="#16a34a" />
      <ellipse cx="107" cy="90" rx="18" ry="14" fill="#16a34a" />
      <ellipse cx="81" cy="63" rx="20" ry="16" fill="#4ADE80" />
      <ellipse cx="63" cy="76" rx="13" ry="10" fill="#4ADE80" opacity="0.8" />
      <ellipse cx="100" cy="74" rx="13" ry="10" fill="#4ADE80" opacity="0.8" />
      <circle cx="71" cy="83" r="5" fill="#86EFAC" opacity="0.55" />
      <circle cx="93" cy="79" r="4" fill="#86EFAC" opacity="0.45" />
      <circle cx="81" cy="66" r="3.5" fill="#dcfce7" opacity="0.45" />
    </svg>
  )
}
