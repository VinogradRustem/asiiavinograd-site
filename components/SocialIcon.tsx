import type { ReactElement } from 'react';

export type Brand = { bg: string; icon: ReactElement };

const W = 'currentColor';

/** Brand colours and simple glyphs for the "Study together" platform buttons. */
export const BRANDS: Record<string, Brand> = {
  YouTube: {
    bg: '#FF0000',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
        <rect x="2" y="5" width="20" height="14" rx="4" fill={W} />
        <path d="M10 9v6l5-3z" fill="#FF0000" />
      </svg>
    ),
  },
  Instagram: {
    bg: 'linear-gradient(135deg,#F58529 0%,#DD2A7B 45%,#8134AF 75%,#515BD4 100%)',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={W} strokeWidth="2" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill={W} stroke="none" />
      </svg>
    ),
  },
  TikTok: {
    bg: '#000000',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
        <path d="M14.5 3h3c.3 2 1.6 3.4 3.5 3.7v3c-1.3 0-2.5-.4-3.5-1V15a6 6 0 1 1-6-6v3.1a2.9 2.9 0 1 0 3 2.9V3Z" fill={W} />
      </svg>
    ),
  },
  Telegram: {
    bg: '#229ED9',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
        <path d="M21.5 4.2 2.8 11.4c-.9.4-.9 1.2 0 1.5l4.6 1.4 1.8 5.4c.2.7.9.8 1.4.3l2.6-2.4 4.8 3.5c.7.4 1.3.2 1.5-.7l3-14.3c.3-1.1-.4-1.6-1-1.2Zm-3.7 3.3-8.3 7.6-.3 3.3-1.3-4 9.9-6.9Z" fill={W} />
      </svg>
    ),
  },
  Patreon: {
    bg: '#FF424D',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
        <circle cx="14.5" cy="9.5" r="6.5" fill={W} />
        <rect x="3" y="3" width="3.5" height="18" fill={W} />
      </svg>
    ),
  },
  Discord: {
    bg: '#5865F2',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
        <path d="M19.5 5.5A16 16 0 0 0 15.6 4l-.5 1a14 14 0 0 0-6.2 0l-.5-1a16 16 0 0 0-3.9 1.5C2 9.3 1.4 13 1.7 16.6A16 16 0 0 0 6.5 19l1-1.6c-.6-.2-1.2-.5-1.7-.9l.4-.3a11.5 11.5 0 0 0 11.6 0l.4.3c-.5.4-1.1.7-1.7.9l1 1.6a16 16 0 0 0 4.8-2.4c.4-4.2-.6-7.9-2.8-11.1ZM8.7 14.4c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm6.6 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" fill={W} />
      </svg>
    ),
  },
  LinkedIn: {
    bg: '#0A66C2',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
        <rect x="3.5" y="9" width="3.5" height="11" fill={W} />
        <circle cx="5.25" cy="5.25" r="2" fill={W} />
        <path d="M10 9h3.3v1.6c.5-.9 1.7-1.9 3.6-1.9 3.4 0 4.1 2.2 4.1 5.1V20h-3.5v-5.4c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V20H10V9Z" fill={W} />
      </svg>
    ),
  },
  VK: {
    bg: '#0077FF',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
        <path d="M12.8 18C6.4 18 2.7 13.6 2.5 6.3h3.2c.1 5.4 2.5 7.6 4.4 8.1V6.3h3v4.6c1.9-.2 3.8-2.3 4.5-4.6h3c-.5 2.8-2.6 4.9-4.1 5.7 1.5.7 3.9 2.5 4.8 6h-3.3c-.7-2.2-2.5-4-4.9-4.2V18h-.3Z" fill={W} />
      </svg>
    ),
  },
  Email: {
    bg: '#36565F',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke={W} strokeWidth="2" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
  },
};
