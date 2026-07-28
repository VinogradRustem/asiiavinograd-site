// Данные для RSS-ленты Дзена (dzen.ru/help/ru/website/rss-modify.html)
// Отдельно от самой страницы лекции, чтобы не трогать уже рабочий код страницы.

export type RssArticle = {
  slug: string;
  title: string;
  link: string;
  pubDate: string; // RFC822
  coverImage: string;
  contentHtml: string; // допустимые теги: p, a, b, i, u, s, h1-h4, blockquote, ul/li, ol/li, figure/img
};

const BASE_URL = "https://www.drasiiavinograd.com";

export const rssArticles: RssArticle[] = [
  {
    slug: "gram-positive-bacteria",
    title: "Грамположительные бактерии — полный обзор для USMLE",
    link: `${BASE_URL}/microbiology/gram-positive-bacteria`,
    pubDate: "Tue, 29 Jul 2026 12:00:00 +0300",
    coverImage: `${BASE_URL}/lectures/gram-positive-bacteria/slide-01.jpg`,
    contentHtml: `
<p>Меня зовут Ася Виноград, я врач-кардиолог, PhD, и сама сейчас иду по пути IMG и готовлюсь к USMLE. В этой статье разбираем все грам-положительные бактерии — именно так, как нужно знать для Step 1. Только высокодоходный материал, без воды.</p>

<figure><img src="${BASE_URL}/lectures/gram-positive-bacteria/slide-01.jpg"><figcaption>Грамположительные бактерии — обзор</figcaption></figure>

<h2>Как думать о грам-положительных бактериях</h2>
<p>Когда вы делаете окраску по Граму, грам-положительные бактерии становятся фиолетовыми. Это потому что у них толстая клеточная стенка, которая удерживает краситель.</p>
<p>Первый вопрос — какая форма? У вас всего три варианта: палочки, круглые клетки, или ветвящиеся нити, похожие на маленькие веточки дерева. Уже только по форме вы отсеиваете две трети списка.</p>

<figure><img src="${BASE_URL}/lectures/gram-positive-bacteria/slide-02.jpg"><figcaption>Алгоритм определения</figcaption></figure>

<p><b>Верхняя дорожка — грам-положительные палочки.</b> Аэробная — Listeria, Bacillus, Corynebacterium. Анаэробная — Clostridium.</p>
<p><b>Нижняя дорожка — ветвящиеся нити.</b> Аэробная — Nocardia (слабо кислотоустойчива). Анаэробная — Actinomyces (не кислотоустойчива).</p>
<p><b>Средняя дорожка — кокки.</b> Каталаза-отрицательная — Streptococcus. Каталаза-положительная — Staphylococcus.</p>

<figure><img src="${BASE_URL}/lectures/gram-positive-bacteria/slide-03.jpg"><figcaption>Каталаза и гемолиз</figcaption></figure>

<p><b>Streptococcus делится по гемолизу:</b></p>
<ul>
<li>Альфа — Strep pneumoniae или Viridans</li>
<li>Бета — группа A (S. pyogenes) или группа B (S. agalactiae)</li>
<li>Гамма — Enterococcus</li>
</ul>
<p><b>Staphylococcus делится по коагулазе.</b> Коагулаза-положительный — Staph aureus. Коагулаза-отрицательный — S. epidermidis или S. saprophyticus.</p>

<figure><img src="${BASE_URL}/lectures/gram-positive-bacteria/slide-04.jpg"><figcaption>Итоговая карта алгоритма</figcaption></figure>

<h2>Staphylococcus</h2>
<figure><img src="${BASE_URL}/lectures/gram-positive-bacteria/slide-05.jpg"><figcaption>Staphylococcus — ключевые виды</figcaption></figure>
<p><b>Staph aureus</b> — коагулаза-положительный, рабочая лошадка USMLE: кожные инфекции, пневмония, эндокардит, остеомиелит, пищевое отравление, синдром токсического шока. Лечение: MSSA — нафциллин, MRSA — ванкомицин.</p>

<figure><img src="${BASE_URL}/lectures/gram-positive-bacteria/slide-06.jpg"><figcaption>Клинические проявления</figcaption></figure>
<p><b>Staph epidermidis</b> — кожа, протезы (биоплёнка), лечение ванкомицин. <b>Staph saprophyticus</b> — ИМВП у молодых женщин, лечение TMP-SMX.</p>

<h2>Streptococcus и Enterococcus</h2>
<figure><img src="${BASE_URL}/lectures/gram-positive-bacteria/slide-07.jpg"><figcaption>Streptococcus и Enterococcus</figcaption></figure>
<p><b>Strep pyogenes (группа A)</b> — ангина, ревматическая лихорадка, гломерулонефрит. <b>Strep agalactiae (группа B)</b> — менингит и сепсис новорождённых.</p>

<figure><img src="${BASE_URL}/lectures/gram-positive-bacteria/slide-08.jpg"><figcaption>Гемолиз и синдромы</figcaption></figure>
<p><b>Strep pneumoniae</b> — причина №1 внебольничной пневмонии и бактериального менингита у взрослых. <b>Enterococcus</b> — ИМВП, эндокардит; VRE лечим линезолидом.</p>

<h2>Спорообразующие палочки</h2>
<figure><img src="${BASE_URL}/lectures/gram-positive-bacteria/slide-09.jpg"><figcaption>Спорообразующие бактерии</figcaption></figure>
<p><b>Bacillus anthracis</b> — сибирская язва (кожная, лёгочная, кишечная формы). <b>Bacillus cereus</b> — пищевое отравление, самокупирующееся.</p>

<figure><img src="${BASE_URL}/lectures/gram-positive-bacteria/slide-10.jpg"><figcaption>Clostridium — четыре вида</figcaption></figure>
<p><b>Clostridium</b>: C. perfringens (газовая гангрена), C. tetani (столбняк, спастический паралич), C. botulinum (ботулизм, вялый паралич), C. difficile (колит после антибиотиков).</p>

<h2>Неспорообразующие палочки</h2>
<p><b>Listeria monocytogenes</b> — растёт в холодильнике, устойчива к цефалоспоринам, добавляем ампициллин. <b>Corynebacterium diphtheriae</b> — дифтерия. <b>Actinomyces</b> — пенициллин. <b>Nocardia</b> — TMP-SMX (классическая ловушка USMLE).</p>

<h2>Итог</h2>
<p>Грам-положительные бактерии — одна из самых высокодоходных тем USMLE Step 1 и Step 2. Понимайте логику алгоритма, а не просто запоминайте названия.</p>

<p><a href="${BASE_URL}">Больше материалов на сайте Dr. Asiia Vinograd</a></p>
`.trim(),
  },
];
