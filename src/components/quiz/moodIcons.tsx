import type { ReactElement } from 'react';
import type { MoodId } from '@/types/city';

// Иллюстрации карточек настроения из Quiz.dc.html (декор, 60×60)
export const MOOD_ICONS: Record<MoodId, ReactElement> = {
  sea: (
    <>
      <circle cx="40" cy="22" r="9" fill="#FFB347" />
      <path
        d="M6 38q7-6 14 0t14 0 14 0 14 0M6 48q7-6 14 0t14 0 14 0 14 0"
        fill="none"
        stroke="#38BDE8"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </>
  ),
  mountains: (
    <>
      <path d="M4 50L22 20l10 14 8-10 16 26z" fill="#2F6B4F" />
      <path d="M22 20l6 10-6-3-5 4z" fill="#FFFFFF" />
      <circle cx="46" cy="14" r="5" fill="#FFB347" />
    </>
  ),
  food: (
    <>
      <path d="M14 10h16l-2 14a6 6 0 0 1-12 0z" fill="#B0174F" />
      <path d="M22 30v14M15 46h14" stroke="#0B2540" strokeWidth="3" strokeLinecap="round" />
      <circle cx="44" cy="38" r="12" fill="#FFFFFF" stroke="#E9C77E" strokeWidth="3" />
      <circle cx="44" cy="38" r="5" fill="#E8288E" />
    </>
  ),
  history: (
    <>
      <path d="M30 6l4 8h-8z" fill="#E9C77E" />
      <path d="M14 30a16 16 0 0 1 32 0z" fill="#8B6CF0" />
      <rect x="12" y="30" width="36" height="20" fill="#C3B5FF" />
      <path d="M26 50V40a4 4 0 0 1 8 0v10" fill="#0B2540" />
    </>
  ),
  city: (
    <>
      <rect x="6" y="24" width="12" height="28" fill="#3E5C86" />
      <rect x="20" y="8" width="12" height="44" fill="#0A79A8" />
      <rect x="34" y="18" width="10" height="34" fill="#8B6CF0" />
      <rect x="46" y="30" width="10" height="22" fill="#E8288E" />
      <g fill="#FFFFFF" opacity=".8">
        <rect x="23" y="14" width="3" height="3" />
        <rect x="23" y="22" width="3" height="3" />
        <rect x="23" y="30" width="3" height="3" />
      </g>
    </>
  ),
  exotic: (
    <>
      <path
        d="M30 52c2-14 2-26-2-36"
        stroke="#8A5A2B"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M28 16c-8-6-18-4-22 2 8-2 14 0 22-2zM28 16c6-8 18-8 24-2-8 0-16 0-24 2zM28 16c-4 6-12 10-18 18 8-4 14-10 18-18zM28 16c6 4 12 10 16 18-6-6-12-10-16-18z"
        fill="#2E9E5B"
      />
    </>
  ),
};
