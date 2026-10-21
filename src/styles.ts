// Style presets Asiia chooses from in the style builder. A style = palette + font + caption + card + hook + motion.
export type Palette = {name: string; accent: string; accent2: string; panel: string; ink: string; text: string};
export const PALETTES: Record<string, Palette> = {
  sun: {name: 'Жёлтый на тёмно-синем', accent: '#FFD43B', accent2: '#FF5C4E', panel: 'rgba(12,24,42,0.93)', ink: '#0C182A', text: '#FFFFFF'},
  pink: {name: 'Кислотно-розовый', accent: '#FF2EA0', accent2: '#7CF2FF', panel: 'rgba(20,10,30,0.92)', ink: '#1A0B22', text: '#FFFFFF'},
  mint: {name: 'Мятный медицинский', accent: '#3DDC97', accent2: '#FFD43B', panel: 'rgba(6,32,36,0.92)', ink: '#06282C', text: '#FFFFFF'},
  clean: {name: 'Белый с синим', accent: '#2F7BFF', accent2: '#FF5C4E', panel: 'rgba(255,255,255,0.95)', ink: '#0B1B33', text: '#0B1B33'},
  coral: {name: 'Коралл и кремовый', accent: '#FF6B4A', accent2: '#FFE7C2', panel: 'rgba(40,18,12,0.9)', ink: '#2A120C', text: '#FFF6EA'},
  lilac: {name: 'Лиловый и лайм', accent: '#B69CFF', accent2: '#D8FF3D', panel: 'rgba(22,16,40,0.92)', ink: '#161028', text: '#FFFFFF'},
};
export type Font = {name: string; display: string; displayWeight: number; body: string; bodyWeight: number; upper: boolean};
export const FONTS: Record<string, Font> = {
  unbounded: {name: 'Unbounded (сейчас)', display: 'Unbounded', displayWeight: 900, body: 'Rubik', bodyWeight: 700, upper: true},
  montserrat: {name: 'Montserrat', display: 'Montserrat', displayWeight: 900, body: 'Montserrat', bodyWeight: 700, upper: true},
  oswald: {name: 'Oswald, узкий', display: 'Oswald', displayWeight: 700, body: 'Rubik', bodyWeight: 500, upper: true},
  russo: {name: 'Russo One', display: 'Russo One', displayWeight: 400, body: 'Rubik', bodyWeight: 700, upper: true},
  playfair: {name: 'Playfair, с засечками', display: 'Playfair Display', displayWeight: 800, body: 'Manrope', bodyWeight: 800, upper: false},
  manrope: {name: 'Manrope, спокойный', display: 'Manrope', displayWeight: 800, body: 'Manrope', bodyWeight: 800, upper: false},
};
export const CAPTIONS: Record<string, string> = {
  karaoke: 'Слова с подсветкой (сейчас)',
  pop: 'Крупно по 1–2 слова, с прыжком',
  box: 'Активное слово в цветной плашке',
  clean: 'Спокойные, без обводки',
  underline: 'Подчёркивание активного слова',
};
export const CARDS: Record<string, string> = {
  glass: 'Тёмная плашка с полосой (сейчас)',
  solid: 'Цветная карточка',
  sticker: 'Бумажный стикер от руки',
  minimal: 'Только текст с линией',
};
export const HOOKS: Record<string, string> = {
  panel: 'Плашка сверху (сейчас)',
  bigcenter: 'Огромные слова по центру',
  stamp: 'Штамп под углом',
};
// Fine-tuning of one element kind (Asiia's edits): colours, font, position, size, tilt, hidden.
export type ElOv = {accent?: string; ink?: string; panel?: string; text?: string; font?: string; dx?: number; dy?: number; scale?: number; tilt?: number; hide?: boolean};
export type Style = {palette: string; font: string; captions: string; cards: string; hook: string; motion: 'snappy' | 'smooth' | 'none'; el?: Record<string, ElOv>};
export const DEFAULT_STYLE: Style = {palette: 'sun', font: 'unbounded', captions: 'karaoke', cards: 'glass', hook: 'panel', motion: 'snappy'};
