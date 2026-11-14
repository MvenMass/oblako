// Иллюстрации вещей из макета Packing.dc.html — цвета — часть рисунка
import type { ReactElement } from 'react';

export interface ItemArt {
  w: number;
  h: number;
  viewBox: string;
  body: ReactElement;
}

export const ITEM_ART: Record<string, ItemArt> = {
  passport: {
    w: 70,
    h: 96,
    viewBox: '0 0 70 96',
    body: (
      <>
        <rect x="2" y="2" width="66" height="92" rx="7" fill="#1E3F6E" />
        <rect
          x="6"
          y="6"
          width="58"
          height="84"
          rx="4"
          fill="none"
          stroke="#E9C77E"
          strokeOpacity=".5"
        />
        <circle cx="35" cy="40" r="13" fill="none" stroke="#E9C77E" strokeWidth="2" />
        <path d="M27 42h16M29 37h12" stroke="#E9C77E" strokeWidth="1.5" />
        <rect x="18" y="64" width="34" height="4" rx="2" fill="#E9C77E" />
        <rect x="22" y="72" width="26" height="3" rx="1.5" fill="#E9C77E" opacity=".7" />
      </>
    ),
  },
  insurance: {
    w: 80,
    h: 100,
    viewBox: '0 0 80 100',
    body: (
      <>
        <path d="M4 4h54l18 18v74H4z" fill="#FFFFFF" stroke="#C9DCE7" strokeWidth="2" />
        <path d="M58 4v18h18" fill="#E3F1F8" stroke="#C9DCE7" strokeWidth="2" />
        <rect x="12" y="14" width="36" height="8" rx="3" fill="#38BDE8" />
        <g stroke="#C9DCE7" strokeWidth="3" strokeLinecap="round">
          <path d="M12 36h52M12 46h52M12 56h40M12 66h48M12 76h30" />
        </g>
      </>
    ),
  },
  card: {
    w: 90,
    h: 58,
    viewBox: '0 0 90 58',
    body: (
      <>
        <defs>
          <linearGradient id="pack-gcard" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#38BDE8" />
            <stop offset="1" stopColor="#E8288E" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="86" height="54" rx="9" fill="url(#pack-gcard)" />
        <rect x="12" y="18" width="16" height="12" rx="3" fill="#E9C77E" />
        <rect x="12" y="40" width="44" height="4" rx="2" fill="#FFFFFF" opacity=".8" />
        <circle cx="70" cy="42" r="7" fill="#FFFFFF" opacity=".55" />
        <circle cx="78" cy="42" r="7" fill="#FFFFFF" opacity=".35" />
      </>
    ),
  },
  charger: {
    w: 92,
    h: 70,
    viewBox: '0 0 92 70',
    body: (
      <>
        <circle cx="58" cy="38" r="24" fill="none" stroke="#FFFFFF" strokeWidth="5" />
        <circle cx="58" cy="38" r="16" fill="none" stroke="#FFFFFF" strokeWidth="5" />
        <circle cx="58" cy="38" r="24" fill="none" stroke="#C9DCE7" strokeWidth="1" />
        <rect
          x="4"
          y="16"
          width="32"
          height="38"
          rx="8"
          fill="#FFFFFF"
          stroke="#C9DCE7"
          strokeWidth="2"
        />
        <rect x="12" y="8" width="4" height="10" rx="1" fill="#9FB3C2" />
        <rect x="24" y="8" width="4" height="10" rx="1" fill="#9FB3C2" />
        <path d="M36 36 Q44 36 46 30" stroke="#FFFFFF" strokeWidth="5" fill="none" />
      </>
    ),
  },
  powerbank: {
    w: 58,
    h: 100,
    viewBox: '0 0 58 100',
    body: (
      <>
        <rect x="4" y="4" width="50" height="92" rx="12" fill="#0B2540" />
        <g fill="#38BDE8">
          <circle cx="17" cy="80" r="3" />
          <circle cx="25" cy="80" r="3" />
          <circle cx="33" cy="80" r="3" />
        </g>
        <circle cx="41" cy="80" r="3" fill="#2E4A6B" />
        <rect x="20" y="14" width="18" height="5" rx="2" fill="#2E4A6B" />
      </>
    ),
  },
  headphones: {
    w: 80,
    h: 80,
    viewBox: '0 0 80 80',
    body: (
      <>
        <circle cx="40" cy="40" r="34" fill="#FFFFFF" stroke="#C9DCE7" strokeWidth="2" />
        <path d="M8 34h64" stroke="#C9DCE7" strokeWidth="2" />
        <circle cx="40" cy="56" r="3" fill="#7FD3A6" />
      </>
    ),
  },
  toothbrush: {
    w: 22,
    h: 112,
    viewBox: '0 0 22 112',
    body: (
      <>
        <rect x="6" y="30" width="10" height="78" rx="5" fill="#38BDE8" />
        <rect
          x="4"
          y="4"
          width="14"
          height="30"
          rx="4"
          fill="#FFFFFF"
          stroke="#C9DCE7"
          strokeWidth="1.5"
        />
        <g stroke="#C9DCE7">
          <path d="M6 10h10M6 16h10M6 22h10" />
        </g>
      </>
    ),
  },
  cream: {
    w: 32,
    h: 92,
    viewBox: '0 0 32 92',
    body: (
      <>
        <path d="M6 4h20l-2 70H8z" fill="#FFB347" />
        <rect x="8" y="72" width="16" height="16" rx="3" fill="#0B2540" />
        <rect x="9" y="20" width="14" height="24" rx="3" fill="#FFFFFF" opacity=".8" />
        <text
          x="16"
          y="36"
          textAnchor="middle"
          fontFamily="Onest"
          fontSize="8"
          fontWeight="800"
          fill="#F08A24"
        >
          SPF
        </text>
      </>
    ),
  },
  tees: {
    w: 110,
    h: 92,
    viewBox: '0 0 110 92',
    body: (
      <>
        <rect x="6" y="40" width="98" height="46" rx="8" fill="#F7A9CF" />
        <rect x="6" y="24" width="98" height="46" rx="8" fill="#FFC2E0" />
        <rect x="6" y="8" width="98" height="46" rx="8" fill="#FF8CC6" />
        <path d="M40 8 Q55 22 70 8" fill="none" stroke="#C8146F" strokeWidth="3" />
        <path d="M14 30h82" stroke="#E8288E" strokeOpacity=".4" strokeWidth="2" />
      </>
    ),
  },
  jacket: {
    w: 116,
    h: 100,
    viewBox: '0 0 116 100',
    body: (
      <>
        <rect x="6" y="10" width="104" height="84" rx="12" fill="#7FD3F2" />
        <path d="M58 10v84" stroke="#0A79A8" strokeWidth="3" strokeDasharray="4 3" />
        <path d="M36 10 Q58 30 80 10" fill="#5BBFE6" />
        <rect x="20" y="58" width="22" height="16" rx="4" fill="#5BBFE6" />
        <rect x="74" y="58" width="22" height="16" rx="4" fill="#5BBFE6" />
      </>
    ),
  },
  trousers: {
    w: 96,
    h: 108,
    viewBox: '0 0 96 108',
    body: (
      <>
        <rect x="6" y="6" width="84" height="96" rx="10" fill="#3E5C86" />
        <rect x="6" y="6" width="84" height="16" rx="6" fill="#2F4A70" />
        <path d="M48 22v80" stroke="#2F4A70" strokeWidth="3" />
        <rect x="44" y="9" width="8" height="10" rx="2" fill="#E9C77E" />
      </>
    ),
  },
  scarf: {
    w: 98,
    h: 98,
    viewBox: '0 0 98 98',
    body: (
      <>
        <rect x="6" y="6" width="86" height="86" rx="10" fill="#C3B5FF" />
        <g stroke="#8B6CF0" strokeWidth="4" opacity=".6">
          <path d="M6 30h86M6 54h86M6 78h86" />
        </g>
        <path d="M6 6l86 86" stroke="#FFFFFF" strokeOpacity=".4" strokeWidth="3" />
        <g fill="#8B6CF0">
          <circle cx="20" cy="94" r="3" />
          <circle cx="32" cy="94" r="3" />
          <circle cx="44" cy="94" r="3" />
        </g>
      </>
    ),
  },
  shoes: {
    w: 130,
    h: 92,
    viewBox: '0 0 130 92',
    body: (
      <>
        <g>
          <ellipse
            cx="34"
            cy="46"
            rx="26"
            ry="42"
            fill="#FFFFFF"
            stroke="#C9DCE7"
            strokeWidth="2"
          />
          <ellipse cx="34" cy="60" rx="16" ry="20" fill="#EAF6FC" />
          <path
            d="M24 22h20M24 30h20M24 38h20"
            stroke="#E8288E"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
        <g>
          <ellipse
            cx="96"
            cy="46"
            rx="26"
            ry="42"
            fill="#FFFFFF"
            stroke="#C9DCE7"
            strokeWidth="2"
          />
          <ellipse cx="96" cy="60" rx="16" ry="20" fill="#EAF6FC" />
          <path
            d="M86 22h20M86 30h20M86 38h20"
            stroke="#E8288E"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      </>
    ),
  },
  aid: {
    w: 80,
    h: 66,
    viewBox: '0 0 80 66',
    body: (
      <>
        <rect
          x="4"
          y="12"
          width="72"
          height="50"
          rx="10"
          fill="#FFFFFF"
          stroke="#C9DCE7"
          strokeWidth="2"
        />
        <rect
          x="28"
          y="4"
          width="24"
          height="12"
          rx="4"
          fill="none"
          stroke="#C9DCE7"
          strokeWidth="3"
        />
        <path d="M40 24v26M27 37h26" stroke="#E8288E" strokeWidth="8" strokeLinecap="round" />
      </>
    ),
  },
  umbrella: {
    w: 30,
    h: 140,
    viewBox: '0 0 30 140',
    body: (
      <>
        <path d="M15 4 L26 100 Q15 108 4 100 Z" fill="#8B6CF0" />
        <path d="M15 4 L15 104" stroke="#6E4FE0" strokeWidth="2" />
        <rect x="11" y="100" width="8" height="18" fill="#0B2540" />
        <path
          d="M15 118 v10 a8 8 0 0 1 -14 0"
          fill="none"
          stroke="#0B2540"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </>
    ),
  },
};
