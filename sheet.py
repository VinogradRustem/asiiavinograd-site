#!/usr/bin/env python3
"""Contact sheets from the storyboard: one image per step, options numbered with a short Russian label."""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont
d = sys.argv[1]
FONT = sys.argv[2] if len(sys.argv) > 2 else '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
L = {
 'palette': {'sun': 'Жёлтый (сейчас)', 'pink': 'Кислотно-розовый', 'mint': 'Мятный', 'clean': 'Белый с синим', 'coral': 'Коралл', 'lilac': 'Лиловый'},
 'font': {'unbounded': 'Unbounded (сейчас)', 'montserrat': 'Montserrat', 'oswald': 'Oswald, узкий', 'russo': 'Russo One', 'playfair': 'С засечками', 'manrope': 'Manrope, спокойный'},
 'captions': {'karaoke': 'Подсветка слова (сейчас)', 'pop': 'Крупно по 1–2 слова', 'box': 'Слово в плашке', 'clean': 'Спокойные', 'underline': 'Подчёркивание'},
 'cards': {'glass': 'Тёмная плашка (сейчас)', 'solid': 'Цветная карточка', 'sticker': 'Стикер от руки', 'minimal': 'Только текст'},
 'hook': {'panel': 'Плашка сверху (сейчас)', 'bigcenter': 'Огромно по центру', 'stamp': 'Штамп'},
 'preview': {}, 'elements': {'note': 'Пометка от руки', 'colorcard': 'Цветной экран со словом', 'stamp': 'Штамп с цифрой', 'broll_card': 'Вставка окошком', 'broll_full': 'Вставка на весь экран', 'counter': 'Цифра со счётчиком', 'compare': 'Сравнение полосками', 'list': 'Список по пунктам', 'notify': 'Вопрос как уведомление', 'flip': 'Карточка вопрос-ответ'},
}
TITLE = {'preview': 'Как ролик выглядит сейчас', 'palette': 'Шаг 1. Цвет', 'font': 'Шаг 2. Шрифт', 'captions': 'Шаг 3. Субтитры', 'cards': 'Шаг 4. Карточки', 'hook': 'Шаг 5. Крючок в начале', 'elements': 'Шаг 6. Элементы (можно несколько)'}
man = json.load(open(os.path.join(d, 'manifest.json')))
f_big, f_lab = ImageFont.truetype(FONT, 44), ImageFont.truetype(FONT, 24)
out = []
for step in TITLE:
    rows = [m for m in man if m['step'] == step]
    if not rows: continue
    opts = list(dict.fromkeys(m['option'] for m in rows))
    per = max(1, len([m for m in rows if m['option'] == opts[0]]))
    tw, th = 270, 480  # thumbnail
    cols = min(len(opts), 3 if per > 1 else 4 if step == 'preview' else 6 if len(opts) > 4 else len(opts))
    cell_w = per * tw + (per - 1) * 8 + 24
    nrow = -(-len(opts) // cols)
    W, H = max(cols * cell_w + 24, 1300), 90 + nrow * (th + 70)
    img = Image.new('RGB', (W, H), (18, 20, 26)); dr = ImageDraw.Draw(img)
    dr.text((24, 24), TITLE[step], font=f_big, fill=(255, 255, 255))
    for i, o in enumerate(opts):
        x0, y0 = 24 + (i % cols) * cell_w, 90 + (i // cols) * (th + 70)
        for j, m in enumerate([m for m in rows if m['option'] == o]):
            im = Image.open(os.path.join(d, m['file'])).convert('RGB').resize((tw, th))
            img.paste(im, (x0 + j * (tw + 8), y0))
        lab = next((m.get('label') for m in rows if m['option'] == o and m.get('label')), None)
        KIND = {'hook': 'крючок', 'card': 'карточка', 'cta': 'призыв', 'broll': 'вставка', 'note': 'пометка', 'colorcard': 'цветной экран', 'stamp': 'штамп',
                'counter': 'счётчик', 'compare': 'сравнение', 'list': 'список', 'notify': 'уведомление', 'flip': 'вопрос-ответ'}
        if lab:
            tm, kd = lab.split(' ', 1); lab = f'{tm} {KIND.get(kd, kd)}'
        words, line, ly = f'{i + 1}. {lab or L[step].get(o, o)}'.split(), '', y0 + th + 8
        for wd in words:  # wrap the label to the cell width
            if line and dr.textlength(line + ' ' + wd, font=f_lab) > cell_w - 30:
                dr.text((x0, ly), line, font=f_lab, fill=(255, 212, 59)); ly += 28; line = wd
            else:
                line = (line + ' ' + wd).strip()
        dr.text((x0, ly), line, font=f_lab, fill=(255, 212, 59))
    p = os.path.join(d, f'sheet_{step}.jpg'); img.save(p, quality=85); out.append(p)
print('\n'.join(out))
