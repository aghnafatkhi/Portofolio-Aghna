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
  { id: 1, title: 'Banner IPM 17an', tag: 'Visual Design', category: 'graphics', img: 'https://i.postimg.cc/Jns9vpgz/Banner-17an.png', desc: 'Desain banner publikasi untuk perayaan HUT RI ke-78 yang diselenggarakan oleh Ikatan Pelajar Muhammadiyah.', year: '2023', tools: ['Canva'] },
  { id: 2, title: 'Logo: Universe Origin', tag: 'Branding', category: 'graphics', img: 'https://i.postimg.cc/05MsBNRk/Logo-UNO.png', desc: 'Eksplorasi pembuatan identitas visual untuk brand lokal, memadukan elemen futuristik dan minimalis.', year: '2024', tools: ['Canva'] },
  { id: 3, title: 'Banner Mapecap', tag: 'Visual Design', category: 'graphics', img: 'https://i.postimg.cc/nLRy3y3G/Banner-Mapecap.png', desc: 'Media promosi visual untuk kegiatan pengenalan lingkungan sekolah, dengan gaya dinamis dan muda.', year: '2023', tools: ['Canva'] },
  { id: 4, title: 'Logo: Kampung Terapung', tag: 'Branding', category: 'graphics', img: 'https://i.postimg.cc/hvF3wcTx/Logo-Kampung-Terapung.png', desc: 'Perancangan logo komunitas wisata lokal untuk menarik minat pengunjung dengan pendekatan budaya.', year: '2024', tools: ['Canva'] },
  { id: 5, title: 'Banner Upgrading', tag: 'Visual Design', category: 'graphics', img: 'https://i.postimg.cc/wMKbPgL3/Banner-Upgrading.png', desc: 'Desain visual untuk program pelatihan peningkatan kapasitas pengurus organisasi.', year: '2023', tools: ['Canva'] },
  { id: 6, title: 'DOSQ Series Season 1', tag: 'Branding', category: 'graphics', img: 'https://i.postimg.cc/HnGPKdXk/Logo-Doras.png', desc: 'Identitas visual resmi untuk series perlombaan sekolah, menonjolkan kesan kompetitif dan kreatif.', year: '2023', tools: ['Canva'] },
  { id: 7, title: 'Banner Classmeeting', tag: 'Visual Design', category: 'graphics', img: 'https://i.postimg.cc/fbR4jzfz/Banner-Classmeet.png', desc: 'Publikasi kegiatan Classmeeting pasca ujian, menggunakan warna cerah untuk membangun antusiasme.', year: '2022', tools: ['Canva'] },
  { id: 8, title: 'DOSQ Series Season 2', tag: 'Branding', category: 'graphics', img: 'https://i.postimg.cc/SR0t5kCK/Logo-DORAS-2.png', desc: 'Evolusi identitas visual untuk musim kedua perlombaan sekolah dengan desain yang lebih berani dan solid.', year: '2024', tools: ['Canva'] },
  { id: 9, title: 'Banner Natyasastra', tag: 'Visual Design', category: 'graphics', img: 'https://i.postimg.cc/KvPC6k9n/Banner-Natyasastra.png', desc: 'Media komunikasi visual untuk pementasan seni, memadukan unsur klasik sastra dengan tata letak modern.', year: '2023', tools: ['Canva'] },
  { id: 10, title: 'Banner Natyasastra 2', tag: 'Visual Design', category: 'graphics', img: 'https://i.postimg.cc/hPLNkzCQ/Banner-Natyasastra-2.png', desc: 'Eksplorasi alternatif desain untuk kampanye publikasi acara seni.', year: '2023', tools: ['Canva'] },
  { id: 11, title: 'Teaser Project: MPL SMAN 1 Cileungsi', tag: 'Videography / Event', category: 'videography', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025', desc: 'Produksi video teaser sinematik untuk pembukaan MPL SMAN 1 Cileungsi dengan editing dinamis dan penceritaan kuat.', year: '2024', tools: ['DaVinci Resolve', 'Sony a6400'] },
  { id: 12, title: 'Short Film: "Asa di Balik Lensa"', tag: 'Cinematic / Story', category: 'videography', img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1171', desc: 'Sutradara dan editor utama dalam film pendek drama remaja bertema perjuangan memvisualisasikan mimpi.', year: '2024', tools: ['Resolve', 'CapCut', 'Storyboarding'] },
  { id: 13, title: 'Documentation: Upgrading IPM', tag: 'Event / Promo', category: 'videography', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1159', desc: 'Dokumentasi sinematik berdurasi pendek untuk memperkuat value branding program upgrading organisasi.', year: '2023', tools: ['CapCut', 'DJI Osmo'] },
  { id: 14, title: 'Street Photography: "Cileungsi Nocturne"', tag: 'Street Photography', category: 'photography', img: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1156', desc: 'Eksplorasi kehidupan malam Bogor di sudut Cileungsi, menangkap paduan cahaya neon dan gerakan perkotaan.', year: '2024', tools: ['Sony a6400', 'Lightroom'] },
  { id: 15, title: 'Portraiture: "Human & Expression"', tag: 'Portrait', category: 'photography', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1064', desc: 'Kumpulan foto potret emosional yang berfokus pada kejujuran ekspresi wajah dan interaksi manusia.', year: '2024', tools: ['Sony a6400', 'Lightroom'] },
  { id: 16, title: 'Landscape Study: "Morning Mist"', tag: 'Landscape', category: 'photography', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1174', desc: 'Studi pemandangan kabut pagi di pinggiran Bogor dengan pendekatan estetika simetri alam yang menenangkan.', year: '2023', tools: ['Fujifilm X-T20'] },
  { id: 17, title: 'Aghna Fatkhi: Creative Portfolio', tag: 'Web Development / UI', category: 'web', img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200', desc: 'Website portofolio interaktif berarsitektur modern dengan tema high-contrast, transisi sinematik, integrasi form inbox, dan performa tinggi.', year: '2024', tools: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript', 'Motion'], link: 'https://github.com/aghnafatkhi' },
  { id: 18, title: 'Cinematography Portal & Showcase', tag: 'Web App / Portal', category: 'web', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200', desc: 'Platform showcase karya video sinematografi sekolah, katalog film pendek, serta profil anggota dengan antarmuka gelap yang imersif.', year: '2024', tools: ['React', 'Tailwind CSS', 'Vite', 'JavaScript'], link: 'https://github.com/aghnafatkhi' },
  { id: 19, title: 'Series & Event Interactive Site', tag: 'Landing Page / UI', category: 'web', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200', desc: 'Landing page interaktif untuk promosi event perlombaan dan kegiatan dengan navigasi responsif serta visual typography tajam.', year: '2023', tools: ['HTML5', 'Tailwind CSS', 'JavaScript'], link: 'https://github.com/aghnafatkhi' },
  { id: 20, title: 'Digital Media Link Hub', tag: 'Web Tool / Minimalist', category: 'web', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200', desc: 'Pusat integrasi media sosial dan karya multimedia berbasis website responsif dengan waktu muat instan dan arsitektur modular.', year: '2024', tools: ['Next.js', 'Tailwind CSS', 'Vercel'], link: 'https://github.com/aghnafatkhi' },
];

export const CRAFTS_STORAGE_KEY = 'aghna_portfolio_crafts_v1';
export const CRAFTS_UPDATED_EVENT = 'aghna_crafts_updated';

let cachedCrafts: Project[] = INITIAL_PROJECTS;
let cachedRaw: string | null = null;

export function getStoredCrafts(): Project[] {
  if (typeof window === 'undefined') {
    return INITIAL_PROJECTS;
  }
  try {
    const raw = localStorage.getItem(CRAFTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CRAFTS_STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      cachedCrafts = INITIAL_PROJECTS;
      cachedRaw = JSON.stringify(INITIAL_PROJECTS);
      return INITIAL_PROJECTS;
    }
    if (raw === cachedRaw) {
      return cachedCrafts;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      cachedCrafts = parsed;
      cachedRaw = raw;
      return parsed;
    }
    return INITIAL_PROJECTS;
  } catch {
    return INITIAL_PROJECTS;
  }
}

export function saveStoredCrafts(projects: Project[]): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(projects);
    localStorage.setItem(CRAFTS_STORAGE_KEY, serialized);
    cachedCrafts = projects;
    cachedRaw = serialized;
    window.dispatchEvent(new CustomEvent(CRAFTS_UPDATED_EVENT, { detail: projects }));
  } catch (err) {
    console.error('Failed to save crafts to local storage', err);
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
