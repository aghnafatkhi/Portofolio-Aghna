'use client';

import { useSyncExternalStore } from 'react';

export type ProjectCategory = 'graphics' | 'videography' | 'photography' | 'web';

export type Project = {
  id: number;
  title: string;
  tag: string;
  category: ProjectCategory;
  img: string;
  desc: string;
  year: string;
  tools?: string[];
  link?: string;
};

export const INITIAL_PROJECTS: Project[] = [
  { id: 1, title: 'Banner IPM 17an', tag: 'Visual Design', category: 'graphics', img: '/crafts/banner-ipm-17an.webp', desc: 'Desain banner publikasi untuk perayaan HUT RI ke-78 yang diselenggarakan oleh Ikatan Pelajar Muhammadiyah.', year: '2023', tools: ['Canva'] },
  { id: 2, title: 'Logo: Universe Origin', tag: 'Branding', category: 'graphics', img: '/crafts/logo-universe-origin.webp', desc: 'Eksplorasi pembuatan identitas visual untuk brand lokal, memadukan elemen futuristik dan minimalis.', year: '2024', tools: ['Canva'] },
  { id: 3, title: 'Banner Mapecap', tag: 'Visual Design', category: 'graphics', img: '/crafts/banner-mapecap.webp', desc: 'Media promosi visual untuk kegiatan pengenalan lingkungan sekolah, dengan gaya dinamis dan muda.', year: '2023', tools: ['Canva'] },
  { id: 4, title: 'Logo: Kampung Terapung', tag: 'Branding', category: 'graphics', img: '/crafts/logo-kampung-terapung.webp', desc: 'Perancangan logo komunitas wisata lokal untuk menarik minat pengunjung dengan pendekatan budaya.', year: '2024', tools: ['Canva'] },
  { id: 5, title: 'Banner Upgrading', tag: 'Visual Design', category: 'graphics', img: '/crafts/banner-upgrading.webp', desc: 'Desain visual untuk program pelatihan peningkatan kapasitas pengurus organisasi.', year: '2023', tools: ['Canva'] },
  { id: 6, title: 'DOSQ Series Season 1', tag: 'Branding', category: 'graphics', img: '/crafts/dosq-season-1.webp', desc: 'Identitas visual resmi untuk series perlombaan sekolah, menonjolkan kesan kompetitif dan kreatif.', year: '2023', tools: ['Canva'] },
  { id: 7, title: 'Banner Classmeeting', tag: 'Visual Design', category: 'graphics', img: '/crafts/banner-classmeeting.webp', desc: 'Publikasi kegiatan Classmeeting pasca ujian, menggunakan warna cerah untuk membangun antusiasme.', year: '2022', tools: ['Canva'] },
  { id: 8, title: 'DOSQ Series Season 2', tag: 'Branding', category: 'graphics', img: '/crafts/dosq-season-2.webp', desc: 'Evolusi identitas visual untuk musim kedua perlombaan sekolah dengan desain yang lebih berani dan solid.', year: '2024', tools: ['Canva'] },
  { id: 9, title: 'Banner Natyasastra', tag: 'Visual Design', category: 'graphics', img: '/crafts/banner-natyasastra.webp', desc: 'Media komunikasi visual untuk pementasan seni, memadukan unsur klasik sastra dengan tata letak modern.', year: '2023', tools: ['Canva'] },
  { id: 10, title: 'Banner Natyasastra 2', tag: 'Visual Design', category: 'graphics', img: '/crafts/banner-natyasastra-2.webp', desc: 'Eksplorasi alternatif desain untuk kampanye publikasi acara seni.', year: '2023', tools: ['Canva'] },
  { id: 11, title: 'Teaser Project: MPL SMAN 1 Cileungsi', tag: 'Videography / Event', category: 'videography', img: '/crafts/teaser-mpl.webp', desc: 'Produksi video teaser sinematik untuk pembukaan MPL SMAN 1 Cileungsi dengan editing dinamis dan penceritaan kuat.', year: '2024', tools: ['DaVinci Resolve', 'Sony a6400'] },
  { id: 12, title: 'Short Film: "Asa di Balik Lensa"', tag: 'Cinematic / Story', category: 'videography', img: '/crafts/short-film-asa.webp', desc: 'Sutradara dan editor utama dalam film pendek drama remaja bertema perjuangan memvisualisasikan mimpi.', year: '2024', tools: ['Resolve', 'CapCut', 'Storyboarding'] },
  { id: 13, title: 'Documentation: Upgrading IPM', tag: 'Event / Promo', category: 'videography', img: '/crafts/documentation-upgrading.webp', desc: 'Dokumentasi sinematik berdurasi pendek untuk memperkuat value branding program upgrading organisasi.', year: '2023', tools: ['CapCut', 'DJI Osmo'] },
  { id: 14, title: 'Street Photography: "Cileungsi Nocturne"', tag: 'Street Photography', category: 'photography', img: '/crafts/street-photography.webp', desc: 'Eksplorasi kehidupan malam Bogor di sudut Cileungsi, menangkap paduan cahaya neon dan gerakan perkotaan.', year: '2024', tools: ['Sony a6400', 'Lightroom'] },
  { id: 15, title: 'Portraiture: "Human & Expression"', tag: 'Portrait', category: 'photography', img: '/crafts/portraiture-expression.webp', desc: 'Kumpulan foto potret emosional yang berfokus pada kejujuran ekspresi wajah dan interaksi manusia.', year: '2024', tools: ['Sony a6400', 'Lightroom'] },
  { id: 16, title: 'Landscape Study: "Morning Mist"', tag: 'Landscape', category: 'photography', img: '/crafts/landscape-morning-mist.webp', desc: 'Studi pemandangan kabut pagi di pinggiran Bogor dengan pendekatan estetika simetri alam yang menenangkan.', year: '2023', tools: ['Fujifilm X-T20'] },
  { id: 17, title: 'Aghna Fatkhi: Creative Portfolio', tag: 'Web Development / UI', category: 'web', img: '/crafts/portfolio-website.webp', desc: 'Website portofolio interaktif berarsitektur modern dengan tema high-contrast, transisi sinematik, integrasi form inbox, dan performa tinggi.', year: '2024', tools: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Motion'], link: 'https://github.com/aghnafatkhi' },
  { id: 18, title: 'Cinematography Portal & Showcase', tag: 'Web App / Portal', category: 'web', img: '/crafts/cinematography-portal.webp', desc: 'Platform showcase karya video sinematografi sekolah, katalog film pendek, serta profil anggota dengan antarmuka gelap yang imersif.', year: '2024', tools: ['React', 'Tailwind CSS', 'Vite', 'JavaScript'], link: 'https://github.com/aghnafatkhi' },
  { id: 19, title: 'Series & Event Interactive Site', tag: 'Landing Page / UI', category: 'web', img: '/crafts/series-event-site.webp', desc: 'Landing page interaktif untuk promosi event perlombaan dan kegiatan dengan navigasi responsif serta visual typography tajam.', year: '2023', tools: ['HTML5', 'Tailwind CSS', 'JavaScript'], link: 'https://github.com/aghnafatkhi' },
  { id: 20, title: 'Digital Media Link Hub', tag: 'Web Tool / Minimalist', category: 'web', img: '/crafts/digital-media-hub.webp', desc: 'Pusat integrasi media sosial dan karya multimedia berbasis website responsif dengan waktu muat instan dan arsitektur modular.', year: '2024', tools: ['Next.js', 'Tailwind CSS', 'Vercel'], link: 'https://github.com/aghnafatkhi' },
];

export const CRAFTS_STORAGE_KEY = 'aghna_portfolio_crafts_v2';
export const CRAFTS_UPDATED_EVENT = 'aghna_crafts_updated';

const CATEGORIES: ProjectCategory[] = ['graphics', 'videography', 'photography', 'web'];

export function isValidProjectList(value: unknown): value is Project[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (!item || typeof item !== 'object') return false;
      const p = item as Record<string, unknown>;
      return (
        typeof p.id === 'number' &&
        typeof p.title === 'string' &&
        typeof p.tag === 'string' &&
        typeof p.img === 'string' &&
        typeof p.desc === 'string' &&
        typeof p.year === 'string' &&
        CATEGORIES.includes(p.category as ProjectCategory) &&
        (p.link === undefined || typeof p.link === 'string')
      );
    })
  );
}

let cachedCrafts: Project[] = INITIAL_PROJECTS;
let cachedRaw: string | null = null;

export function getStoredCrafts(): Project[] {
  if (typeof window === 'undefined') {
    return INITIAL_PROJECTS;
  }
  try {
    const raw = localStorage.getItem(CRAFTS_STORAGE_KEY);
    if (!raw) {
      return INITIAL_PROJECTS;
    }
    if (raw === cachedRaw) {
      return cachedCrafts;
    }
    const parsed = JSON.parse(raw);
    if (isValidProjectList(parsed)) {
      cachedCrafts = parsed;
      cachedRaw = raw;
      return parsed;
    }
    return INITIAL_PROJECTS;
  } catch {
    return INITIAL_PROJECTS;
  }
}

export function saveStoredCrafts(projects: Project[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const serialized = JSON.stringify(projects);
    localStorage.setItem(CRAFTS_STORAGE_KEY, serialized);
    cachedCrafts = projects;
    cachedRaw = serialized;
    window.dispatchEvent(new CustomEvent(CRAFTS_UPDATED_EVENT, { detail: projects }));
    return true;
  } catch (err) {
    console.error('Failed to save crafts to local storage', err);
    return false;
  }
}

export function resetStoredCrafts(): Project[] {
  if (typeof window === 'undefined') return INITIAL_PROJECTS;
  try {
    const serialized = JSON.stringify(INITIAL_PROJECTS);
    localStorage.setItem(CRAFTS_STORAGE_KEY, serialized);
    cachedCrafts = INITIAL_PROJECTS;
    cachedRaw = serialized;
    window.dispatchEvent(new CustomEvent(CRAFTS_UPDATED_EVENT, { detail: INITIAL_PROJECTS }));
    return INITIAL_PROJECTS;
  } catch {
    return INITIAL_PROJECTS;
  }
}

// React standard hook using useSyncExternalStore for flawless client synchronization
export function useCraftsStore(): Project[] {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined') return () => {};
      window.addEventListener(CRAFTS_UPDATED_EVENT, callback);
      window.addEventListener('storage', callback);
      return () => {
        window.removeEventListener(CRAFTS_UPDATED_EVENT, callback);
        window.removeEventListener('storage', callback);
      };
    },
    () => getStoredCrafts(),
    () => INITIAL_PROJECTS
  );
}
