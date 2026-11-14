// Открытый чемодан из макета Packing.dc.html: корпус, подкладка, золотая молния, сетка крышки, ручка, колёса
export function Suitcase({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 560 520" className={className}>
      <defs>
        <linearGradient id="pack-shell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1D4F86" />
          <stop offset="1" stopColor="#0B2540" />
        </linearGradient>
        <linearGradient id="pack-lining" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E7F4FA" />
          <stop offset="1" stopColor="#CFE6F1" />
        </linearGradient>
        <pattern id="pack-mesh" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 0L8 8M8 0L0 8" stroke="#9FC4D6" strokeWidth=".8" />
        </pattern>
      </defs>
      <rect x="222" y="0" width="12" height="70" rx="5" fill="#9FB3C2" />
      <rect x="326" y="0" width="12" height="70" rx="5" fill="#9FB3C2" />
      <rect x="214" y="0" width="132" height="20" rx="10" fill="#2E4A6B" />
      <rect x="20" y="66" width="250" height="420" rx="34" fill="url(#pack-shell)" />
      <rect x="290" y="66" width="250" height="420" rx="34" fill="url(#pack-shell)" />
      <rect x="268" y="120" width="24" height="60" rx="6" fill="#0F2C4C" />
      <rect x="268" y="372" width="24" height="60" rx="6" fill="#0F2C4C" />
      <rect x="36" y="82" width="218" height="388" rx="24" fill="url(#pack-lining)" />
      <rect x="306" y="82" width="218" height="388" rx="24" fill="url(#pack-lining)" />
      <g fill="none" stroke="#E9C77E" strokeWidth="3" strokeDasharray="7 5">
        <rect x="36" y="82" width="218" height="388" rx="24" />
        <rect x="306" y="82" width="218" height="388" rx="24" />
      </g>
      <rect x="48" y="96" width="194" height="240" rx="16" fill="url(#pack-mesh)" opacity=".7" />
      <rect
        x="48"
        y="96"
        width="194"
        height="240"
        rx="16"
        fill="none"
        stroke="#9FC4D6"
        strokeWidth="2"
      />
      <path d="M48 336h194" stroke="#E9C77E" strokeWidth="3" strokeDasharray="6 4" />
      <circle cx="240" cy="336" r="6" fill="#E9C77E" />
      <g fill="#0B2540">
        <rect x="40" y="484" width="30" height="20" rx="8" />
        <rect x="220" y="484" width="30" height="20" rx="8" />
        <rect x="310" y="484" width="30" height="20" rx="8" />
        <rect x="490" y="484" width="30" height="20" rx="8" />
      </g>
      <g fill="#2E4A6B">
        <circle cx="55" cy="508" r="8" />
        <circle cx="235" cy="508" r="8" />
        <circle cx="325" cy="508" r="8" />
        <circle cx="505" cy="508" r="8" />
      </g>
    </svg>
  );
}
