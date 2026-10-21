// Storyboard for the style builder: the same frames of a real reel rendered in every option of each step.
// node storyboard.mjs <props.json> <outdir> [publicDir] [step1,step2,...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'fs';
import path from 'path';

const [propsFile, outDir, publicDir, onlySteps] = process.argv.slice(2);
const props = JSON.parse(fs.readFileSync(propsFile, 'utf8'));
const base = props.style || {};
fs.mkdirSync(outDir, {recursive: true});
const browserExecutable = process.env.REMOTION_BROWSER || undefined;
const firstOf = (k) => props.items.find((i) => i.kind === k);
const mid = (it) => (it ? Math.round(((it.t0 + it.t1) / 2) * 30) : 30);
const late = (it) => (it ? Math.round((it.t1 - 0.4) * 30) : 30);
const hook = firstOf('hook'), card = firstOf('card');
// a frame with speech but no overlay, for caption styles
const busy = (t) => props.items.some((i) => i.t0 <= t && t < i.t1);
const w = props.words.find((x) => !busy(x.s + 0.2) && x.s > 1) || props.words[Math.floor(props.words.length / 2)];
const capFrame = Math.round((w.s + 0.2) * 30);

const STEPS = {
  palette: {frames: [mid(hook), late(card)], options: ['sun', 'pink', 'mint', 'clean', 'coral', 'lilac'], key: 'palette'},
  font: {frames: [mid(hook), late(card)], options: ['unbounded', 'montserrat', 'oswald', 'russo', 'playfair', 'manrope'], key: 'font'},
  captions: {frames: [capFrame], options: ['karaoke', 'pop', 'box', 'clean', 'underline'], key: 'captions'},
  cards: {frames: [late(card)], options: ['glass', 'solid', 'sticker', 'minimal'], key: 'cards'},
  hook: {frames: [mid(hook)], options: ['panel', 'bigcenter', 'stamp'], key: 'hook'},
};
const steps = onlySteps ? onlySteps.split(',') : ['preview'].concat(Object.keys(STEPS), ['elements']);

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), publicDir: publicDir ? path.resolve(publicDir) : undefined});
const manifest = [];
const shot = async (name, inputProps, frame) => {
  const comp = await selectComposition({serveUrl, id: 'Reel', inputProps, browserExecutable});
  const output = path.join(outDir, name + '.png');
  await renderStill({composition: comp, serveUrl, output, inputProps, frame: Math.min(frame, comp.durationInFrames - 1), browserExecutable, scale: 0.5});
  return output;
};
for (const s of steps) {
  if (s === 'preview') {
    // the reel as it will look in the current style: one frame from each of the first overlays
    const picks = props.items.filter((i) => i.kind !== 'broll' || i.path).slice(0, 8);
    for (const [j, it] of picks.entries()) {
      const fr = it.kind === 'colorcard' ? Math.round((it.t0 + 0.4) * 30) : late(it);
      const f = await shot(`preview__${j + 1}`, {...props, style: base}, fr);
      manifest.push({step: 'preview', option: `${j + 1}`, label: `${Math.floor(fr / 30 / 60)}:${String(Math.floor(fr / 30) % 60).padStart(2, '0')} ${it.kind}`, file: path.basename(f)});
    }
    continue;
  }
  if (s === 'elements') {
    // each element shown once, inserted at the caption frame so it never overlaps the plan
    const t = capFrame / 30;
    const els = [
      ['note', {kind: 'note', t0: t - 0.6, t1: t + 1.5, text: props.noteText || 'запомни!'}],
      ['colorcard', {kind: 'colorcard', t0: t - 0.6, t1: t + 1, big: props.beatWord || 'ВАЖНО'}],
      ['stamp', {kind: 'stamp', t0: t - 0.6, t1: t + 1.5, big: props.stampText || '70%', small: props.stampSmall || ''}],
      ['counter', {kind: 'counter', t0: t - 1.2, t1: t + 1.5, value: props.counterValue || 70, unit: props.counterUnit ?? '%', label: props.counterLabel || 'забывается за неделю'}],
      ['compare', {kind: 'compare', t0: t - 1.5, t1: t + 1.5, title: props.compareTitle || 'Запоминание', bars: props.bars || [{label: 'без повторения', value: 30, tone: 'minus'}, {label: 'с повторением', value: 85, tone: 'plus'}]}],
      ['list', {kind: 'list', t0: t - 2.5, t1: t + 1.5, title: props.listTitle || 'План на день', lines: props.listLines || [{text: '2 часа UWorld'}, {text: '1 час Anki'}, {text: 'разбор ошибок'}]}],
      ['notify', {kind: 'notify', t0: t - 0.8, t1: t + 1.5, text: props.notifyText || 'Сколько вопросов в день решать?'}],
      ['flip', {kind: 'flip', t0: t - 1.2, t1: t + 0.6, q: props.flipQ || 'Самая частая причина ХСН?', a: props.flipA || 'ИБС'}],
    ];
    const br = props.items.find((i) => i.kind === 'broll' && i.path);
    if (br) {
      els.push(['broll_card', {...br, kind: 'broll', mode: 'card', t0: t - 0.6, t1: t + 2}]);
      els.push(['broll_full', {...br, kind: 'broll', mode: 'full', t0: t - 0.6, t1: t + 2}]);
    }
    for (const [name, it] of els) {
      const items = props.items.filter((i) => !(i.t0 <= t + 2 && i.t1 > t - 0.6)).concat([it]);
      const f = await shot(`elements__${name}`, {...props, items, style: base}, capFrame);
      manifest.push({step: 'elements', option: name, file: path.basename(f)});
    }
    continue;
  }
  const S = STEPS[s];
  for (const opt of S.options) {
    for (const [j, fr] of S.frames.entries()) {
      const f = await shot(`${s}__${opt}__${j}`, {...props, style: {...base, [S.key]: opt}}, fr);
      manifest.push({step: s, option: opt, frame: j, file: path.basename(f)});
    }
  }
  console.log('step', s, 'done');
}
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 1));
console.log('DONE', manifest.length);
