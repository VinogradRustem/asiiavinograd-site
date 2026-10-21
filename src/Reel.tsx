import React from 'react';
import {AbsoluteFill, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import './fonts';
import {CAPTIONS, DEFAULT_STYLE, ElOv, FONTS, PALETTES, Palette, Font, Style} from './styles';

export type Word = {w: string; s: number; e: number};
export type Line = {text: string; at?: number; tone?: 'plus' | 'minus' | 'neutral'};
export type Item = {
  kind: 'hook' | 'card' | 'broll' | 'cta' | 'note' | 'colorcard' | 'stamp' | 'counter' | 'compare' | 'list' | 'notify' | 'flip';
  t0: number; t1: number;
  small?: string; big?: string; sub?: string;      // hook, cta, colorcard, stamp
  title?: string; accent?: string; lines?: Line[]; // card
  path?: string; mode?: 'card' | 'full'; tag?: string; // broll
  text?: string;                                   // note, notify
  value?: number; unit?: string; label?: string;   // counter
  bars?: {label: string; value: number; tone?: 'plus' | 'minus'}[]; // compare (0..100)
  q?: string; a?: string;                          // flip
};
export type ReelProps = {video: string; duration: number; words: Word[]; items: Item[]; punch: number[]; style?: Partial<Style>};

const W = 1080, H = 1920;
const src = (p: string) => (p.startsWith('http') ? p : staticFile(p));

type Ctx = {p: Palette; f: Font; st: Style; fps: number; ov: ElOv};
const C = React.createContext<Ctx>(null as unknown as Ctx);

// entrance/exit for any overlay: snappy = spring pop, smooth = fade+slide, none = cut
const useInOut = (t0: number, t1: number) => {
  const frame = useCurrentFrame();
  const {st, fps} = React.useContext(C);
  const t = frame / fps;
  const outA = interpolate(t, [t1 - 0.15, t1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (st.motion === 'none') return {opacity: 1, scale: 1, y: 0};
  if (st.motion === 'smooth') {
    const a = interpolate(t, [t0, t0 + 0.35], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
    return {opacity: Math.min(a, outA), scale: 1, y: (1 - a) * 40};
  }
  const s = spring({frame: frame - t0 * fps, fps, config: {damping: 12, stiffness: 180, mass: 0.7}});
  return {opacity: Math.min(interpolate(s, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}), outA), scale: 0.82 + 0.18 * s, y: 0};
};

const tx = (s: string, f: Font) => (f.upper ? s.toUpperCase() : s);
// font size so that the longest word fits the width (wide display fonts are ~0.75 em per capital letter)
const fit = (s: string, max: number, width: number, f: Font) => {
  const longest = Math.max(1, ...s.split(/\s+/).map((w) => w.length));
  const em = f.display === 'Unbounded' ? 0.86 : f.display === 'Oswald' ? 0.5 : 0.72;
  return Math.min(max, Math.floor(width / (longest * em)));
};

// where each kind sits on screen: used as the pivot for scale/tilt edits
const ORIGIN: Record<string, string> = {hook: '50% 15%', card: '50% 15%', cta: '50% 15%', broll: '50% 18%', counter: '50% 15%', compare: '50% 15%', list: '50% 15%',
  notify: '50% 8%', flip: '50% 18%', note: '75% 47%', stamp: '22% 46%', colorcard: '50% 50%', captions: '50% 68%'};

// Applies Asiia's fine-tuning for one element kind: colours/font through context, position/size through a wrapper
const ElScope: React.FC<{kind: string; children: React.ReactNode}> = ({kind, children}) => {
  const ctx = React.useContext(C);
  const ov: ElOv = (ctx.st.el || {})[kind] || {};
  if (ov.hide) return null;
  const p = {...ctx.p, ...(ov.accent ? {accent: ov.accent} : {}), ...(ov.ink ? {ink: ov.ink} : {}), ...(ov.panel ? {panel: ov.panel} : {}), ...(ov.text ? {text: ov.text} : {})};
  const f = ov.font && FONTS[ov.font] ? FONTS[ov.font] : ctx.f;
  const moved = ov.dx || ov.dy || (ov.scale && ov.scale !== 1);
  const inner = <C.Provider value={{...ctx, p, f, ov}}>{children}</C.Provider>;
  if (!moved) return inner;
  return (
    <AbsoluteFill style={{transform: `translate(${ov.dx || 0}px, ${ov.dy || 0}px) scale(${ov.scale || 1})`, transformOrigin: ORIGIN[kind] || '50% 50%'}}>{inner}</AbsoluteFill>
  );
};

// ---------- captions ----------
type Chunk = {s: number; e: number; words: Word[]};
const chunkWords = (words: Word[], maxWords: number, maxChars: number): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Word[] = [];
  for (const w of words) {
    const text = [...cur, w].map((x) => x.w).join(' ');
    if (cur.length && (cur.length >= maxWords || text.length > maxChars || w.s - cur[cur.length - 1].e > 0.3 || /[.!?]$/.test(cur[cur.length - 1].w))) {
      out.push({s: cur[0].s, e: cur[cur.length - 1].e, words: cur});
      cur = [];
    }
    cur.push(w);
  }
  if (cur.length) out.push({s: cur[0].s, e: cur[cur.length - 1].e, words: cur});
  return out.map((c, i) => ({...c, e: i + 1 < out.length ? Math.min(c.e + 0.25, out[i + 1].s) : c.e + 0.4}));
};

const Captions: React.FC<{words: Word[]}> = ({words}) => {
  const frame = useCurrentFrame();
  const {p, f, st, fps} = React.useContext(C);
  const t = frame / fps;
  const kind = CAPTIONS[st.captions] ? st.captions : 'karaoke';
  const chunks = React.useMemo(() => (kind === 'pop' ? chunkWords(words, 2, 14) : chunkWords(words, 3, 20)), [words, kind]);
  const c = chunks.find((x) => x.s <= t && t < x.e);
  if (!c) return null;
  const active = Math.max(0, ...c.words.map((w, i) => (w.s <= t ? i : 0)));
  const clean = (s: string) => s.replace(/[«»"“”]/g, '').replace(/[,.;:]+$/, '');
  const k = Math.min(1, (t - c.s) / 0.12);
  const pop = kind === 'pop' ? spring({frame: frame - c.s * fps, fps, config: {damping: 9, stiffness: 220}}) : 1;
  const base: React.CSSProperties = {
    position: 'absolute', left: 60, right: 60, top: H * (kind === 'pop' ? 0.6 : 0.66), display: 'flex', flexWrap: 'wrap',
    justifyContent: 'center', gap: '6px 22px', transform: `scale(${kind === 'pop' ? 0.6 + 0.4 * pop : 0.92 + 0.08 * k})`,
  };
  const up = kind === 'clean' ? (s: string) => s : (s: string) => s.toUpperCase();
  return (
    <div style={base}>
      {c.words.map((w, i) => {
        const on = i === active;
        const font = kind === 'clean' ? f.body : f.display;
        const weight = kind === 'clean' ? f.bodyWeight : f.displayWeight;
        const size = kind === 'pop' ? 118 : kind === 'clean' ? 64 : 70;
        const st2: React.CSSProperties = {fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: 1.08, color: '#fff', position: 'relative'};
        if (kind === 'karaoke' || kind === 'pop') {
          Object.assign(st2, {color: on ? p.accent : '#fff', WebkitTextStroke: `${kind === 'pop' ? 12 : 10}px #000`, paintOrder: 'stroke fill'});
          if (kind === 'pop' && i % 2 === 1 && !on) st2.color = '#fff';
        } else if (kind === 'box') {
          Object.assign(st2, {color: on ? p.ink : '#fff', background: on ? p.accent : 'transparent', padding: '2px 16px', borderRadius: 14,
            WebkitTextStroke: on ? '0px' : '9px #000', paintOrder: 'stroke fill'});
        } else if (kind === 'clean') {
          Object.assign(st2, {textShadow: '0 4px 18px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.9)', transform: on ? 'scale(1.08)' : 'none', color: on ? p.accent : '#fff'});
        } else if (kind === 'underline') {
          Object.assign(st2, {WebkitTextStroke: '9px #000', paintOrder: 'stroke fill'});
        }
        return (
          <span key={i} style={st2}>
            {up(clean(w.w))}
            {kind === 'underline' && on ? (
              <span style={{position: 'absolute', left: 0, right: 0, bottom: -10, height: 14, borderRadius: 7, background: p.accent}} />
            ) : null}
          </span>
        );
      })}
    </div>
  );
};

// ---------- panels ----------
const Panel: React.FC<{children: React.ReactNode; top?: number; accent?: string}> = ({children, top = 110, accent}) => {
  const {p, st} = React.useContext(C);
  const a = accent || p.accent;
  const kind = st.cards;
  const common: React.CSSProperties = {position: 'absolute', left: '50%', top, maxWidth: 960, minWidth: 760, transform: 'translateX(-50%)', textAlign: 'center'};
  if (kind === 'solid')
    return <div style={{...common, background: a, borderRadius: 36, padding: '38px 56px', boxShadow: '0 18px 50px rgba(0,0,0,0.35)'}}>{children}</div>;
  if (kind === 'sticker')
    return (
      <div style={{...common, transform: `translateX(-50%) rotate(${React.useContext(C).ov.tilt ?? -2.5}deg)`, background: '#FFFDF4', borderRadius: 10, padding: '40px 56px',
        boxShadow: '0 22px 50px rgba(0,0,0,0.4)', border: '2px solid rgba(0,0,0,0.06)'}}>
        <div style={{position: 'absolute', top: -22, left: '50%', width: 180, height: 44, marginLeft: -90, background: a, opacity: 0.85, transform: 'rotate(3deg)'}} />
        {children}
      </div>
    );
  if (kind === 'minimal')
    return <div style={{...common, padding: '10px 20px', borderBottom: `10px solid ${a}`}}>{children}</div>;
  return (
    <div style={{...common, background: p.panel, borderRadius: 36, padding: '38px 56px 38px 70px', boxShadow: '0 18px 50px rgba(0,0,0,0.45)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 16, background: a}} />
      {children}
    </div>
  );
};

// text colours that work on each card kind
const useInk = () => {
  const {p, st} = React.useContext(C);
  if (st.cards === 'solid') return {title: p.ink, body: p.ink, plus: p.ink, minus: p.ink};
  if (st.cards === 'sticker') return {title: '#1B1B1B', body: '#2A2A2A', plus: '#0E8A55', minus: '#D23A2B'};
  if (st.cards === 'minimal') return {title: p.accent, body: '#fff', plus: '#3DDC97', minus: '#FF5C4E'};
  return {title: p.accent, body: p.text, plus: '#3DDC97', minus: '#FF5C4E'};
};
const shadow = (on: boolean): React.CSSProperties => (on ? {textShadow: '0 4px 16px rgba(0,0,0,0.85)'} : {});

const Card: React.FC<{it: Item}> = ({it}) => {
  const frame = useCurrentFrame();
  const {f, st, fps} = React.useContext(C);
  const ink = useInk();
  const io = useInOut(it.t0, it.t1);
  const t = frame / fps;
  const sticker = st.cards === 'sticker';
  return (
    <div style={{opacity: io.opacity, transform: `translateY(${io.y}px) scale(${io.scale})`, transformOrigin: '50% 0%', position: 'absolute', inset: 0}}>
      <Panel accent={it.accent === 'coral' ? '#FF5C4E' : undefined}>
        <div style={{fontFamily: sticker ? 'Caveat' : f.display, fontWeight: sticker ? 700 : f.displayWeight, fontSize: sticker ? 92 : 68, color: ink.title,
          lineHeight: 1.05, ...shadow(st.cards === 'minimal')}}>{sticker ? it.title : tx(it.title || '', f)}</div>
        {(it.lines || []).filter((l) => (l.at ?? it.t0) <= t).map((l, i) => (
          <div key={i} style={{fontFamily: sticker ? 'Caveat' : f.body, fontWeight: sticker ? 700 : f.bodyWeight, fontSize: sticker ? 66 : 50, marginTop: 14,
            color: l.tone === 'plus' ? ink.plus : l.tone === 'minus' ? ink.minus : ink.body, lineHeight: 1.15, ...shadow(st.cards === 'minimal')}}>{l.text}</div>
        ))}
      </Panel>
    </div>
  );
};

const Hook: React.FC<{it: Item}> = ({it}) => {
  const {p, f, st} = React.useContext(C);
  const io = useInOut(it.t0, it.t1);
  const ink = useInk();
  if (st.hook === 'bigcenter')
    return (
      <AbsoluteFill style={{opacity: io.opacity, background: 'linear-gradient(180deg, rgba(0,0,0,0.0) 10%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.55) 62%, rgba(0,0,0,0) 85%)'}}>
        <div style={{position: 'absolute', top: 560, left: 60, right: 60, textAlign: 'center', transform: `scale(${io.scale})`}}>
          {it.small ? <div style={{fontFamily: f.body, fontWeight: f.bodyWeight, fontSize: 52, color: '#fff', marginBottom: 18}}>{it.small}</div> : null}
          <div style={{fontFamily: f.display, fontWeight: f.displayWeight, fontSize: fit(it.big || '', 150, 940, f), lineHeight: 0.98, color: p.accent, WebkitTextStroke: '6px #000', paintOrder: 'stroke fill'}}>
            {tx(it.big || '', f)}</div>
          {it.sub ? <div style={{fontFamily: f.display, fontWeight: f.displayWeight, fontSize: 60, color: '#fff', marginTop: 22}}>{tx(it.sub, f)}</div> : null}
        </div>
      </AbsoluteFill>
    );
  if (st.hook === 'stamp')
    return (
      <div style={{position: 'absolute', top: 170, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: io.opacity}}>
        <div style={{transform: `rotate(${React.useContext(C).ov.tilt ?? -6}deg) scale(${1.25 - 0.25 * io.scale})`, border: `12px solid ${p.accent}`, borderRadius: 24, padding: '26px 48px',
          background: 'rgba(0,0,0,0.35)', textAlign: 'center'}}>
          {it.small ? <div style={{fontFamily: f.body, fontWeight: f.bodyWeight, fontSize: 44, color: '#fff'}}>{it.small}</div> : null}
          <div style={{fontFamily: f.display, fontWeight: f.displayWeight, fontSize: 120, color: p.accent, lineHeight: 1}}>{tx(it.big || '', f)}</div>
          {it.sub ? <div style={{fontFamily: f.display, fontWeight: f.displayWeight, fontSize: 52, color: '#fff'}}>{tx(it.sub, f)}</div> : null}
        </div>
      </div>
    );
  return (
    <div style={{opacity: io.opacity, transform: `scale(${io.scale})`, transformOrigin: '50% 0%', position: 'absolute', inset: 0}}>
      <Panel top={90}>
        {it.small ? <div style={{fontFamily: f.body, fontWeight: f.bodyWeight, fontSize: 40, color: st.cards === 'solid' ? ink.body : '#C8D6E6'}}>{it.small}</div> : null}
        <div style={{fontFamily: f.display, fontWeight: f.displayWeight, fontSize: fit(it.big || '', 104, 820, f), color: ink.title, lineHeight: 1.02, margin: '8px 0'}}>{tx(it.big || '', f)}</div>
        {it.sub ? <div style={{fontFamily: f.display, fontWeight: f.displayWeight, fontSize: 48, color: ink.body}}>{tx(it.sub, f)}</div> : null}
      </Panel>
    </div>
  );
};

const Cta: React.FC<{it: Item}> = ({it}) => {
  const {f} = React.useContext(C);
  const ink = useInk();
  const io = useInOut(it.t0, it.t1);
  return (
    <div style={{opacity: io.opacity, transform: `scale(${io.scale})`, transformOrigin: '50% 0%', position: 'absolute', inset: 0}}>
      <Panel top={90}>
        <div style={{fontFamily: f.display, fontWeight: f.displayWeight, fontSize: 116, color: ink.title, lineHeight: 1}}>{tx(it.big || 'СОХРАНИ', f)}</div>
        {it.small ? <div style={{fontFamily: f.body, fontWeight: f.bodyWeight, fontSize: 50, color: ink.body, marginTop: 14}}>{it.small}</div> : null}
      </Panel>
    </div>
  );
};

const Broll: React.FC<{it: Item}> = ({it}) => {
  const frame = useCurrentFrame();
  const {p, f, fps} = React.useContext(C);
  const io = useInOut(it.t0, it.t1);
  const t = frame / fps;
  const rel = Math.max(0, t - it.t0);
  const zoom = 1.02 + 0.06 * (rel / Math.max(0.1, it.t1 - it.t0));
  if (!it.path) return null;
  if (it.mode === 'full') {
    const a = interpolate(t, [it.t0, it.t0 + 0.12, it.t1 - 0.12, it.t1], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    return (
      <AbsoluteFill style={{opacity: a, overflow: 'hidden', background: '#000'}}>
        <OffthreadVideo src={src(it.path)} muted startFrom={0} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />
      </AbsoluteFill>
    );
  }
  return (
    <div style={{position: 'absolute', top: 100, left: 60, width: 960, height: 540, opacity: io.opacity, transform: `scale(${io.scale})`, transformOrigin: '50% 0%'}}>
      <div style={{width: '100%', height: '100%', borderRadius: 36, overflow: 'hidden', border: '7px solid #fff', boxShadow: '0 20px 50px rgba(0,0,0,0.5)'}}>
        <OffthreadVideo src={src(it.path)} muted style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}} />
      </div>
      {it.tag ? (
        <div style={{position: 'absolute', left: 30, bottom: -34, background: p.accent, color: p.ink, borderRadius: 22, padding: '14px 30px',
          fontFamily: f.display, fontWeight: f.displayWeight, fontSize: 40}}>{tx(it.tag, f)}</div>
      ) : null}
    </div>
  );
};

// handwritten note with a drawn arrow, like a pen annotation next to the face
const Note: React.FC<{it: Item}> = ({it}) => {
  const frame = useCurrentFrame();
  const {p, fps} = React.useContext(C);
  const io = useInOut(it.t0, it.t1);
  const draw = interpolate(frame - it.t0 * fps, [0, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: 760, right: 60, width: 460, opacity: io.opacity, transform: `rotate(${React.useContext(C).ov.tilt ?? -4}deg)`}}>
      <div style={{fontFamily: 'Caveat', fontWeight: 700, fontSize: 100, color: p.accent, lineHeight: 0.95, textShadow: '0 3px 10px rgba(0,0,0,0.7)'}}>{it.text}</div>
      <svg width="260" height="160" viewBox="0 0 260 160" style={{marginTop: 4, marginLeft: -60}}>
        <path d="M230 10 C 170 40, 110 70, 40 130" stroke={p.accent} strokeWidth="9" fill="none" strokeLinecap="round" strokeDasharray="320" strokeDashoffset={320 * (1 - draw)} />
        <path d="M40 130 L 80 120 M40 130 L 52 92" stroke={p.accent} strokeWidth="9" fill="none" strokeLinecap="round" opacity={draw > 0.9 ? 1 : 0} />
      </svg>
    </div>
  );
};

// a full-screen colour card with one or two words (1 s accent beat)
const ColorCard: React.FC<{it: Item}> = ({it}) => {
  const frame = useCurrentFrame();
  const {p, f, fps} = React.useContext(C);
  const t = frame / fps;
  const a = interpolate(t, [it.t0, it.t0 + 0.08, it.t1 - 0.08, it.t1], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const s = spring({frame: frame - it.t0 * fps, fps, config: {damping: 10, stiffness: 200}});
  return (
    <AbsoluteFill style={{opacity: a, background: p.accent, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: f.display, fontWeight: f.displayWeight, fontSize: fit(it.big || '', 150, 900, f), color: p.ink, textAlign: 'center', padding: 60, lineHeight: 1, transform: `scale(${0.7 + 0.3 * s})`}}>
        {tx(it.big || '', f)}</div>
      {it.small ? <div style={{fontFamily: f.body, fontWeight: f.bodyWeight, fontSize: 56, color: p.ink, marginTop: 10}}>{it.small}</div> : null}
    </AbsoluteFill>
  );
};

// stamped number or word next to the face
const Stamp: React.FC<{it: Item}> = ({it}) => {
  const frame = useCurrentFrame();
  const {p, f, fps} = React.useContext(C);
  const io = useInOut(it.t0, it.t1);
  const s = spring({frame: frame - it.t0 * fps, fps, config: {damping: 8, stiffness: 260}});
  return (
    <div style={{position: 'absolute', top: 820, left: 70, opacity: io.opacity, transform: `rotate(${React.useContext(C).ov.tilt ?? -10}deg) scale(${2 - s})`}}>
      <div style={{background: p.accent, color: p.ink, fontFamily: f.display, fontWeight: f.displayWeight, fontSize: fit(it.big || '', 96, 640, f), padding: '14px 34px', borderRadius: 14,
        boxShadow: '0 12px 30px rgba(0,0,0,0.45)'}}>{tx(it.big || '', f)}</div>
      {it.small ? <div style={{marginTop: 10, color: '#fff', fontFamily: f.body, fontWeight: f.bodyWeight, fontSize: 44, textShadow: '0 3px 10px #000'}}>{it.small}</div> : null}
    </div>
  );
};

// animated statistic: number counts up, label under it
const Counter: React.FC<{it: Item}> = ({it}) => {
  const frame = useCurrentFrame();
  const {f, fps} = React.useContext(C);
  const ink = useInk();
  const io = useInOut(it.t0, it.t1);
  const k = interpolate(frame - it.t0 * fps, [0, 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const v = Math.round((it.value || 0) * k);
  return (
    <div style={{opacity: io.opacity, transform: `scale(${io.scale})`, transformOrigin: '50% 0%', position: 'absolute', inset: 0}}>
      <Panel>
        <div style={{fontFamily: f.display, fontWeight: f.displayWeight, fontSize: 170, color: ink.title, lineHeight: 1}}>{v}{it.unit || ''}</div>
        {it.label ? <div style={{fontFamily: f.body, fontWeight: f.bodyWeight, fontSize: 50, color: ink.body, marginTop: 10}}>{it.label}</div> : null}
      </Panel>
    </div>
  );
};

// two or three bars that grow, e.g. "без повторения 30% / с повторением 80%"
const Compare: React.FC<{it: Item}> = ({it}) => {
  const frame = useCurrentFrame();
  const {p, f, fps} = React.useContext(C);
  const ink = useInk();
  const io = useInOut(it.t0, it.t1);
  return (
    <div style={{opacity: io.opacity, transform: `scale(${io.scale})`, transformOrigin: '50% 0%', position: 'absolute', inset: 0}}>
      <Panel>
        {it.title ? <div style={{fontFamily: f.display, fontWeight: f.displayWeight, fontSize: 56, color: ink.title, marginBottom: 18}}>{tx(it.title, f)}</div> : null}
        {(it.bars || []).map((b, i) => {
          const k = interpolate(frame - it.t0 * fps - 8 - i * 8, [0, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
          const col = b.tone === 'minus' ? '#FF5C4E' : b.tone === 'plus' ? '#3DDC97' : p.accent;
          return (
            <div key={i} style={{marginTop: 16, textAlign: 'left'}}>
              <div style={{fontFamily: f.body, fontWeight: f.bodyWeight, fontSize: 42, color: ink.body}}>{b.label} — {Math.round(b.value * k)}%</div>
              <div style={{height: 34, borderRadius: 17, background: 'rgba(255,255,255,0.15)', marginTop: 8, overflow: 'hidden'}}>
                <div style={{height: '100%', width: `${b.value * k}%`, background: col, borderRadius: 17}} />
              </div>
            </div>
          );
        })}
      </Panel>
    </div>
  );
};

// checklist: lines appear one by one with a tick
const ListEl: React.FC<{it: Item}> = ({it}) => {
  const frame = useCurrentFrame();
  const {p, f, fps} = React.useContext(C);
  const ink = useInk();
  const io = useInOut(it.t0, it.t1);
  const t = frame / fps;
  return (
    <div style={{opacity: io.opacity, transform: `scale(${io.scale})`, transformOrigin: '50% 0%', position: 'absolute', inset: 0}}>
      <Panel>
        {it.title ? <div style={{fontFamily: f.display, fontWeight: f.displayWeight, fontSize: 60, color: ink.title, marginBottom: 10}}>{tx(it.title, f)}</div> : null}
        {(it.lines || []).map((l, i) => {
          const at = l.at ?? it.t0 + 0.4 + i * 0.6;
          const a = interpolate(t, [at, at + 0.2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div key={i} style={{opacity: a, transform: `translateX(${(1 - a) * 40}px)`, display: 'flex', alignItems: 'center', gap: 18, marginTop: 14, textAlign: 'left'}}>
              <div style={{width: 52, height: 52, borderRadius: 26, background: p.accent, color: p.ink, fontSize: 36, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>✓</div>
              <div style={{fontFamily: f.body, fontWeight: f.bodyWeight, fontSize: 48, color: ink.body}}>{l.text}</div>
            </div>
          );
        })}
      </Panel>
    </div>
  );
};

// phone-style notification dropping from the top: "Вопрос от подписчика"
const Notify: React.FC<{it: Item}> = ({it}) => {
  const frame = useCurrentFrame();
  const {p, fps} = React.useContext(C);
  const s = spring({frame: frame - it.t0 * fps, fps, config: {damping: 14, stiffness: 160}});
  const out = interpolate(frame / fps, [it.t1 - 0.25, it.t1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: 70 + (1 - s) * -260 - out * 260, background: 'rgba(250,250,252,0.97)', borderRadius: 40,
      padding: '28px 34px', display: 'flex', gap: 24, alignItems: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.45)'}}>
      <div style={{width: 96, height: 96, borderRadius: 24, background: p.accent, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56}}>💬</div>
      <div>
        <div style={{fontFamily: 'Rubik', fontWeight: 700, fontSize: 36, color: '#6B7280'}}>{it.label || 'Вопрос от подписчика'}</div>
        <div style={{fontFamily: 'Rubik', fontWeight: 500, fontSize: 46, color: '#111827', lineHeight: 1.15, marginTop: 4}}>{it.text}</div>
      </div>
    </div>
  );
};

// question card that flips to the answer halfway
const Flip: React.FC<{it: Item}> = ({it}) => {
  const frame = useCurrentFrame();
  const {p, f, fps} = React.useContext(C);
  const io = useInOut(it.t0, it.t1);
  const midT = (it.t0 + it.t1) / 2;
  const r = interpolate(frame / fps, [midT - 0.2, midT + 0.2], [0, 180], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const front = r < 90;
  return (
    <div style={{position: 'absolute', top: 110, left: 90, right: 90, height: 460, perspective: 1600, opacity: io.opacity}}>
      <div style={{width: '100%', height: '100%', borderRadius: 40, transform: `rotateY(${front ? r : r - 180}deg)`, background: front ? p.panel : p.accent,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 50, boxShadow: '0 20px 50px rgba(0,0,0,0.45)'}}>
        <div style={{fontFamily: f.body, fontWeight: f.bodyWeight, fontSize: 38, color: front ? p.accent : p.ink, marginBottom: 14}}>{front ? 'ВОПРОС' : 'ОТВЕТ'}</div>
        <div style={{fontFamily: f.display, fontWeight: f.displayWeight, fontSize: front ? 64 : 84, color: front ? '#fff' : p.ink, textAlign: 'center', lineHeight: 1.08}}>{tx((front ? it.q : it.a) || '', f)}</div>
      </div>
    </div>
  );
};

const zoomAt = (t: number, punch: number[], motion: string) => {
  if (motion === 'none') return 1;
  let z = 1;
  for (const t0 of punch) {
    const dt = t - t0;
    if (dt >= 0 && dt < 1.6) {
      const k = motion === 'smooth' ? Math.sin(Math.min(1, dt / 1.6) * Math.PI) * 0.06 : (dt < 0.16 ? dt / 0.16 : 1 - (dt - 0.16) / 1.44) * 0.08;
      z = Math.max(z, 1 + k);
    }
  }
  return z;
};

const el = (it: Item, k: string) => {
  switch (it.kind) {
    case 'hook': return <Hook key={k} it={it} />;
    case 'card': return <Card key={k} it={it} />;
    case 'cta': return <Cta key={k} it={it} />;
    case 'broll': return <Broll key={k} it={it} />;
    case 'note': return <Note key={k} it={it} />;
    case 'colorcard': return <ColorCard key={k} it={it} />;
    case 'stamp': return <Stamp key={k} it={it} />;
    case 'counter': return <Counter key={k} it={it} />;
    case 'compare': return <Compare key={k} it={it} />;
    case 'list': return <ListEl key={k} it={it} />;
    case 'notify': return <Notify key={k} it={it} />;
    case 'flip': return <Flip key={k} it={it} />;
    default: return null;
  }
};

export const Reel: React.FC<ReelProps> = ({video, duration, words, items, punch, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const st: Style = {...DEFAULT_STYLE, ...(style || {})};
  const ctx: Ctx = {p: PALETTES[st.palette] || PALETTES.sun, f: FONTS[st.font] || FONTS.unbounded, st, fps, ov: {}};
  const t = frame / fps;
  const z = zoomAt(t, punch || [], st.motion);
  const live = items.filter((it) => it.t0 <= t && t < it.t1);
  const full = live.some((it) => it.kind === 'colorcard' || (it.kind === 'broll' && it.mode === 'full'));
  return (
    <C.Provider value={ctx}>
      <AbsoluteFill style={{background: '#000'}}>
        <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: '50% 40%'}}>
          <OffthreadVideo src={src(video)} style={{width: W, height: H, objectFit: 'cover'}} />
        </AbsoluteFill>
        {live.map((it, i) => {
          const k = `${it.kind}-${it.t0}-${i}`;
          return <ElScope key={k} kind={it.kind}>{el(it, k)}</ElScope>;
        })}

        {live.some((it) => it.kind === 'colorcard') ? null : <ElScope kind="captions"><Captions words={words} /></ElScope>}
        {full ? null : <div style={{position: 'absolute', left: 0, top: 0, height: 12, width: `${Math.min(1, t / duration) * 100}%`, background: ctx.p.accent}} />}
      </AbsoluteFill>
    </C.Provider>
  );
};
