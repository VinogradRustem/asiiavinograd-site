'use client';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import NavBar from '../../../../components/NavBar';
import Footer from '../../../../components/Footer';

export default function GramPositiveBacteriaPage() {
  const locale = useLocale();
  const isRu = locale === 'ru';
  const backUrl = isRu ? '/ru/microbiology' : '/microbiology';

  return (
    <>
      <NavBar />
      <main className="bg-[#0a0f1e] text-white min-h-screen font-sans">
        <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">

          <a href={backUrl} className="text-white/40 hover:text-white text-sm mb-8 transition-colors inline-block">
            ← {isRu ? 'Микробиология' : 'Microbiology'}
          </a>

          <p className="text-[#f47c5a] text-sm uppercase tracking-widest mb-3">Microbiology · Step 1</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            {isRu ? 'Грамположительные бактерии — полный обзор для USMLE' : 'Gram-Positive Bacteria — Complete Guide'}
          </h1>

          {/* Видео */}
          <div className="relative w-full mb-12 rounded-2xl overflow-hidden border border-white/10" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/z2io9SgLmgU"
              title="Gram-Positive Bacteria — Complete Guide"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {!isRu && (
            <p className="text-white/40 text-sm italic mb-10">
              Full written lecture below is currently available in Russian. English version coming soon.
            </p>
          )}

          {isRu && (
            <article className="prose prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-4 prose-p:text-white/70 prose-p:leading-relaxed prose-li:text-white/70 prose-strong:text-white">

              <p className="text-white/70 leading-relaxed">
                Меня зовут Ася Виноград, я врач-кардиолог, PhD, и сама сейчас иду по пути IMG и готовлюсь к USMLE.
                В этой статье разбираем все грам-положительные бактерии — именно так, как нужно знать для Step 1.
                Только высокодоходный материал, без воды.
              </p>

              <div className="my-10 rounded-xl overflow-hidden border border-white/10">
                <Image src="/lectures/gram-positive-bacteria/slide-01.jpg" alt="Грам-положительные бактерии" width={1440} height={810} className="w-full h-auto" />
              </div>

              <h2>Как думать о грам-положительных бактериях</h2>
              <p>
                Когда вы делаете окраску по Граму, грам-положительные бактерии становятся фиолетовыми. Это потому
                что у них толстая клеточная стенка, которая удерживает краситель.
              </p>
              <p>
                Первый вопрос — какая форма? У вас всего три варианта: палочки, круглые клетки, или ветвящиеся нити,
                похожие на маленькие веточки дерева. Уже только по форме вы отсеиваете две трети списка. Вот
                насколько мощным может быть один взгляд под микроскоп.
              </p>

              <div className="my-10 rounded-xl overflow-hidden border border-white/10">
                <Image src="/lectures/gram-positive-bacteria/slide-02.jpg" alt="Алгоритм определения грам-положительных бактерий" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p><strong>Верхняя дорожка — грам-положительные палочки.</strong> Видите палочки. Следующий вопрос — нужен ли этой бактерии кислород? Если да — аэробная — думаем про Listeria, Bacillus или Corynebacterium. Если нет — анаэробная — это Clostridium.</p>
              <p><strong>Нижняя дорожка — ветвящиеся нити.</strong> Та же логика. Аэробная — это Nocardia (слабо кислотоустойчива). Анаэробная — это Actinomyces (совсем не кислотоустойчива).</p>
              <p><strong>Средняя дорожка — кокки, круглые клетки.</strong> Это самая загруженная дорожка. Первое, что спрашиваем — каталазный тест. Каталаза-отрицательная — это Streptococcus (цепочки). Каталаза-положительная — это Staphylococcus (скопления как гроздья винограда).</p>

              <div className="my-10 rounded-xl overflow-hidden border border-white/10">
                <Image src="/lectures/gram-positive-bacteria/slide-03.jpg" alt="Разбор кокков: каталаза и гемолиз" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p><strong>Streptococcus делится по гемолизу</strong> — как бактерия разрушает эритроциты на агаре с кровью:</p>
              <ul>
                <li><strong>Альфа</strong> — частичное разрушение, зеленоватая зона. Кандидаты: Strep pneumoniae или Viridans. Пневмококк убивается оптохином и растворяется в желчи, виридансы — нет.</li>
                <li><strong>Бета</strong> — полное разрушение, прозрачная зона. Группа A (S. pyogenes: ангина, ревматическая лихорадка) или группа B (S. agalactiae: неонатальный менингит).</li>
                <li><strong>Гамма</strong> — никакого разрушения. Основной возбудитель — Enterococcus (растёт в солёных условиях).</li>
              </ul>
              <p><strong>Staphylococcus делится по коагулазе.</strong> Коагулаза-положительный — только Staph aureus, самый агрессивный. Коагулаза-отрицательный — S. epidermidis (кожа, протезы) или S. saprophyticus (ИМВП у молодых женщин).</p>

              <div className="my-10 rounded-xl overflow-hidden border border-white/10">
                <Image src="/lectures/gram-positive-bacteria/slide-04.jpg" alt="Итоговая карта алгоритма" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p>Вот и весь алгоритм. Если вы можете уверенно пройти эту карту — вы определите любую грам-положительную бактерию на USMLE меньше чем за тридцать секунд. Не запоминайте просто названия — запоминайте путь, который привёл вас к ответу.</p>

              <h2>Staphylococcus</h2>

              <div className="my-10 rounded-xl overflow-hidden border border-white/10">
                <Image src="/lectures/gram-positive-bacteria/slide-05.jpg" alt="Staphylococcus — ключевые виды" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p>Скопления. Каталаза-положительный. Ключевой тест — коагулаза.</p>
              <p><strong>Staph aureus</strong> — коагулаза-положительный. Это рабочая лошадка USMLE. Вызывает огромный список болезней: кожные инфекции (импетиго, флегмона, абсцессы), пневмонию (особенно после гриппа, часто с кавитарными очагами), эндокардит (классика у потребителей внутривенных наркотиков, поражает трёхстворчатый клапан), остеомиелит (самая частая причина в целом), пищевое отравление (рвота через 1–6 часов после еды, без лихорадки — это преформированный токсин), синдром токсического шока (высокая лихорадка, сыпь, гипотензия — тампоны, хирургические раны) и синдром обожжённой кожи у новорождённых.</p>
              <p>Уклоняется от иммунитета через белок A, который блокирует антитела. Лечение: MSSA — нафциллин, MRSA — ванкомицин.</p>

              <div className="my-10 rounded-xl overflow-hidden border border-white/10">
                <Image src="/lectures/gram-positive-bacteria/slide-06.jpg" alt="Клинические проявления Staphylococcus" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p><strong>Staph epidermidis</strong> — коагулаза-отрицательный, живёт на коже, поражает протезы (образует биоплёнку). Лечение — ванкомицин.</p>
              <p><strong>Staph saprophyticus</strong> — тоже коагулаза-отрицательный. Вызывает ИМВП у молодых сексуально активных женщин, вторая по частоте причина после E. coli. Лечение — TMP-SMX.</p>

              <h2>Streptococcus и Enterococcus</h2>

              <div className="my-10 rounded-xl overflow-hidden border border-white/10">
                <Image src="/lectures/gram-positive-bacteria/slide-07.jpg" alt="Streptococcus и Enterococcus" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p>Цепочки. Каталаза-отрицательные.</p>
              <p><strong>Strep pyogenes (группа A)</strong> — вызывает ангину и кожные инфекции. Опасность в том, что приходит после: ревматическая лихорадка (только после ангины, никогда после кожной инфекции — поражает сердце через молекулярную мимикрию) и постстрептококковый гломерулонефрит (кровь в моче, отёки вокруг глаз, повышенное давление). Лечение — пенициллин; группа A никогда не развивала резистентности.</p>
              <p><strong>Strep agalactiae (группа B)</strong> — про беременность и новорождённых. Самая частая причина менингита и сепсиса у новорождённых, поэтому беременных обследуют на 35–37 неделе.</p>

              <div className="my-10 rounded-xl overflow-hidden border border-white/10">
                <Image src="/lectures/gram-positive-bacteria/slide-08.jpg" alt="Гемолиз и клинические синдромы" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p><strong>Strep pneumoniae</strong> — альфа-гемолитический, полисахаридная капсула блокирует фагоцитоз. Причина номер один внебольничной пневмонии, бактериального менингита у взрослых и среднего отита у детей. Классика — внезапная лихорадка, мокрота цвета ржавчины, долевая пневмония. Группа риска — все без работающей селезёнки. Лечение — пенициллин или цефтриаксон.</p>
              <p><strong>Viridans strep</strong> — тоже альфа-гемолитический, живёт во рту, после стоматологических процедур может вызвать подострый эндокардит на повреждённых клапанах.</p>
              <p><strong>Enterococcus</strong> — гамма-гемолитический, живёт в кишечнике. Вызывает ИМВП, эндокардит и инфекции желчных путей. VRE (ванкомицин-резистентный) лечим линезолидом.</p>

              <h2>Спорообразующие палочки</h2>

              <div className="my-10 rounded-xl overflow-hidden border border-white/10">
                <Image src="/lectures/gram-positive-bacteria/slide-09.jpg" alt="Спорообразующие бактерии" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p>Bacillus и Clostridium образуют споры — так они выживают в жаре, времени, химикатах.</p>
              <p><strong>Bacillus anthracis</strong> — сибирская язва. Три формы: кожная (безболезненный чёрный струп, лечение — ципрофлоксацин), лёгочная (самая смертельная, расширенное средостение на рентгене), кишечная (от заражённого мяса).</p>
              <p><strong>Bacillus cereus</strong> — пищевое отравление. Разогретый рис → рвота через 1–6 часов; мясо/овощи → диарея через 8–16 часов. Самокупирующееся, антибиотики не нужны.</p>

              <div className="my-10 rounded-xl overflow-hidden border border-white/10">
                <Image src="/lectures/gram-positive-bacteria/slide-10.jpg" alt="Clostridium — четыре вида" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p><strong>Clostridium</strong> — анаэробы, четыре вида:</p>
              <ul>
                <li><strong>C. perfringens</strong> — газовая гангрена (травма плюс грязь, пузырьки газа в мышцах). Лечение — хирургия плюс пенициллин.</li>
                <li><strong>C. tetani</strong> — столбняк. Токсин блокирует тормозные сигналы → спастический паралич, начинается с челюсти (тризм). Лечение — иммуноглобулин плюс пенициллин плюс бензодиазепины.</li>
                <li><strong>C. botulinum</strong> — ботулизм, противоположность столбняка. Токсин блокирует ацетилхолин → вялый паралич, начинается с лица. Формы: пищевая (консервы), детская (мёд, «вялый ребёнок» — классика USMLE), раневая. Лечение — антитоксин (для младенцев — BabyBIG).</li>
                <li><strong>C. difficile</strong> — псевдомембранозный колит после антибиотиков (особенно клиндамицина). Лечение — пероральный ванкомицин или фидаксомицин.</li>
              </ul>

              <h2>Неспорообразующие палочки</h2>
              <p><strong>Listeria monocytogenes</strong> — растёт даже в холодильнике при 4°C (колбасные нарезки, мягкие сыры, копчёная рыба). Болеют беременные, новорождённые, пожилые, иммунокомпрометированные. Критический факт — устойчива ко всем цефалоспоринам, поэтому при неэффективности цефтриаксона с ванкомицином добавляем ампициллин.</p>
              <p><strong>Corynebacterium diphtheriae</strong> — дифтерия. Токсин блокирует синтез белка, в горле формируется толстая серая плёнка. Лечение — сначала антитоксин, потом пенициллин.</p>
              <p><strong>Actinomyces israelii</strong> — анаэробная нитевидная палочка, не кислотоустойчива, живёт во рту в норме. Плотное образование на челюсти с «серными гранулами». Лечение — пенициллин 6–12 месяцев.</p>
              <p><strong>Nocardia</strong> — аэробная нитевидная палочка, слабо кислотоустойчива, живёт в почве. Поражает иммунокомпрометированных, начинается в лёгких (как туберкулёз), распространяется в мозг. Лечение — TMP-SMX, не пенициллин.</p>
              <p>Классическая ловушка USMLE: Actinomyces → пенициллин. Nocardia → TMP-SMX.</p>

              <h2>Классические сравнения USMLE</h2>
              <p>Пары, которые любит экзамен:</p>
              <ul>
                <li><strong>Staph vs Strep</strong> — скопления против цепочек, каталаза-положительный против каталаза-отрицательного.</li>
                <li><strong>Pneumoniae vs Viridans</strong> — оба альфа-гемолитические; пневмококк убивается оптохином и растворяется в желчи, виридансы — нет.</li>
                <li><strong>Actinomyces vs Nocardia</strong> — обе нитевидные; Actinomyces анаэробная / не кислотоустойчива / флора рта / пенициллин, Nocardia аэробная / слабо кислотоустойчива / почва / TMP-SMX.</li>
                <li><strong>Tetani vs Botulinum</strong> — один род, противоположные эффекты; тетани — спастический паралич снизу вверх, ботулинум — вялый паралич сверху вниз.</li>
              </ul>

              <h2>Разбор клинических задач</h2>

              <p><strong>Задача 1 — Streptococcus pneumoniae и селезёнка.</strong> Мужчина 67 лет, внезапная лихорадка, мокрота цвета ржавчины, долевая консолидация, грам-положительные диплококки парами, альфа-гемолитический, растворяется в желчи. Классика пневмококковой пневмонии. Почему селезёнка критична? Потому что она — основное место опсонизации и фагоцитоза инкапсулированных бактерий. Мнемоника SHiN: Strep pneumoniae, Haemophilus influenzae, Neisseria meningitidis — три бактерии, критичные при аспленизме.</p>

              <p><strong>Задача 2 — механизм токсина C. tetani.</strong> Строитель, ржавый гвоздь, тризм, ригидность, гиперрефлексия. Тетаноспазмин — цинк-зависимая протеаза, движется ретроградно к спинному мозгу, расщепляет SNARE-белки в тормозных интернейронах, блокируя глицин и ГАМК. Результат — неконтролируемое сокращение мышц, спастический паралич. Не путать с ботулотоксином — тот блокирует ацетилхолин в нервно-мышечном соединении, вызывая вялый паралич.</p>

              <p><strong>Задача 3 — детский ботулизм vs пищевой.</strong> Младенец 4 месяцев, мёд на соске, «вялый ребёнок», запор. При детском ботулизме бактерия колонизирует кишечник и производит токсин внутри организма; при пищевом — токсин уже сформирован и просто заглатывается. У взрослых нормальная флора подавляет C. botulinum, у младенцев флора незрелая.</p>

              <p><strong>Задача 4 — Nocardia vs Actinomyces, главная ловушка.</strong> Пациент с ВИЧ, CD4 = 62, кавитарный очаг в лёгких плюс кольцевидные очаги в мозге, грам-положительные ветвящиеся палочки, каталаза-положительные, слабо кислотоустойчивы. Это Nocardia (аэробная, из почвы, диссеминация в лёгкие и мозг у иммунокомпрометированных) — лечение TMP-SMX, не пенициллин.</p>

              <h2>Итог</h2>
              <p>Три вещи, с которыми нужно уйти:</p>
              <ol>
                <li><strong>Алгоритм.</strong> Форма говорит о группе: скопления — стафилококк, цепочки — стрептококк, палочки делятся на спорообразующие (Bacillus, Clostridium) и неспорообразующие, ветвящиеся нити — Nocardia или Actinomyces.</li>
                <li><strong>Классические пары</strong> — то, что USMLE тестирует больше всего.</li>
                <li><strong>Лечебные ловушки</strong> — Actinomyces (пенициллин) против Nocardia (TMP-SMX), Listeria (добавляем ампициллин), MRSA (ванкомицин), VRE (линезолид), C. difficile (пероральный ванкомицин).</li>
              </ol>
              <p>Грам-положительные бактерии — одна из самых высокодоходных тем USMLE Step 1 и Step 2. Если вы понимаете логику, а не просто запоминаете названия — вы ответите почти на любой вопрос по этой теме.</p>

            </article>
          )}

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4">
            <a href="https://t.me/usmle_vinograd" target="_blank" rel="noopener noreferrer" className="bg-[#f47c5a] hover:bg-[#e06b49] text-white px-8 py-3 rounded-full font-medium transition-colors text-center">
              {isRu ? 'Подписаться в Telegram' : 'Join on Telegram'}
            </a>
            <a href="https://youtube.com/@USMLEforIMG" target="_blank" rel="noopener noreferrer" className="border border-white/30 hover:border-white/60 text-white px-8 py-3 rounded-full font-medium transition-colors text-center">
              {isRu ? 'Смотреть на YouTube' : 'Watch on YouTube'}
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
