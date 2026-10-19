const P: Record<string, string> = {
  door: 'M4 21h16M6 21V4h9v17M15 6h3v15M11.5 12.5h.01',
  book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Zm0 14a2 2 0 0 1 2-2h13',
  steth: 'M6 3v6a4 4 0 0 0 8 0V3M10 13v3a5 5 0 0 0 10 0v-2m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  exam: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13l2 2 4-4',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z',
  flag: 'M5 21V4m0 0h11l-2 4 2 4H5',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 10a7 7 0 0 1 14 0m1-10a3 3 0 1 0 0-6m5 16a6 6 0 0 0-4-5.6',
  chat: 'M4 5h16v11H9l-5 4V5Zm4 5h8M8 13h5',
  news: 'M5 4h12v16H6a2 2 0 0 1-2-2V8h3M8 8h6M8 12h6M8 16h4M17 9h3v9a2 2 0 0 1-2 2',
};

export default function SectionIcon({ name, size = 22 }: { name: string | null; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={P[name || 'chat'] || P.chat} />
    </svg>
  );
}
