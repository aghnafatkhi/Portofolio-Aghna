'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import { 
  Menu, X, Palette, Camera, Video,
  Instagram, Star, Clapperboard, Play,
  ArrowRight, ArrowUpRight, Music
} from 'lucide-react';

type Project = {
  id: number;
  title: string;
  tag: string;
  img: string;
  desc: string;
  year: string;
  tools: string[];
};

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
}

function OptimizedImage({ src, alt, className = '', fill = false, priority = false }: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-100">
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-100 animate-pulse z-10 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-black/10 border-t-accent rounded-full animate-spin" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`transition-all duration-700 ease-out object-contain ${
          isLoading ? 'scale-[1.02] blur-sm opacity-0' : 'scale-100 blur-0 opacity-100'
        } ${className}`}
        onLoad={() => setIsLoading(false)}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export default function Portfolio() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showShowreel, setShowShowreel] = useState(false);
  const [isVideoMounted, setIsVideoMounted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [isIntroBright, setIsIntroBright] = useState(false);
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 800], [0, -150]);

  useEffect(() => {
    // Lock body scroll during intro
    if (showIntro) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showIntro]);

  useEffect(() => {
    if (!showIntro) return;

    // Word 1: "seni"
    const t1 = setTimeout(() => {
      setActiveWordIndex(0);
    }, 600);

    // Word 2: "adalah"
    const t2 = setTimeout(() => {
      setActiveWordIndex(1);
    }, 1400);

    // Word 3: "saya"
    const t3 = setTimeout(() => {
      setActiveWordIndex(2);
    }, 2200);

    // Transition to bright background
    const t4 = setTimeout(() => {
      setIsIntroBright(true);
    }, 3400);

    // Close intro and enter website
    const t5 = setTimeout(() => {
      setShowIntro(false);
    }, 4700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [showIntro]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Delay mounting local video slightly to let other critical layout, images, and content render fully first.
    const timer = setTimeout(() => {
      setIsVideoMounted(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);



  const navLinks = [
    { name: 'INDEX', href: '#beranda' },
    { name: 'ABOUT', href: '#tentang' },
    { name: 'CRAFT', href: '#keahlian' },
    { name: 'WORKS', href: '#portofolio' },
    { name: 'CONTACT', href: '#kontak' },
  ];

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true as const },
    transition: { duration: 0.6 }
  };

  return (
    <div className={`bg-neutral-50 selection:bg-accent selection:text-white transition-colors duration-[1500ms] ${showIntro ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      {/* Noise Texture */}
      <div className="noise" />

      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-[1000ms] border-b ${
          isScrolled ? 'bg-white/95 backdrop-blur-xl py-4 lg:py-5 border-black/5 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)]' : 'bg-transparent py-6 lg:py-8 border-transparent'
        }`}
        style={{
          opacity: isIntroBright ? 1 : 0,
          pointerEvents: isIntroBright ? 'auto' : 'none',
          transform: isIntroBright ? 'translateY(0)' : 'translateY(-10px)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 flex justify-between items-center">
          <div className="flex flex-col justify-center relative z-20">
            <a 
              href="#beranda" 
              onClick={handleAnchorClick} 
              className={`font-heading text-2xl md:text-3xl font-black tracking-tighter leading-none transition-colors duration-300 ${
                mobileMenuOpen ? 'text-white' : 'text-dark'
              }`}
            >
              AGHNA FATKHI<span className="text-accent underline decoration-2 md:decoration-4 underline-offset-4">.</span>
            </a>
            <span className={`text-[9px] md:text-[10px] font-bold tracking-[0.2em] mt-1 md:mt-2 uppercase transition-colors duration-300 ${
              mobileMenuOpen ? 'text-white/60' : 'text-neutral-400'
            }`}>
              Student & Creator Portfolio
            </span>
          </div>
          
          <div className="hidden lg:flex gap-12 items-center">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={handleAnchorClick}
                className="text-[11px] font-black tracking-widest text-neutral-500 hover:text-accent transition-all duration-300 relative group"
              >
                <span className="relative z-10">{link.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <button 
            className={`lg:hidden p-3 rounded-full transition-all duration-300 border ${
              mobileMenuOpen 
                ? 'bg-white text-dark border-white shadow-lg' 
                : 'bg-dark text-white border-transparent'
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <motion.div 
        initial={false}
        animate={{ y: mobileMenuOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-50 bg-dark pt-32 px-10 lg:hidden"
      >
        <div className="flex flex-col gap-8 text-left">
          {navLinks.map((link, idx) => (
            <motion.a 
              key={link.name} 
              href={link.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? 0 : -20 }}
              transition={{ delay: idx * 0.1 }}
              className="text-5xl font-heading font-black text-white hover:text-accent"
              onClick={handleAnchorClick}
            >
              {link.name}
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Hero Section */}
      <section 
        id="beranda" 
        className={`relative min-h-[100vh] w-full flex flex-col justify-center overflow-hidden border-b border-black/5 transition-colors duration-[1500ms] ease-in-out ${
          isIntroBright ? 'bg-neutral-50' : 'bg-[#020202]'
        }`}
      >
        
        {/* Sleek Swiss-style editorial structure background graphic */}
        <div 
          className="absolute top-0 right-0 w-full lg:w-[60%] h-full z-0 opacity-[0.03] lg:opacity-[0.05] pointer-events-none select-none overflow-hidden flex items-center justify-center transition-all duration-[1000ms]"
          style={{ opacity: isIntroBright ? undefined : 0 }}
        >
          {/* Subtle Grid Lines & Vertical Typography */}
          <div className="absolute inset-0 grid grid-cols-4 h-full w-full border-l border-black/5">
            <div className="border-r border-black/5 h-full" />
            <div className="border-r border-black/5 h-full" />
            <div className="border-r border-black/5 h-full" />
            <div className="h-full" />
          </div>
          <div className="font-heading text-[12rem] sm:text-[18rem] md:text-[22rem] font-black tracking-tighter text-dark select-none absolute right-[-8%] rotate-90 origin-right whitespace-nowrap opacity-[0.35]">
            CREATIVE
          </div>
        </div>

        {/* Local Background Video - Sleek, Lag-free, Self-hosted */}
        <div 
          className="absolute top-0 right-0 w-full lg:w-[65%] h-full z-0 opacity-15 md:opacity-20 transition-all duration-[1000ms] overflow-hidden bg-neutral-100 select-none pointer-events-none"
          style={{ 
            maskImage: 'linear-gradient(to right, transparent, black 45%)', 
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 45%)',
            opacity: isIntroBright ? undefined : 0
          }}
        >
          {isVideoMounted ? (
            <video
              src="/showreel.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover grayscale brightness-95 opacity-80"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-200/50 animate-pulse" />
          )}
        </div>

        <div className="w-full max-w-7xl mx-auto px-6 md:px-8 lg:px-12 relative z-10">
          <motion.div style={{ y: yHero }} className="relative z-[160]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-4"
            >
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: isIntroBright ? 1 : 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-4"
              >
                <div className="h-[2px] w-8 md:w-12 bg-accent" />
                <span className="text-[10px] md:text-[11px] font-bold tracking-[0.25em] text-accent uppercase">Student & Creator Portfolio</span>
              </motion.div>
              
              <h1 className="font-heading text-6xl sm:text-8xl lg:text-[7.5rem] font-black leading-[0.9] tracking-tight uppercase mt-4">
                {/* Word 1: Seni */}
                <div className="overflow-hidden py-4 -my-4">
                  <motion.span
                    initial={{ y: "115%", opacity: 0 }}
                    animate={{ 
                      y: activeWordIndex >= 0 ? 0 : "115%", 
                      opacity: activeWordIndex >= 0 ? 1 : 0,
                    }}
                    transition={{
                      y: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.7 }
                    }}
                    className={`block select-none cursor-default transition-colors duration-1000 ${
                      isIntroBright ? "text-dark" : "text-white"
                    }`}
                  >
                    Seni
                  </motion.span>
                </div>

                {/* Word 2: Adalah */}
                <div className="overflow-hidden py-4 -my-4">
                  <motion.span
                    initial={{ y: "115%", opacity: 0 }}
                    animate={{ 
                      y: activeWordIndex >= 1 ? 0 : "115%", 
                      opacity: activeWordIndex >= 1 ? 1 : 0,
                    }}
                    transition={{
                      y: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.7 }
                    }}
                    className={`block select-none cursor-default transition-colors duration-1000 ${
                      isIntroBright 
                        ? "text-neutral-200 hover:text-accent transition-colors duration-700" 
                        : "text-white/20"
                    }`}
                  >
                    Adalah
                  </motion.span>
                </div>

                {/* Word 3: Saya. */}
                <div className="overflow-hidden py-4 -my-4">
                  <motion.span
                    initial={{ y: "115%", opacity: 0 }}
                    animate={{ 
                      y: activeWordIndex >= 2 ? 0 : "115%", 
                      opacity: activeWordIndex >= 2 ? 1 : 0,
                    }}
                    transition={{
                      y: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.7 }
                    }}
                    className={`block select-none cursor-default transition-colors duration-1000 ${
                      isIntroBright ? "text-dark" : "text-white"
                    }`}
                  >
                    Saya<motion.span 
                      animate={{ color: isIntroBright ? "#8A5F41" : "#ffffff" }}
                      className="transition-colors duration-1000"
                    >.</motion.span>
                  </motion.span>
                </div>
              </h1>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ 
                  opacity: isIntroBright ? 1 : 0,
                  y: isIntroBright ? 0 : 15 
                }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="flex flex-col lg:flex-row items-start lg:items-end justify-between mt-12 gap-8 lg:gap-12 w-full"
              >
                <p className="text-base md:text-lg lg:text-xl text-neutral-600 max-w-xl font-medium leading-relaxed">
                  Aghna Fatkhi — Pelajar SMA yang mendedikasikan waktu untuk directing, video editing, dan scripting. Menghubungkan ide melalui setiap potongan media.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto shrink-0 mt-6 lg:mt-0 relative z-20">
                  <a href="#portofolio" onClick={handleAnchorClick} className="group flex items-center justify-between gap-6 bg-dark text-white px-8 py-5 md:px-10 md:py-5 hover:bg-accent transition-all duration-300 w-full sm:w-auto min-w-[200px] overflow-hidden relative shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                    <span className="font-bold tracking-[0.2em] text-xs uppercase relative z-10">LATEST WORKS</span>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300 relative z-10" size={20} />
                    <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

      </section>

      {/* Identity / About */}
      <section id="tentang" className="bg-dark py-24 md:py-32 px-6 md:px-8 lg:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
          <div className="lg:col-span-5 relative group">
            <motion.div 
              {...fadeUp}
              className="aspect-[3/4] bg-neutral-900 border border-white/5 overflow-hidden filter grayscale hover:grayscale-0 transition-all duration-700 relative w-full"
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <Camera size={120} className="text-white" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-8 h-2/3 bg-gradient-to-t from-dark to-transparent flex items-end">
                <p className="text-white font-heading text-2xl font-black leading-tight">
                  Integrasi seni peran <br /> dan teknologi <br /> visual modern.
                </p>
              </div>
            </motion.div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-accent/20 blur-3xl rounded-full" />
          </div>

          <div className="lg:col-span-7 flex flex-col gap-12">
            <motion.div {...fadeUp}>
              <h2 className="text-[10px] md:text-[11px] font-bold tracking-[0.3em] text-accent uppercase mb-4 md:mb-6 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-accent/50 hidden md:block"></span>
                Profil Profesional
              </h2>
              <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white font-black leading-[1.1] tracking-tight uppercase mb-8 max-w-xl">
                Dedikasi pada <br /> <span className="text-accent italic">Ekspresi Visual</span> & Narasi.
              </h3>
              <div className="text-neutral-400 space-y-6 text-sm md:text-base font-medium leading-[1.7] text-left max-w-xl">
                <p>
                  Sebagai seorang pelajar SMA Negeri 1 Cileungsi (2024-2027), saya fokus pada pengembangan diri melalui media produksi visual dan kepemimpinan. Perjalanan saya bermula dari ketertarikan pada bagaimana sebuah desain dan video dapat menyampaikan pesan yang mendalam kepada audiens.
                </p>
                <p>
                  Lahir di Indramayu pada 10 November 2009, saya mengasah kemampuan manajerial dan kreatif melalui pengalaman berorganisasi, mulai dari menjadi Ketua Bidang PIP IPM SMP Muhammadiyah 1 Cileungsi, hingga menjabat sebagai Ketua Ekstrakurikuler Cinematography di SMA Negeri 1 Cileungsi.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-8 mt-10 pt-10 border-t border-white/10">
                  <div>
                    <h4 className="text-white font-bold mb-3 uppercase tracking-widest text-[10px]">Soft Skills</h4>
                    <p className="text-neutral-400 text-sm leading-relaxed">Leadership, Public Speaking, Kreativitas, Adaptibilitas, Emotional Intelligence, Decision Making.</p>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-3 uppercase tracking-widest text-[10px]">Bahasa & Minat</h4>
                    <p className="text-neutral-400 text-sm leading-relaxed">Indonesia, Inggris, Jerman. <br/><span className="inline-block mt-1">Hobi: Menonton film & Bermain basket.</span></p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeUp} className="grid grid-cols-2 sm:grid-cols-3 gap-10 border-t border-white/10 pt-10">
              {[
                { val: '04', label: 'Tahun Dedikasi' },
                { val: '10+', label: 'Proyek Kreatif' },
                { val: '03', label: 'Core Software' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-heading text-5xl md:text-6xl font-black text-white">{item.val}</span>
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-neutral-500 uppercase mt-3">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Craft / Skills */}
      <section id="keahlian" className="py-24 md:py-32 px-6 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div className="lg:w-1/3">
            <motion.div {...fadeUp} className="sticky top-32">
              <h2 className="text-[10px] md:text-[11px] font-bold tracking-[0.3em] text-accent uppercase mb-4 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-accent/50 hidden md:block"></span>
                Workflow
              </h2>
              <h3 className="font-heading text-5xl lg:text-6xl font-black text-dark leading-[0.95] tracking-tighter uppercase mb-6">
                Simpel <br />tapi <br />Niat<span className="text-accent">.</span>
              </h3>
              <p className="text-neutral-500 font-medium text-base md:text-lg leading-relaxed mb-8 max-w-sm">
                Saya terbiasa memproses ide mulai dari riset referensi di internet, drafting di Canva, sampai eksekusi akhir di software profesional.
              </p>
              <div className="flex flex-wrap gap-3">
                {['CANVA', 'CAPCUT', 'DAVINCI'].map(tool => (
                  <span key={tool} className="text-[9px] md:text-[10px] font-bold tracking-widest px-4 py-2 bg-neutral-100 text-dark uppercase">{tool}</span>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:w-2/3 grid gap-1 mt-16 lg:mt-0">
            {[
              { id: '01', title: 'Editing & Directing', icon: <Clapperboard />, desc: 'Mengarahkan visi kreatif dan memoles potongan visual dengan DaVinci Resolve.', tags: ['Resolve', 'CapCut', 'Storytelling'] },
              { id: '02', title: 'Scripting & Ideasi', icon: <Music />, desc: 'Meracik ide cerita, struktur naskah, dan alur naratif yang kuat.', tags: ['Script', 'Concept', 'Research'] },
              { id: '03', title: 'Desain Grafis', icon: <Palette />, desc: 'Menciptakan bahasa visual yang komunikatif dengan Canva.', tags: ['Canva', 'Branding', 'Typography'] },
              { id: '04', title: 'Publikasi & Dokumentasi', icon: <Camera />, desc: 'Menghindari gaya statis. Publikasi acara, mengabadikan momen dengan estetika.', tags: ['Event', 'Social Media', 'Photo'] },
            ].map((skill, idx) => (
              <motion.div 
                key={idx} 
                {...fadeUp}
                className="group flex flex-col md:flex-row items-start md:items-center justify-between p-8 md:p-10 border-b border-black/5 hover:bg-dark transition-all duration-500 cursor-default"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 mb-6 md:mb-0">
                  <span className="text-sm font-black text-neutral-300 group-hover:text-accent transition-colors">{skill.id}</span>
                  <div>
                    <h4 className="font-heading text-2xl md:text-3xl font-black text-dark group-hover:text-white transition-colors uppercase tracking-tight">{skill.title}</h4>
                    <p className="text-neutral-500 text-sm mt-2 max-w-sm leading-relaxed group-hover:text-neutral-400 transition-colors">{skill.desc}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 md:max-w-[200px] md:justify-end">
                  {skill.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-bold tracking-widest px-3 py-1 bg-neutral-100 text-neutral-600 group-hover:bg-neutral-800 group-hover:text-neutral-400 transition-colors uppercase">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Grid - Bento Style */}
      <section id="portofolio" className="py-24 md:py-32 bg-neutral-100/50">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div {...fadeUp} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 lg:mb-20 gap-8">
            <h3 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-dark leading-[0.9] tracking-tight uppercase whitespace-pre">
              SELECTED <br /> <span className="text-accent underline decoration-4 lg:decoration-6 underline-offset-4 lg:underline-offset-8">CRAFTS</span>.
            </h3>
            <p className="text-neutral-500 md:text-right max-w-sm font-medium text-base md:text-lg leading-relaxed">
              Kumpulan proyek eksperimen, komersial, maupun eksplorasi visual yang pernah saya kerjakan.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {[
              { id: 1, title: 'Banner IPM 17an', tag: 'Visual Design', img: 'https://i.postimg.cc/Jns9vpgz/Banner-17an.png', desc: 'Desain banner publikasi untuk perayaan HUT RI ke-78 yang diselenggarakan oleh Ikatan Pelajar Muhammadiyah.', year: '2023', tools: ['Canva'] },
              { id: 2, title: 'Logo: Universe Origin', tag: 'Branding', img: 'https://i.postimg.cc/05MsBNRk/Logo-UNO.png', desc: 'Eksplorasi pembuatan identitas visual untuk brand lokal, memadukan elemen futuristik dan minimalis.', year: '2024', tools: ['Canva'] },
              { id: 3, title: 'Banner Mapecap', tag: 'Visual Design', img: 'https://i.postimg.cc/nLRy3y3G/Banner-Mapecap.png', desc: 'Media promosi visual untuk kegiatan pengenalan lingkungan sekolah, dengan gaya dinamis dan muda.', year: '2023', tools: ['Canva'] },
              { id: 4, title: 'Logo: Kampung Terapung', tag: 'Branding', img: 'https://i.postimg.cc/hvF3wcTx/Logo-Kampung-Terapung.png', desc: 'Perancangan logo komunitas wisata lokal untuk menarik minat pengunjung dengan pendekatan budaya.', year: '2024', tools: ['Canva'] },
              { id: 5, title: 'Banner Upgrading', tag: 'Visual Design', img: 'https://i.postimg.cc/wMKbPgL3/Banner-Upgrading.png', desc: 'Desain visual untuk program pelatihan peningkatan kapasitas pengurus organisasi.', year: '2023', tools: ['Canva'] },
              { id: 6, title: 'DOSQ Series Season 1', tag: 'Branding', img: 'https://i.postimg.cc/HnGPKdXk/Logo-Doras.png', desc: 'Identitas visual resmi untuk series perlombaan sekolah, menonjolkan kesan kompetitif dan kreatif.', year: '2023', tools: ['Canva'] },
              { id: 7, title: 'Banner Classmeeting', tag: 'Visual Design', img: 'https://i.postimg.cc/fbR4jzfz/Banner-Classmeet.png', desc: 'Publikasi kegiatan Classmeeting pasca ujian, menggunakan warna cerah untuk membangun antusiasme.', year: '2022', tools: ['Canva'] },
              { id: 8, title: 'DOSQ Series Season 2', tag: 'Branding', img: 'https://i.postimg.cc/SR0t5kCK/Logo-DORAS-2.png', desc: 'Evolusi identitas visual untuk musim kedua perlombaan sekolah dengan desain yang lebih berani dan solid.', year: '2024', tools: ['Canva'] },
              { id: 9, title: 'Banner Natyasastra', tag: 'Visual Design', img: 'https://i.postimg.cc/KvPC6k9n/Banner-Natyasastra.png', desc: 'Media komunikasi visual untuk pementasan seni, memadukan unsur klasik sastra dengan tata letak modern.', year: '2023', tools: ['Canva'] },
              { id: 10, title: 'Banner Natyasastra 2', tag: 'Visual Design', img: 'https://i.postimg.cc/hPLNkzCQ/Banner-Natyasastra-2.png', desc: 'Eksplorasi alternatif desain untuk kampanye publikasi acara seni.', year: '2023', tools: ['Canva'] },
            ].map((p, idx) => (
              <motion.div 
                key={idx} 
                {...fadeUp} 
                className="group flex flex-col gap-6 cursor-pointer"
                onClick={() => setSelectedProject(p)}
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-white border border-black/5 flex items-center justify-center p-8 group-hover:border-accent/20 group-hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] transition-all duration-500 ease-out">
                  <div className="absolute top-5 left-5 flex gap-2 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                    <span className="bg-dark px-3 py-1.5 text-[9px] font-black tracking-[0.2em] uppercase text-white">
                      {p.year}
                    </span>
                  </div>
                  <OptimizedImage 
                    src={p.img} 
                    alt={p.title} 
                    fill 
                    priority={idx < 2}
                    className="group-hover:scale-[1.04]" 
                  />
                  <div className="absolute inset-0 bg-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <div className="flex flex-col gap-4 px-2">
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] md:text-[11px] font-bold tracking-[0.25em] text-accent uppercase">{p.tag}</span>
                        <div className="h-[1px] w-4 bg-accent/30 group-hover:w-8 transition-all duration-500" />
                      </div>
                      <h4 className="font-heading text-xl md:text-3xl font-bold text-dark tracking-tight leading-tight group-hover:text-accent transition-colors duration-300">
                        {p.title}
                      </h4>
                    </div>
                    <div className="w-12 h-12 shrink-0 hidden sm:flex items-center justify-center bg-white border border-black/5 text-dark group-hover:bg-dark group-hover:border-dark group-hover:text-white transition-all duration-500 shadow-sm rounded-none origin-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0">
                      <ArrowUpRight size={22} strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  <p className="text-neutral-500 text-sm md:text-base leading-[1.7] line-clamp-2 md:max-w-[90%] font-medium">
                    {p.desc}
                  </p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-2 pt-6 border-t border-black/[0.05] mt-2">
                    {p.tools.map((tool, i) => (
                      <span key={i} className="text-[10px] font-bold tracking-[0.15em] text-neutral-400 uppercase flex items-center gap-2 group-hover:text-neutral-600 transition-colors">
                        <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div {...fadeUp} className="mt-32 pt-16 border-t border-black/5">
            <h4 className="text-[10px] font-bold tracking-[0.3em] text-neutral-400 uppercase text-center mb-12">Trusted By / Endorsements</h4>
            <div className="flex flex-wrap justify-center gap-x-12 sm:gap-x-20 gap-y-10 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
              {['Skintific', 'Garnier', 'Jiera', 'The Face', 'Grace2Glow'].map(brand => (
                <span key={brand} className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-dark tracking-tight uppercase">{brand}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section - High Impact */}
      <section id="kontak" className="py-32 md:py-40 px-6 md:px-8 lg:px-12 bg-dark relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div {...fadeUp} className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-8 lg:mb-10">
              <span className="w-8 h-[1px] bg-accent/50 hidden md:block"></span>
              <h2 className="text-[10px] md:text-[11px] font-bold tracking-[0.3em] text-accent uppercase">Let&apos;s talk</h2>
              <span className="w-8 h-[1px] bg-accent/50 hidden md:block"></span>
            </div>
            <a href="mailto:aghna1011@gmail.com" className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-black text-white leading-[0.9] tracking-tight uppercase hover:text-accent transition-colors duration-500 break-words max-w-full">
              GET IN TOUCH<span className="text-accent">.</span>
            </a>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10 mt-20 md:mt-28 text-left border-t border-white/10 pt-16">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase">Contact Details</span>
              <p className="text-white mt-4 font-bold text-lg md:text-xl">0858 6071 7548</p>
              <p className="text-neutral-400 mt-1 font-medium text-sm md:text-base">aghna1011@gmail.com</p>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase">Location</span>
              <p className="text-white mt-4 font-bold text-lg md:text-xl">Bogor, Indonesia</p>
              <p className="text-neutral-400 mt-1 font-medium text-sm md:text-base">Remote Work Available</p>
            </div>
            <div className="flex gap-4 md:justify-end items-end pt-4 md:pt-0">
              {[
                { i: <Instagram size={20} strokeWidth={2} />, l: 'https://instagram.com/aghnafatkhi' },
                { i: <Video size={20} strokeWidth={2} />, l: 'https://tiktok.com/@aknaontt' }
              ].map((s, i) => (
                <a key={i} href={s.l} target="_blank" rel="noopener noreferrer" className="w-[52px] h-[52px] border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:border-accent transition-colors duration-300">
                  {s.i}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Copyright */}
      <footer className="py-8 bg-dark px-6 md:px-8 lg:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-[9px] md:text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
            &copy; {new Date().getFullYear()} AGHNA FATKHI. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6 md:gap-8">
            <span className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-accent uppercase">Editorial Experience</span>
            <span className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase">Designed with Precision</span>
          </div>
        </div>
      </footer>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12"
          >
            <div 
              className="absolute inset-0 bg-dark/80 backdrop-blur-sm cursor-pointer" 
              onClick={() => setSelectedProject(null)}
            />
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.1, type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-dark/10 hover:bg-dark text-dark hover:text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-1/2 bg-neutral-100 flex items-center justify-center p-8 lg:p-12 border-b md:border-b-0 md:border-r border-black/5 relative min-h-[40vh] md:min-h-[50vh]">
                <OptimizedImage 
                  src={selectedProject.img} 
                  alt={selectedProject.title} 
                  fill
                  className="p-4"
                />
              </div>

              <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[10px] md:text-xs font-bold tracking-[0.25em] text-accent uppercase">{selectedProject.tag}</span>
                  <div className="h-[1px] w-6 bg-accent/30" />
                  <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">{selectedProject.year}</span>
                </div>
                
                <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black text-dark tracking-tight leading-none mb-6">
                  {selectedProject.title}
                </h3>
                
                <p className="text-neutral-600 leading-relaxed md:text-lg mb-8 font-medium">
                  {selectedProject.desc}
                </p>

                <div className="mt-auto pt-8 border-t border-black/5">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase block mb-4">Software Used</span>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.tools.map((tool, i) => (
                      <span key={i} className="text-[11px] font-bold tracking-[0.15em] text-dark bg-neutral-100 px-4 py-2 uppercase border border-black/5">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Showreel Video Modal */}
      <AnimatePresence>
        {showShowreel && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12"
          >
            <div 
              className="absolute inset-0 bg-dark/95 backdrop-blur-md cursor-pointer" 
              onClick={() => setShowShowreel(false)}
            />
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.1, type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-5xl aspect-video relative z-10 shadow-2xl bg-black rounded-sm overflow-hidden border border-white/10"
            >
              <button 
                onClick={() => setShowShowreel(false)}
                className="absolute top-4 right-4 z-20 w-12 h-12 bg-black/50 hover:bg-black text-white hover:text-accent rounded-full flex items-center justify-center transition-colors border border-white/20 cursor-pointer"
              >
                <X size={24} />
              </button>
              
              <video 
                src="/showreel.mp4" 
                autoPlay
                controls
                playsInline
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
