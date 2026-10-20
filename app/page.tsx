'use client';
import { useState, useEffect } from 'react';
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navLinks = ['About', 'Curriculum', 'Lectures', 'Connect'];
  return (
    <main className="bg-[#0a0f1e] text-white min-h-screen font-sans">
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0f1e]/95 backdrop-blur border-b border-white/10' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">Dr. Vinograd</span>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-sm text-white/70 hover:text-white transition-colors">{link}</a>
            ))}
            <a href="mailto:usmleforimgs.drvinograd@gmail.com" className="bg-[#f47c5a] hover:bg-[#e06b49] text-white text-sm px-4 py-2 rounded-full transition-colors">Get in Touch</a>
          </div>
          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-[#0a0f1e] border-t border-white/10 px-6 py-4 flex flex-col gap-4">
            {navLinks.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-white/70 hover:text-white" onClick={() => setMenuOpen(false)}>{link}</a>
            ))}
          </div>
        )}
      </nav>
      <section id="home" className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/80 mb-8">
          <span className="w-2 h-2 bg-[#4ecdc4] rounded-full animate-pulse"></span>
          Accepting New Students
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">Dr. Asiia Vinograd</h1>
        <p className="text-3xl md:text-4xl font-light mb-6">
          <span className="text-[#f47c5a]">MD</span>, <span className="text-[#4ecdc4]">PhD</span>
        </p>
        <p className="text-white/60 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Practicing cardiologist and USMLE educator helping international medical graduates achieve their dreams of practicing medicine in the United States.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="https://youtube.com/@USMLEforIMG" target="_blank" rel="noopener noreferrer" className="bg-[#f47c5a] hover:bg-[#e06b49] text-white px-8 py-3 rounded-full font-medium transition-colors">Watch Lectures</a>
          <a href="#about" className="border border-white/30 hover:border-white/60 text-white px-8 py-3 rounded-full font-medium transition-colors">Learn More</a>
        </div>
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl w-full">
          {[
            { value: '4', label: 'Publications' },
            { value: '90+', label: 'Citations (Scopus)' },
            { value: 'h-4', label: 'H-index' },
            { value: '2.5yr', label: 'NICU Experience' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-[#4ecdc4]">{stat.value}</div>
              <div className="text-white/50 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
      <section id="about" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#f47c5a] text-sm uppercase tracking-widest mb-3">About</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-16">Credentials & Experience</h2>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center">
              <img src="/asiia.jpg" alt="Dr. Asiia Vinograd" className="w-80 rounded-3xl object-cover object-top shadow-2xl" />
            </div>
            <div>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                I am a physician, cardiologist, and researcher currently based in Phuket, Thailand — preparing for USMLE Step 1 alongside my students.
              </p>
              <p className="text-white/70 text-lg leading-relaxed mb-10">
                My path includes medical school at Bashkir State Medical University, cardiology residency, and a PhD from Harbin Medical University in China. I also have 2.5 years of NICU nursing experience, which shaped my passion for neonatology and pediatrics.
              </p>
              <div className="space-y-4">
                {[
                  { label: 'MD', sub: 'Bashkir State Medical University, 2017' },
                  { label: 'Cardiology Residency', sub: 'BSMU, 2017–2019' },
                  { label: 'PhD Internal Medicine', sub: 'Harbin Medical University, China, 2022' },
                  { label: 'NICU Nurse', sub: "Republican Children's Hospital, Ufa, 2015–2017" },
                  { label: 'International Patient Coordination Manager', sub: 'APEX Hospital Phuket, 2026–present' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[#4ecdc4] rounded-full mt-2.5 shrink-0"></div>
                    <div>
                      <span className="font-medium">{item.label}</span>
                      <span className="text-white/50 text-sm ml-2">{item.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="curriculum" className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#f47c5a] text-sm uppercase tracking-widest mb-3">Curriculum</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">USMLE Step 1 Topics</h2>
          <p className="text-white/50 text-lg mb-16 max-w-2xl">All high-yield topics for Step 1 success — with clinical vignettes and diagnostic algorithms</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Microbiology', topics: 'Gram+ & Gram− bacteria, Viruses, Fungi, Parasites, Antibiotics' },
              { title: 'Pharmacology', topics: 'Antibiotics, Cardiovascular drugs, Autonomic, CNS drugs' },
              { title: 'Cardiology', topics: 'Physiology, ECG, Heart failure, Arrhythmias' },
              { title: 'Pathology', topics: 'Inflammation, Neoplasia, Cell injury, Hemodynamics' },
              { title: 'Biochemistry', topics: 'Metabolism, Genetics, Molecular biology, Vitamins' },
              { title: 'Immunology', topics: 'Innate & adaptive, Hypersensitivity, Immunodeficiencies' },
              { title: 'Renal & Respiratory', topics: 'Physiology, Acid-base, Diuretics, Lung pathology' },
              { title: 'Neurology & Psychiatry', topics: 'CNS anatomy, Dementia, Movement disorders, Psychopharmacology' },
            ].map((item, i) => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#4ecdc4]/40 transition-all">
                <div className="text-[#4ecdc4] text-xs font-mono mb-3">{String(i + 1).padStart(2, '0')}</div>
                <div className="font-semibold mb-2">{item.title}</div>
                <div className="text-white/40 text-sm leading-relaxed">{item.topics}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="lectures" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#f47c5a] text-sm uppercase tracking-widest mb-3">Lectures</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Videos</h2>
          <p className="text-white/50 text-lg mb-16 max-w-2xl">Step 1 content built around the most testable concepts</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { tag: 'Microbiology · Step 1', title: 'Gram-Positive Bacteria — Complete Guide', desc: 'Full lab algorithm, Staph vs Strep, spore-forming bacilli, and 4 clinical vignettes.', url: 'https://youtu.be/z2io9SgLmgU', soon: false },
              { tag: 'Microbiology · Step 1', title: 'Gram-Negative Bacteria — Complete Guide', desc: 'Enterobacteriaceae, oxidase-positive rods, obligate intracellular organisms.', url: 'https://youtu.be/MJodsTtRXKs', soon: false },
              { tag: 'Microbiology · Step 1', title: 'Staphylococcus Aureus — Deep Dive', desc: 'Toxins, virulence factors, MRSA, and classic Step 1 clinical scenarios.', url: 'https://www.youtube.com/watch?v=u1agd7-hlxw', soon: false },
              { tag: 'Coming Soon · Step 1', title: 'Pharmacology — Antibiotics', desc: 'Mechanism of action, resistance patterns, and clinical indications.', url: 'https://patreon.com/drasiiavinograd', soon: true },
              { tag: 'Coming Soon · Step 1', title: 'Pathology — Inflammation & Repair', desc: 'Acute vs chronic inflammation, wound healing, granuloma formation.', url: 'https://patreon.com/drasiiavinograd', soon: true },
              { tag: 'Coming Soon · Step 1', title: 'Cardiology — ECG & Arrhythmias', desc: 'Systematic ECG reading, arrhythmia mechanisms, and high-yield pharmacology.', url: 'https://patreon.com/drasiiavinograd', soon: true },
            ].map(lecture => (
              <a key={lecture.title} href={lecture.url} target="_blank" rel="noopener noreferrer" className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#f47c5a]/40 transition-all block">
                <div className="text-[#4ecdc4] text-xs mb-3">{lecture.tag}</div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-[#f47c5a] transition-colors">{lecture.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">{lecture.desc}</p>
                <span className="text-[#f47c5a] text-sm">{lecture.soon ? 'Join early access →' : 'Watch on YouTube →'}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section id="connect" className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#f47c5a] text-sm uppercase tracking-widest mb-3">Connect</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Study Together</h2>
          <p className="text-white/50 text-lg mb-16 max-w-2xl mx-auto">Join IMGs from around the world preparing for USMLE across all platforms</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'YouTube', sub: 'Free lectures', url: 'https://youtube.com/@USMLEforIMG' },
              { name: 'Telegram', sub: 'Free community', url: 'https://t.me/usmle_img_community' },
              { name: 'Patreon', sub: 'USMLE Club', url: 'https://patreon.com/drasiiavinograd' },
              { name: 'Discord', sub: 'Study community', url: 'https://discord.gg/86urfUgPmF' },
              { name: 'LinkedIn', sub: 'Professional', url: 'https://linkedin.com/in/asiia-vinograd' },
              { name: 'Email', sub: 'Get in touch', url: 'mailto:usmleforimgs.drvinograd@gmail.com' },
            ].map(platform => (
              <a key={platform.name} href={platform.url} target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="font-semibold mb-1">{platform.name}</div>
                <div className="text-white/40 text-xs">{platform.sub}</div>
              </a>
            ))}
          </div>
        </div>
      </section>
      <footer className="py-10 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white/50 text-sm">© 2026 Dr. Asiia Vinograd · drasiiavinograd.com</div>
          <div className="flex gap-6">
            {[
              { name: 'YouTube', url: 'https://youtube.com/@USMLEforIMG' },
              { name: 'Patreon', url: 'https://patreon.com/drasiiavinograd' },
              { name: 'Discord', url: 'https://discord.gg/86urfUgPmF' },
              { name: 'LinkedIn', url: 'https://linkedin.com/in/asiia-vinograd' },
            ].map(link => (
              <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white text-sm transition-colors">{link.name}</a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
