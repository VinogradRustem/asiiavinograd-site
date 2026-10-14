import type { ReactNode } from 'react';

/** Small arrow used inside buttons and cards. */
export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type BtnProps = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: 'dark' | 'light' | 'ghost';
  external?: boolean;
  className?: string;
};

/** Pill button with a square arrow badge on the right (reference: "Book an Appointment"). */
export function ArrowButton({ href, onClick, children, variant = 'dark', external, className = '' }: BtnProps) {
  const base =
    'group inline-flex items-center gap-3 rounded-full pl-6 pr-1.5 py-1.5 text-[15px] font-medium transition-all duration-200';
  const styles = {
    dark: 'bg-slate text-white hover:bg-ink',
    light: 'bg-white text-ink hover:bg-mist',
    ghost: 'bg-transparent text-ink border border-ink/15 hover:border-ink/40',
  }[variant];
  const badge = {
    dark: 'bg-white text-slate',
    light: 'bg-slate text-white',
    ghost: 'bg-ink text-white',
  }[variant];
  const inner = (
    <>
      <span>{children}</span>
      <span className={`grid place-items-center w-9 h-9 rounded-full ${badge} transition-transform duration-200 group-hover:rotate-45`}>
        <Arrow />
      </span>
    </>
  );
  const cls = `${base} ${styles} ${className}`;
  if (href)
    return (
      <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
      </a>
    );
  return (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function SectionHead({
  eyebrow,
  title,
  desc,
  center,
  action,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  center?: boolean;
  action?: ReactNode;
}) {
  return (
    <div className={`mb-10 md:mb-14 flex flex-col gap-5 ${center ? 'items-center text-center' : 'items-start md:flex-row md:items-end md:justify-between'}`}>
      <div className={center ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <span className="eyebrow mb-5">{eyebrow}</span>}
        <h2 className="text-[34px] leading-[1.05] md:text-[52px] font-medium tracking-[-0.03em] text-ink">{title}</h2>
        {desc && <p className="mt-4 text-[17px] leading-relaxed text-muted">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

/** ECG / heartbeat line — the visual motif of the reference design. */
export function Ecg({ className = '', stroke = 'currentColor' }: { className?: string; stroke?: string }) {
  return (
    <svg className={className} viewBox="0 0 600 80" fill="none" preserveAspectRatio="none" aria-hidden>
      <path
        d="M0 40 H170 L185 40 L195 28 L205 40 L222 40 L232 6 L246 74 L258 40 L280 40 L292 32 L304 40 H600"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function Check({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.14" />
      <path d="M5.5 9.2L7.9 11.5L12.5 6.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
