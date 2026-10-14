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
      <main className="page-bg text-ink min-h-screen font-sans">
        <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">

          <a href={backUrl} className="text-muted hover:text-ink text-sm mb-8 transition-colors inline-block">
            ← {isRu ? 'Микробиология' : 'Microbiology'}
          </a>

          <p className="text-slate text-sm uppercase tracking-widest mb-3">Microbiology · Step 1</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
            {isRu ? 'Грамположительные бактерии — полный обзор для USMLE' : 'Gram-Positive Bacteria — Complete Guide'}
          </h1>

          {/* Видео - собственный плеер (не YouTube), чтобы грузилось у зрителей из России */}
          <div className="relative w-full mb-12 rounded-[24px] overflow-hidden border border-white bg-black">
            <video
              className="w-full h-auto"
              controls
              playsInline
              preload="metadata"
              poster="/lectures/gram-positive-bacteria/slide-01.jpg"
            >
              <source src={isRu ? "https://pub-6375af3fe2f64aa0ac6014cdf815d792.r2.dev/asiiavinograd-lectures/gram-positive-bacteria.mp4" : "https://pub-6375af3fe2f64aa0ac6014cdf815d792.r2.dev/asiiavinograd-lectures/gram-positive-bacteria-en.mp4"} type="video/mp4" />
            </video>
          </div>

          {!isRu && (
            <article>

              <p className="text-xl text-graphite leading-[1.7] font-light mb-10">
                Hi everyone! I&apos;m Dr. Asiia Vinograd — physician, cardiologist, PhD, and an IMG currently on my
                own USMLE journey. In this article we&apos;re covering all gram-positive bacteria — exactly the way
                you need to know it for Step 1. High-yield, no fluff.
              </p>

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-01.jpg" alt="Gram-Positive Bacteria" width={1440} height={810} className="w-full h-auto" />
              </div>

              <h2 className="text-3xl font-bold text-ink mt-16 mb-2">How to Think About Gram-Positive Bacteria</h2>
              <div className="w-10 h-1 bg-slate rounded-full mb-6" />
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                When you do a Gram stain, gram-positive bacteria turn purple. That&apos;s because they have a thick
                wall that holds the dye.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                The first question — what shape do you see? You only have three options: rods, round cells, or
                branching filaments that look like little tree branches. Just from the shape, you&apos;ve already
                cut the list by two-thirds. That&apos;s how powerful one look under the microscope is.
              </p>

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-02.jpg" alt="Gram-positive identification algorithm" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Top lane — gram-positive rods.</strong> Next question — does this bug need oxygen? If yes — aerobic — think Listeria, Bacillus, or Corynebacterium. If no — anaerobic — think Clostridium.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Bottom lane — branching filaments.</strong> Same logic. Aerobic — that&apos;s Nocardia (weakly acid-fast). Anaerobic — that&apos;s Actinomyces (not acid-fast at all).
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Middle lane — cocci, the round ones.</strong> This is the busy lane. First ask the catalase test. Catalase-negative → Streptococcus (chains). Catalase-positive → Staphylococcus (clusters, like grapes).
              </p>

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-03.jpg" alt="Cocci breakdown: catalase and hemolysis" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p className="text-lg text-graphite leading-[1.8] mb-3">
                <strong className="text-ink font-semibold">Streptococcus splits by hemolysis</strong> — how it destroys red blood cells on a blood agar plate:
              </p>
              <ul className="space-y-2 mb-6 pl-1">
                <li className="text-lg text-graphite leading-[1.7] flex gap-3"><span className="text-slate mt-1">•</span><span><strong className="text-ink font-semibold">Alpha</strong> — partial destruction, green zone. Candidates: S. pneumoniae or Viridans. Pneumoniae is killed by optochin and dissolves in bile — Viridans is not.</span></li>
                <li className="text-lg text-graphite leading-[1.7] flex gap-3"><span className="text-slate mt-1">•</span><span><strong className="text-ink font-semibold">Beta</strong> — complete destruction, clear zone. Group A (S. pyogenes: strep throat, rheumatic fever) or Group B (S. agalactiae: neonatal meningitis).</span></li>
                <li className="text-lg text-graphite leading-[1.7] flex gap-3"><span className="text-slate mt-1">•</span><span><strong className="text-ink font-semibold">Gamma</strong> — no destruction. Main culprit: Enterococcus (tolerates salty conditions).</span></li>
              </ul>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Staphylococcus splits by coagulase.</strong> Coagulase-positive — only Staph aureus, the aggressive one. Coagulase-negative — S. epidermidis (skin, prosthetics) or S. saprophyticus (UTI in young women).
              </p>

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-04.jpg" alt="Final algorithm map" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p className="text-lg text-graphite leading-[1.8] mb-5">
                That&apos;s the entire algorithm. If you can walk through this map confidently, you can identify any
                gram-positive bug on USMLE in under thirty seconds. Don&apos;t memorize names alone — memorize the
                path you took to get there.
              </p>

              <h2 className="text-3xl font-bold text-ink mt-16 mb-2">Staphylococcus</h2>
              <div className="w-10 h-1 bg-slate rounded-full mb-6" />

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-05.jpg" alt="Staphylococcus — key species" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p className="text-lg text-graphite leading-[1.8] mb-5">Clusters. Catalase-positive. The key test is coagulase.</p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Staph aureus</strong> — coagulase-positive. The workhorse of USMLE. Causes a huge list of diseases: skin infections (impetigo, cellulitis, abscesses), pneumonia (especially after the flu, often with lung cavities), endocarditis (classic in IV drug users, attacks the tricuspid valve), osteomyelitis (most common cause overall), food poisoning (vomiting 1–6 hours after eating, no fever — preformed toxin), toxic shock syndrome (high fever, rash, hypotension — tampons, surgical wounds), and scalded skin syndrome in newborns.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                Dodges the immune system via protein A, which blocks antibodies. Treatment: MSSA — nafcillin, MRSA — vancomycin.
              </p>

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-06.jpg" alt="Staphylococcus clinical manifestations" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Staph epidermidis</strong> — coagulase-negative, lives on skin, infects prosthetics via biofilm. Treat with vancomycin.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Staph saprophyticus</strong> — also coagulase-negative. Causes UTI in young, sexually active women — second most common cause after E. coli. Treat with TMP-SMX.
              </p>

              <h2 className="text-3xl font-bold text-ink mt-16 mb-2">Streptococcus and Enterococcus</h2>
              <div className="w-10 h-1 bg-slate rounded-full mb-6" />

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-07.jpg" alt="Streptococcus and Enterococcus" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p className="text-lg text-graphite leading-[1.8] mb-5">Chains. Catalase-negative.</p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Strep pyogenes (Group A)</strong> — strep throat and skin infections. The danger comes after: rheumatic fever (only after strep throat, never after skin infection — damages the heart via molecular mimicry) and post-strep glomerulonephritis (blood in urine, swelling around the eyes, high blood pressure). Treatment — penicillin; Group A has never developed resistance.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Strep agalactiae (Group B)</strong> — all about pregnancy and newborns. Most common cause of neonatal meningitis and sepsis, which is why pregnant women are screened at 35–37 weeks.
              </p>

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-08.jpg" alt="Hemolysis and clinical syndromes" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Strep pneumoniae</strong> — alpha-hemolytic, polysaccharide capsule blocks phagocytosis. Number one cause of community-acquired pneumonia, bacterial meningitis in adults, and otitis media in kids. Classic picture — sudden fever, rust-colored sputum, lobar pneumonia. High-risk group — anyone without a working spleen. Treatment — penicillin or ceftriaxone.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Viridans strep</strong> — also alpha-hemolytic, lives in the mouth. After dental work can cause subacute endocarditis on already-damaged valves.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Enterococcus</strong> — gamma-hemolytic, lives in the gut. Causes UTI, endocarditis, and biliary infections. VRE (vancomycin-resistant) is treated with linezolid.
              </p>

              <h2 className="text-3xl font-bold text-ink mt-16 mb-2">Spore-Forming Rods</h2>
              <div className="w-10 h-1 bg-slate rounded-full mb-6" />

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-09.jpg" alt="Spore-forming bacteria" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p className="text-lg text-graphite leading-[1.8] mb-5">
                Bacillus and Clostridium make spores — that&apos;s how they survive heat, time, and chemicals.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Bacillus anthracis</strong> — anthrax. Three forms: cutaneous (painless black eschar, treat with ciprofloxacin), inhalational (the deadly one, widened mediastinum on X-ray), and GI (from contaminated meat).
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Bacillus cereus</strong> — food poisoning. Reheated rice → vomiting in 1–6 hours; meat/vegetables → diarrhea in 8–16 hours. Self-limited, no antibiotics needed.
              </p>

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-10.jpg" alt="Clostridium — four species" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p className="text-lg text-graphite leading-[1.8] mb-3">
                <strong className="text-ink font-semibold">Clostridium</strong> — anaerobes, four species you must know:
              </p>
              <ul className="space-y-2 mb-6 pl-1">
                <li className="text-lg text-graphite leading-[1.7] flex gap-3"><span className="text-slate mt-1">•</span><span><strong className="text-ink font-semibold">C. perfringens</strong> — gas gangrene (trauma plus dirt, gas bubbles in muscle on imaging). Treatment — surgery plus penicillin.</span></li>
                <li className="text-lg text-graphite leading-[1.7] flex gap-3"><span className="text-slate mt-1">•</span><span><strong className="text-ink font-semibold">C. tetani</strong> — tetanus. Toxin blocks inhibitory signals → spastic paralysis, starts with the jaw (trismus). Treatment — immunoglobulin plus penicillin plus benzodiazepines.</span></li>
                <li className="text-lg text-graphite leading-[1.7] flex gap-3"><span className="text-slate mt-1">•</span><span><strong className="text-ink font-semibold">C. botulinum</strong> — botulism, the opposite of tetanus. Toxin blocks acetylcholine → flaccid paralysis, starts with the face. Forms: foodborne (canned goods), infant (honey, "floppy baby" — classic USMLE), wound. Treatment — antitoxin (BabyBIG for infants).</span></li>
                <li className="text-lg text-graphite leading-[1.7] flex gap-3"><span className="text-slate mt-1">•</span><span><strong className="text-ink font-semibold">C. difficile</strong> — pseudomembranous colitis after antibiotics (especially clindamycin). Treatment — oral vancomycin or fidaxomicin.</span></li>
              </ul>

              <h2 className="text-3xl font-bold text-ink mt-16 mb-2">Non-Spore-Forming Rods</h2>
              <div className="w-10 h-1 bg-slate rounded-full mb-6" />
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Listeria monocytogenes</strong> — grows even in the fridge at 4°C (deli meats, soft cheeses, smoked fish). Affects pregnant women, newborns, the elderly, and the immunocompromised. Critical fact — naturally resistant to all cephalosporins, so if ceftriaxone plus vancomycin isn&apos;t working, add ampicillin.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Corynebacterium diphtheriae</strong> — diphtheria. Toxin shuts down protein synthesis, a thick grey membrane forms in the throat. Treatment — antitoxin first, then penicillin.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Actinomyces israelii</strong> — anaerobic filamentous rod, not acid-fast, normal mouth flora. Firm jaw mass with &quot;sulfur granules.&quot; Treatment — penicillin for 6–12 months.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-6">
                <strong className="text-ink font-semibold">Nocardia</strong> — aerobic filamentous rod, weakly acid-fast, lives in soil. Affects the immunocompromised, starts in the lungs (looks like TB), spreads to the brain. Treatment — TMP-SMX, not penicillin.
              </p>

              <div className="my-8 rounded-xl border border-steel/30 bg-steel/[0.06] pl-6 pr-6 py-5 border-l-4 border-l-[#5f8190]">
                <p className="text-xs font-bold uppercase tracking-wider text-steel mb-2">⚡ USMLE Trap</p>
                <p className="text-lg text-graphite leading-[1.7]">Actinomyces → penicillin. Nocardia → TMP-SMX. Burn that in.</p>
              </div>

              <h2 className="text-3xl font-bold text-ink mt-16 mb-2">Classic USMLE Comparisons</h2>
              <div className="w-10 h-1 bg-slate rounded-full mb-6" />
              <p className="text-lg text-graphite leading-[1.8] mb-4">The pairs the exam loves:</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl border border-white bg-white/60 p-5">
                  <p className="text-ink font-semibold mb-1">Staph vs Strep</p>
                  <p className="text-graphite leading-[1.6]">Clusters vs chains. Catalase-positive vs catalase-negative.</p>
                </div>
                <div className="rounded-xl border border-white bg-white/60 p-5">
                  <p className="text-ink font-semibold mb-1">Pneumoniae vs Viridans</p>
                  <p className="text-graphite leading-[1.6]">Both alpha-hemolytic; pneumoniae is killed by optochin and dissolves in bile, Viridans is not.</p>
                </div>
                <div className="rounded-xl border border-white bg-white/60 p-5">
                  <p className="text-ink font-semibold mb-1">Actinomyces vs Nocardia</p>
                  <p className="text-graphite leading-[1.6]">Both branching filaments; Actinomyces anaerobic / not acid-fast / mouth flora / penicillin, Nocardia aerobic / weakly acid-fast / soil / TMP-SMX.</p>
                </div>
                <div className="rounded-xl border border-white bg-white/60 p-5">
                  <p className="text-ink font-semibold mb-1">Tetani vs Botulinum</p>
                  <p className="text-graphite leading-[1.6]">Same genus, opposite effects; tetani — spastic, ascends from the jaw. Botulinum — flaccid, descends from the face.</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-ink mt-16 mb-2">Clinical Vignettes</h2>
              <div className="w-10 h-1 bg-slate rounded-full mb-6" />

              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Question 1 — Strep pneumoniae and the spleen.</strong> A 67-year-old man, sudden fever, rust-colored sputum, lobar consolidation, gram-positive diplococci in pairs, alpha-hemolytic, lysed by bile. Classic pneumococcal pneumonia. Why is the spleen critical? Because it&apos;s the primary site of opsonization and phagocytosis of encapsulated bacteria. Mnemonic SHiN: Strep pneumoniae, Haemophilus influenzae, Neisseria meningitidis — the three organisms critical in asplenic patients.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Question 2 — C. tetani toxin mechanism.</strong> A construction worker, rusty nail, trismus, rigidity, hyperreflexia. Tetanospasmin is a zinc-dependent protease that travels retrograde to the spinal cord and cleaves SNARE proteins at inhibitory interneurons, blocking glycine and GABA. Result — uncontrolled muscle contraction, spastic paralysis. (Not to be confused with botulinum toxin, which blocks acetylcholine at the neuromuscular junction, causing flaccid paralysis.)
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Question 3 — infant vs foodborne botulism.</strong> A 4-month-old, honey on the pacifier, &quot;floppy baby,&quot; constipation. In infant botulism the organism colonizes the gut and produces toxin in vivo; in foodborne botulism, preformed toxin is simply ingested. Adult gut flora outcompetes C. botulinum — infant flora is immature.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-8">
                <strong className="text-ink font-semibold">Question 4 — Nocardia vs Actinomyces, the ultimate trap.</strong> An HIV patient, CD4 of 62, cavitary lung lesion plus ring-enhancing brain lesions, gram-positive branching rods, catalase-positive, weakly acid-fast. This is Nocardia (aerobic, soil organism, disseminates to lungs and brain in the immunocompromised) — treatment is TMP-SMX, not penicillin.
              </p>

              <div className="mt-16 rounded-[24px] border border-steel/30 bg-gradient-to-br from-steel/[0.08] to-transparent p-8">
                <p className="text-xs font-bold uppercase tracking-wider text-slate mb-3">Bottom Line</p>
                <p className="text-lg text-graphite leading-[1.7] mb-5">Three things to walk away with today:</p>
                <ol className="space-y-4 mb-5">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate/20 text-slate font-bold text-sm flex items-center justify-center">1</span>
                    <span className="text-graphite leading-[1.7]"><strong className="text-ink">The framework.</strong> Shape tells you the group: clusters — Staph, chains — Strep. Rods split into spore-formers (Bacillus, Clostridium) and non-spore-formers. Branching filaments — Nocardia or Actinomyces (aerobic/anaerobic, acid-fast or not).</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate/20 text-slate font-bold text-sm flex items-center justify-center">2</span>
                    <span className="text-graphite leading-[1.7]"><strong className="text-ink">The classic pairs</strong> — these are what USMLE tests the most.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate/20 text-slate font-bold text-sm flex items-center justify-center">3</span>
                    <span className="text-graphite leading-[1.7]"><strong className="text-ink">The treatment traps</strong> — Actinomyces (penicillin) vs Nocardia (TMP-SMX), Listeria (add ampicillin), MRSA (vancomycin), VRE (linezolid), C. difficile (oral vancomycin).</span>
                  </li>
                </ol>
                <p className="text-graphite leading-[1.7]">
                  Gram-positive bacteria are one of the highest-yield topics on USMLE Step 1 and Step 2. If you understand the logic — not just memorize the names — you can answer almost any question about them.
                </p>
              </div>

            </article>
          )}

          {isRu && (
            <article>

              <p className="text-xl text-graphite leading-[1.7] font-light mb-10">
                Меня зовут Ася Виноград, я врач-кардиолог, PhD, и сама сейчас иду по пути IMG и готовлюсь к USMLE.
                В этой статье разбираем все грам-положительные бактерии — именно так, как нужно знать для Step 1.
                Только высокодоходный материал, без воды.
              </p>

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-01.jpg" alt="Грам-положительные бактерии" width={1440} height={810} className="w-full h-auto" />
              </div>

              <h2 className="text-3xl font-bold text-ink mt-16 mb-2">Как думать о грам-положительных бактериях</h2>
              <div className="w-10 h-1 bg-slate rounded-full mb-6" />
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                Когда вы делаете окраску по Граму, грам-положительные бактерии становятся фиолетовыми. Это потому
                что у них толстая клеточная стенка, которая удерживает краситель.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                Первый вопрос — какая форма? У вас всего три варианта: палочки, круглые клетки, или ветвящиеся нити,
                похожие на маленькие веточки дерева. Уже только по форме вы отсеиваете две трети списка. Вот
                насколько мощным может быть один взгляд под микроскоп.
              </p>

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-02.jpg" alt="Алгоритм определения грам-положительных бактерий" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Верхняя дорожка — грам-положительные палочки.</strong> Видите палочки. Следующий вопрос — нужен ли этой бактерии кислород? Если да — аэробная — думаем про Listeria, Bacillus или Corynebacterium. Если нет — анаэробная — это Clostridium.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Нижняя дорожка — ветвящиеся нити.</strong> Та же логика. Аэробная — это Nocardia (слабо кислотоустойчива). Анаэробная — это Actinomyces (совсем не кислотоустойчива).
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Средняя дорожка — кокки, круглые клетки.</strong> Это самая загруженная дорожка. Первое, что спрашиваем — каталазный тест. Каталаза-отрицательная — это Streptococcus (цепочки). Каталаза-положительная — это Staphylococcus (скопления как гроздья винограда).
              </p>

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-03.jpg" alt="Разбор кокков: каталаза и гемолиз" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p className="text-lg text-graphite leading-[1.8] mb-3">
                <strong className="text-ink font-semibold">Streptococcus делится по гемолизу</strong> — как бактерия разрушает эритроциты на агаре с кровью:
              </p>
              <ul className="space-y-2 mb-6 pl-1">
                <li className="text-lg text-graphite leading-[1.7] flex gap-3"><span className="text-slate mt-1">•</span><span><strong className="text-ink font-semibold">Альфа</strong> — частичное разрушение, зеленоватая зона. Кандидаты: Strep pneumoniae или Viridans. Пневмококк убивается оптохином и растворяется в желчи, виридансы — нет.</span></li>
                <li className="text-lg text-graphite leading-[1.7] flex gap-3"><span className="text-slate mt-1">•</span><span><strong className="text-ink font-semibold">Бета</strong> — полное разрушение, прозрачная зона. Группа A (S. pyogenes: ангина, ревматическая лихорадка) или группа B (S. agalactiae: неонатальный менингит).</span></li>
                <li className="text-lg text-graphite leading-[1.7] flex gap-3"><span className="text-slate mt-1">•</span><span><strong className="text-ink font-semibold">Гамма</strong> — никакого разрушения. Основной возбудитель — Enterococcus (растёт в солёных условиях).</span></li>
              </ul>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Staphylococcus делится по коагулазе.</strong> Коагулаза-положительный — только Staph aureus, самый агрессивный. Коагулаза-отрицательный — S. epidermidis (кожа, протезы) или S. saprophyticus (ИМВП у молодых женщин).
              </p>

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-04.jpg" alt="Итоговая карта алгоритма" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p className="text-lg text-graphite leading-[1.8] mb-5">
                Вот и весь алгоритм. Если вы можете уверенно пройти эту карту — вы определите любую грам-положительную бактерию на USMLE меньше чем за тридцать секунд. Не запоминайте просто названия — запоминайте путь, который привёл вас к ответу.
              </p>

              <h2 className="text-3xl font-bold text-ink mt-16 mb-2">Staphylococcus</h2>
              <div className="w-10 h-1 bg-slate rounded-full mb-6" />

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-05.jpg" alt="Staphylococcus — ключевые виды" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p className="text-lg text-graphite leading-[1.8] mb-5">
                Скопления. Каталаза-положительный. Ключевой тест — коагулаза.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Staph aureus</strong> — коагулаза-положительный. Это рабочая лошадка USMLE. Вызывает огромный список болезней: кожные инфекции (импетиго, флегмона, абсцессы), пневмонию (особенно после гриппа, часто с кавитарными очагами), эндокардит (классика у потребителей внутривенных наркотиков, поражает трёхстворчатый клапан), остеомиелит (самая частая причина в целом), пищевое отравление (рвота через 1–6 часов после еды, без лихорадки — это преформированный токсин), синдром токсического шока (высокая лихорадка, сыпь, гипотензия — тампоны, хирургические раны) и синдром обожжённой кожи у новорождённых.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                Уклоняется от иммунитета через белок A, который блокирует антитела. Лечение: MSSA — нафциллин, MRSA — ванкомицин.
              </p>

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-06.jpg" alt="Клинические проявления Staphylococcus" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Staph epidermidis</strong> — коагулаза-отрицательный, живёт на коже, поражает протезы (образует биоплёнку). Лечение — ванкомицин.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Staph saprophyticus</strong> — тоже коагулаза-отрицательный. Вызывает ИМВП у молодых сексуально активных женщин, вторая по частоте причина после E. coli. Лечение — TMP-SMX.
              </p>

              <h2 className="text-3xl font-bold text-ink mt-16 mb-2">Streptococcus и Enterococcus</h2>
              <div className="w-10 h-1 bg-slate rounded-full mb-6" />

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-07.jpg" alt="Streptococcus и Enterococcus" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p className="text-lg text-graphite leading-[1.8] mb-5">Цепочки. Каталаза-отрицательные.</p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Strep pyogenes (группа A)</strong> — вызывает ангину и кожные инфекции. Опасность в том, что приходит после: ревматическая лихорадка (только после ангины, никогда после кожной инфекции — поражает сердце через молекулярную мимикрию) и постстрептококковый гломерулонефрит (кровь в моче, отёки вокруг глаз, повышенное давление). Лечение — пенициллин; группа A никогда не развивала резистентности.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Strep agalactiae (группа B)</strong> — про беременность и новорождённых. Самая частая причина менингита и сепсиса у новорождённых, поэтому беременных обследуют на 35–37 неделе.
              </p>

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-08.jpg" alt="Гемолиз и клинические синдромы" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Strep pneumoniae</strong> — альфа-гемолитический, полисахаридная капсула блокирует фагоцитоз. Причина номер один внебольничной пневмонии, бактериального менингита у взрослых и среднего отита у детей. Классика — внезапная лихорадка, мокрота цвета ржавчины, долевая пневмония. Группа риска — все без работающей селезёнки. Лечение — пенициллин или цефтриаксон.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Viridans strep</strong> — тоже альфа-гемолитический, живёт во рту, после стоматологических процедур может вызвать подострый эндокардит на повреждённых клапанах.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Enterococcus</strong> — гамма-гемолитический, живёт в кишечнике. Вызывает ИМВП, эндокардит и инфекции желчных путей. VRE (ванкомицин-резистентный) лечим линезолидом.
              </p>

              <h2 className="text-3xl font-bold text-ink mt-16 mb-2">Спорообразующие палочки</h2>
              <div className="w-10 h-1 bg-slate rounded-full mb-6" />

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-09.jpg" alt="Спорообразующие бактерии" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p className="text-lg text-graphite leading-[1.8] mb-5">
                Bacillus и Clostridium образуют споры — так они выживают в жаре, времени, химикатах.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Bacillus anthracis</strong> — сибирская язва. Три формы: кожная (безболезненный чёрный струп, лечение — ципрофлоксацин), лёгочная (самая смертельная, расширенное средостение на рентгене), кишечная (от заражённого мяса).
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Bacillus cereus</strong> — пищевое отравление. Разогретый рис → рвота через 1–6 часов; мясо/овощи → диарея через 8–16 часов. Самокупирующееся, антибиотики не нужны.
              </p>

              <div className="my-10 rounded-xl overflow-hidden border border-white">
                <Image src="/lectures/gram-positive-bacteria/slide-10.jpg" alt="Clostridium — четыре вида" width={1440} height={810} className="w-full h-auto" />
              </div>

              <p className="text-lg text-graphite leading-[1.8] mb-3">
                <strong className="text-ink font-semibold">Clostridium</strong> — анаэробы, четыре вида:
              </p>
              <ul className="space-y-2 mb-6 pl-1">
                <li className="text-lg text-graphite leading-[1.7] flex gap-3"><span className="text-slate mt-1">•</span><span><strong className="text-ink font-semibold">C. perfringens</strong> — газовая гангрена (травма плюс грязь, пузырьки газа в мышцах). Лечение — хирургия плюс пенициллин.</span></li>
                <li className="text-lg text-graphite leading-[1.7] flex gap-3"><span className="text-slate mt-1">•</span><span><strong className="text-ink font-semibold">C. tetani</strong> — столбняк. Токсин блокирует тормозные сигналы → спастический паралич, начинается с челюсти (тризм). Лечение — иммуноглобулин плюс пенициллин плюс бензодиазепины.</span></li>
                <li className="text-lg text-graphite leading-[1.7] flex gap-3"><span className="text-slate mt-1">•</span><span><strong className="text-ink font-semibold">C. botulinum</strong> — ботулизм, противоположность столбняка. Токсин блокирует ацетилхолин → вялый паралич, начинается с лица. Формы: пищевая (консервы), детская (мёд, "вялый ребёнок" — классика USMLE), раневая. Лечение — антитоксин (для младенцев — BabyBIG).</span></li>
                <li className="text-lg text-graphite leading-[1.7] flex gap-3"><span className="text-slate mt-1">•</span><span><strong className="text-ink font-semibold">C. difficile</strong> — псевдомембранозный колит после антибиотиков (особенно клиндамицина). Лечение — пероральный ванкомицин или фидаксомицин.</span></li>
              </ul>

              <h2 className="text-3xl font-bold text-ink mt-16 mb-2">Неспорообразующие палочки</h2>
              <div className="w-10 h-1 bg-slate rounded-full mb-6" />
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Listeria monocytogenes</strong> — растёт даже в холодильнике при 4°C (колбасные нарезки, мягкие сыры, копчёная рыба). Болеют беременные, новорождённые, пожилые, иммунокомпрометированные. Критический факт — устойчива ко всем цефалоспоринам, поэтому при неэффективности цефтриаксона с ванкомицином добавляем ампициллин.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Corynebacterium diphtheriae</strong> — дифтерия. Токсин блокирует синтез белка, в горле формируется толстая серая плёнка. Лечение — сначала антитоксин, потом пенициллин.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Actinomyces israelii</strong> — анаэробная нитевидная палочка, не кислотоустойчива, живёт во рту в норме. Плотное образование на челюсти с "серными гранулами". Лечение — пенициллин 6–12 месяцев.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-6">
                <strong className="text-ink font-semibold">Nocardia</strong> — аэробная нитевидная палочка, слабо кислотоустойчива, живёт в почве. Поражает иммунокомпрометированных, начинается в лёгких (как туберкулёз), распространяется в мозг. Лечение — TMP-SMX, не пенициллин.
              </p>

              <div className="my-8 rounded-xl border border-steel/30 bg-steel/[0.06] pl-6 pr-6 py-5 border-l-4 border-l-[#5f8190]">
                <p className="text-xs font-bold uppercase tracking-wider text-steel mb-2">⚡ Ловушка USMLE</p>
                <p className="text-lg text-graphite leading-[1.7]">Actinomyces → пенициллин. Nocardia → TMP-SMX.</p>
              </div>

              <h2 className="text-3xl font-bold text-ink mt-16 mb-2">Классические сравнения USMLE</h2>
              <div className="w-10 h-1 bg-slate rounded-full mb-6" />
              <p className="text-lg text-graphite leading-[1.8] mb-4">Пары, которые любит экзамен:</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl border border-white bg-white/60 p-5">
                  <p className="text-ink font-semibold mb-1">Staph vs Strep</p>
                  <p className="text-graphite leading-[1.6]">Скопления против цепочек, каталаза-положительный против каталаза-отрицательного.</p>
                </div>
                <div className="rounded-xl border border-white bg-white/60 p-5">
                  <p className="text-ink font-semibold mb-1">Pneumoniae vs Viridans</p>
                  <p className="text-graphite leading-[1.6]">Оба альфа-гемолитические; пневмококк убивается оптохином и растворяется в желчи, виридансы — нет.</p>
                </div>
                <div className="rounded-xl border border-white bg-white/60 p-5">
                  <p className="text-ink font-semibold mb-1">Actinomyces vs Nocardia</p>
                  <p className="text-graphite leading-[1.6]">Обе нитевидные; Actinomyces анаэробная / не кислотоустойчива / флора рта / пенициллин, Nocardia аэробная / слабо кислотоустойчива / почва / TMP-SMX.</p>
                </div>
                <div className="rounded-xl border border-white bg-white/60 p-5">
                  <p className="text-ink font-semibold mb-1">Tetani vs Botulinum</p>
                  <p className="text-graphite leading-[1.6]">Один род, противоположные эффекты; тетани — спастический паралич снизу вверх, ботулинум — вялый паралич сверху вниз.</p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-ink mt-16 mb-2">Разбор клинических задач</h2>
              <div className="w-10 h-1 bg-slate rounded-full mb-6" />

              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Задача 1 — Streptococcus pneumoniae и селезёнка.</strong> Мужчина 67 лет, внезапная лихорадка, мокрота цвета ржавчины, долевая консолидация, грам-положительные диплококки парами, альфа-гемолитический, растворяется в желчи. Классика пневмококковой пневмонии. Почему селезёнка критична? Потому что она — основное место опсонизации и фагоцитоза инкапсулированных бактерий. Мнемоника SHiN: Strep pneumoniae, Haemophilus influenzae, Neisseria meningitidis — три бактерии, критичные при аспленизме.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Задача 2 — механизм токсина C. tetani.</strong> Строитель, ржавый гвоздь, тризм, ригидность, гиперрефлексия. Тетаноспазмин — цинк-зависимая протеаза, движется ретроградно к спинному мозгу, расщепляет SNARE-белки в тормозных интернейронах, блокируя глицин и ГАМК. Результат — неконтролируемое сокращение мышц, спастический паралич. (Не путать с ботулотоксином — тот блокирует ацетилхолин в нервно-мышечном соединении, вызывая вялый паралич).
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-5">
                <strong className="text-ink font-semibold">Задача 3 — детский ботулизм vs пищевой.</strong> Младенец 4 месяцев, мёд на соске, "вялый ребёнок", запор. При детском ботулизме бактерия колонизирует кишечник и производит токсин внутри организма; при пищевом — токсин уже сформирован и просто заглатывается. У взрослых нормальная флора подавляет C. botulinum, у младенцев флора незрелая.
              </p>
              <p className="text-lg text-graphite leading-[1.8] mb-8">
                <strong className="text-ink font-semibold">Задача 4 — Nocardia vs Actinomyces, главная ловушка.</strong> Пациент с ВИЧ, CD4 = 62, кавитарный очаг в лёгких плюс кольцевидные очаги в мозге, грам-положительные ветвящиеся палочки, каталаза-положительные, слабо кислотоустойчивы. Это Nocardia (аэробная, из почвы, диссеминация в лёгкие и мозг у иммунокомпрометированных) — лечение TMP-SMX, не пенициллин.
              </p>

              <div className="mt-16 rounded-[24px] border border-steel/30 bg-gradient-to-br from-steel/[0.08] to-transparent p-8">
                <p className="text-xs font-bold uppercase tracking-wider text-slate mb-3">Итог</p>
                <p className="text-lg text-graphite leading-[1.7] mb-5">Три вещи, с которыми нужно уйти:</p>
                <ol className="space-y-4 mb-5">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate/20 text-slate font-bold text-sm flex items-center justify-center">1</span>
                    <span className="text-graphite leading-[1.7]"><strong className="text-ink">Алгоритм.</strong> Форма говорит о группе: скопления — стафилококк, цепочки — стрептококк, палочки делятся на спорообразующие (Bacillus, Clostridium) и неспорообразующие, ветвящиеся нити — Nocardia или Actinomyces (аэроб/анаэроб, кислотоустойчива или нет).</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate/20 text-slate font-bold text-sm flex items-center justify-center">2</span>
                    <span className="text-graphite leading-[1.7]"><strong className="text-ink">Классические пары</strong> — то, что USMLE тестирует больше всего.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate/20 text-slate font-bold text-sm flex items-center justify-center">3</span>
                    <span className="text-graphite leading-[1.7]"><strong className="text-ink">Лечебные ловушки</strong> — Actinomyces (пенициллин) против Nocardia (TMP-SMX), Listeria (добавляем ампициллин), MRSA (ванкомицин), VRE (линезолид), C. difficile (пероральный ванкомицин).</span>
                  </li>
                </ol>
                <p className="text-graphite leading-[1.7]">
                  Грам-положительные бактерии — одна из самых высокодоходных тем USMLE Step 1 и Step 2. Если вы понимаете логику, а не просто запоминаете названия — вы ответите почти на любой вопрос по этой теме.
                </p>
              </div>

            </article>
          )}

          <div className="mt-16 pt-8 border-t border-white">
            <a href={isRu ? "https://t.me/usmle_vinograd" : "https://discord.gg/Wz68kvvpk"} target="_blank" rel="noopener noreferrer" className="block bg-slate hover:bg-ink text-white px-8 py-3 rounded-full font-medium transition-colors text-center mb-6 sm:inline-block sm:w-auto">
              {isRu ? 'Подписаться в Telegram' : 'Join our Discord community'}
            </a>

            <p className="text-muted text-sm mb-4">
              {isRu ? 'Мы в соцсетях:' : 'Find us on social media:'}
            </p>
            <div className="flex flex-wrap gap-3">
              {(isRu ? [
                { href: 'https://t.me/usmle_vinograd', label: 'Telegram · Канал' },
                { href: 'https://t.me/usmle_img_community', label: 'Telegram · Сообщество' },
                { href: 'https://dzen.ru/asiiavinograd', label: 'Яндекс.Дзен' },
                { href: 'https://vk.ru/usmle_vinograd', label: 'VK' },
                { href: 'https://www.tiktok.com/@dr.asiia.vinograd', label: 'TikTok' },
                { href: 'https://instagram.com/asia.vinograd', label: 'Instagram' },
                { href: 'https://youtube.com/@asiiavinogradusmle', label: 'YouTube' },
                { href: 'https://rutube.ru/channel/78455665/', label: 'RUTUBE' },
              ] : [
                { href: 'https://www.youtube.com/@USMLEforIMG', label: 'YouTube' },
                { href: 'https://discord.gg/Wz68kvvpk', label: 'Discord' },
                { href: 'https://www.facebook.com/profile.php?id=61589813762652', label: 'Facebook · Page' },
                { href: 'https://www.facebook.com/groups/usmleforimgs.vinograd', label: 'Facebook · Group' },
                { href: 'https://instagram.com/dr.asiavinograd', label: 'Instagram' },
                { href: 'https://www.threads.net/@dr.asiavinograd', label: 'Threads' },
                { href: 'https://www.tiktok.com/@drasiiavinograd', label: 'TikTok' },
                { href: 'https://linkedin.com/in/asiia-vinograd', label: 'LinkedIn' },
                { href: 'https://www.patreon.com/cw/drasiiavinograd', label: 'Patreon' },
                { href: 'https://medium.com/@usmleforimgs.drvinograd', label: 'Medium' },
              ]).map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-ink/15 hover:border-ink/40 hover:bg-white/60 text-graphite hover:text-ink px-5 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
