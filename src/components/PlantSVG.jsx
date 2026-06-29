export default function PlantSVG({ size = 170, stage = 2 }) {
  const h = size * 1.12;

  // Shared soil pot
  const Pot = () => (
    <>
      <ellipse cx="85" cy={h - 8} rx="32" ry="6" fill="rgba(34,197,94,0.07)" />
      <rect x="68" y={h - 42} width="34" height="28" rx="5" fill="#1a2e20" />
      <rect x="64" y={h - 47} width="42" height="9" rx="4" fill="#22C55E" opacity="0.35" />
    </>
  );

  if (stage === 0) {
    // Seed — just a sprout tip poking out of soil
    return (
      <svg width={size} height={h} viewBox="0 0 170 190" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 2 }}>
        <Pot />
        {/* tiny shoot */}
        <rect x="81" y="128" width="8" height="18" rx="4" fill="#16a34a">
          <animate attributeName="height" values="10;18;10" dur="2s" repeatCount="indefinite" />
        </rect>
        <ellipse cx="85" cy="124" rx="10" ry="8" fill="#22C55E">
          <animate attributeName="ry" values="6;9;6" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <style>{`@keyframes seedPulse { 0%,100%{opacity:.7} 50%{opacity:1} }`}</style>
      </svg>
    );
  }

  if (stage === 1) {
    // Sprout — single small stem with two tiny leaves
    return (
      <svg width={size} height={h} viewBox="0 0 170 190" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 2 }}>
        <Pot />
        <rect x="81" y="100" width="8" height="48" rx="4" fill="#16a34a" />
        {/* left leaf */}
        <ellipse cx="65" cy="118" rx="18" ry="10" fill="#22C55E" transform="rotate(-30 65 118)">
          <animateTransform attributeName="transform" type="rotate" values="-30 65 118;-25 65 118;-30 65 118" dur="3s" repeatCount="indefinite" />
        </ellipse>
        {/* right leaf */}
        <ellipse cx="105" cy="115" rx="18" ry="10" fill="#22C55E" transform="rotate(30 105 115)">
          <animateTransform attributeName="transform" type="rotate" values="30 105 115;25 105 115;30 105 115" dur="3s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="85" cy="97" rx="13" ry="11" fill="#4ADE80" />
      </svg>
    );
  }

  if (stage === 2) {
    // Plant — current default, bushy green plant, gentle sway
    return (
      <svg width={size} height={h} viewBox="0 0 170 190" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 2 }}>
        <Pot />
        <g style={{ transformOrigin: '85px 148px', animation: 'plantSway 5s ease-in-out infinite' }}>
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
        </g>
        <style>{`@keyframes plantSway { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }`}</style>
      </svg>
    );
  }

  if (stage === 3) {
    // Flower — plant with a pink/yellow flower on top
    return (
      <svg width={size} height={h} viewBox="0 0 170 190" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 2 }}>
        <Pot />
        <g style={{ transformOrigin: '85px 148px', animation: 'flowerSway 4s ease-in-out infinite' }}>
          <rect x="76" y="80" width="9" height="68" rx="4" fill="#16a34a" />
          <ellipse cx="81" cy="88" rx="28" ry="22" fill="#22C55E" />
          <ellipse cx="55" cy="98" rx="18" ry="13" fill="#16a34a" />
          <ellipse cx="109" cy="96" rx="18" ry="13" fill="#16a34a" />
          <ellipse cx="81" cy="72" rx="18" ry="14" fill="#4ADE80" />
          {/* petals */}
          {[0,60,120,180,240,300].map((deg, i) => (
            <ellipse key={i} cx={80 + 15 * Math.cos(deg * Math.PI / 180)} cy={58 + 15 * Math.sin(deg * Math.PI / 180)}
              rx="8" ry="5" fill="#f9a8d4" opacity="0.9"
              transform={`rotate(${deg} ${80 + 15 * Math.cos(deg * Math.PI / 180)} ${58 + 15 * Math.sin(deg * Math.PI / 180)})`}>
              <animate attributeName="opacity" values="0.7;1;0.7" dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
            </ellipse>
          ))}
          {/* flower center */}
          <circle cx="80" cy="58" r="8" fill="#fbbf24">
            <animate attributeName="r" values="7;9;7" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="80" cy="58" r="4" fill="#f59e0b" />
        </g>
        <style>{`@keyframes flowerSway { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }`}</style>
      </svg>
    );
  }

  // stage === 4 — Full Tree
  return (
    <svg width={size} height={h} viewBox="0 0 170 190" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 2 }}>
      <Pot />
      <g style={{ transformOrigin: '85px 148px', animation: 'treeSway 6s ease-in-out infinite' }}>
        {/* trunk */}
        <rect x="75" y="70" width="20" height="78" rx="6" fill="#166534" />
        {/* bottom wide canopy */}
        <ellipse cx="85" cy="100" rx="48" ry="36" fill="#16a34a" />
        {/* mid canopy */}
        <ellipse cx="85" cy="78" rx="40" ry="30" fill="#22C55E" />
        {/* upper canopy */}
        <ellipse cx="85" cy="57" rx="30" ry="24" fill="#4ADE80" />
        {/* crown */}
        <ellipse cx="85" cy="40" rx="20" ry="18" fill="#86EFAC" />
        {/* highlights */}
        <circle cx="70" cy="52" r="7" fill="#dcfce7" opacity="0.4" />
        <circle cx="98" cy="60" r="5" fill="#dcfce7" opacity="0.3" />
        <circle cx="85" cy="36" r="4" fill="#fff" opacity="0.25" />
        {/* small birds/sparkles to show it's alive */}
        <circle cx="55" cy="72" r="3" fill="#86EFAC" opacity="0.6">
          <animate attributeName="cy" values="72;68;72" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="115" cy="68" r="2.5" fill="#86EFAC" opacity="0.5">
          <animate attributeName="cy" values="68;64;68" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </g>
      <style>{`@keyframes treeSway { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)} }`}</style>
    </svg>
  );
}
