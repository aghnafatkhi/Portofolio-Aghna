'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, Trash2, Edit3, Lock, Unlock, ArrowLeft,
  CheckCircle2, AlertTriangle, RefreshCw, Eye, ExternalLink,
  Search, ShieldCheck, X, Image as ImageIcon, Download, Upload,
  UploadCloud, Link as LinkIcon, FileImage, Crop
} from 'lucide-react';
import { 
  Project, ProjectCategory, useCraftsStore, 
  saveStoredCrafts, resetStoredCrafts 
} from '@/lib/crafts';
import ImageCropperModal from '@/components/ImageCropperModal';

const DEFAULT_SECRET_PIN = 'aghna1011';

export default function AdminCraftsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const key = urlParams.get('key') || urlParams.get('secret');
      const savedAuth = sessionStorage.getItem('aghna_admin_auth');
      return key === DEFAULT_SECRET_PIN || key === '1011' || key === 'aghna' || savedAuth === 'true';
    } catch {
      return false;
    }
  });

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Crafts State
  const crafts = useCraftsStore();
  const [filterCategory, setFilterCategory] = useState<'all' | ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCraft, setEditingCraft] = useState<Project | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    tag: '',
    category: 'graphics' as ProjectCategory,
    img: '',
    desc: '',
    year: new Date().getFullYear().toString(),
    link: ''
  });

  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const openCropperWithImage = (src: string) => {
    if (!src) return;
    setImageToCrop(src);
    setIsCropperOpen(true);
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, WebP, GIF, SVG).');
      return;
    }

    setIsProcessingImage(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        setIsProcessingImage(false);
        return;
      }

      setFormData((prev) => ({ ...prev, img: result }));
      setImageToCrop(result);
      setIsProcessingImage(false);
      setIsCropperOpen(true);
      showToast('Gambar dimuat! Sesuaikan bingkai thumbnail Anda.');
    };

    reader.onerror = () => {
      setIsProcessingImage(false);
      alert('Gagal membaca file gambar.');
    };

    reader.readAsDataURL(file);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim().toLowerCase() === DEFAULT_SECRET_PIN || pinInput.trim() === '1011' || pinInput.trim().toLowerCase() === 'aghna') {
      setIsAuthenticated(true);
      sessionStorage.setItem('aghna_admin_auth', 'true');
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('aghna_admin_auth');
  };

  const openAddModal = () => {
    setEditingCraft(null);
    setImageInputMode('upload');
    setFormData({
      title: '',
      tag: '',
      category: 'graphics',
      img: '',
      desc: '',
      year: new Date().getFullYear().toString(),
      link: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (craft: Project) => {
    setEditingCraft(craft);
    setImageInputMode(craft.img?.startsWith('http') ? 'url' : 'upload');
    setFormData({
      title: craft.title,
      tag: craft.tag,
      category: craft.category,
      img: craft.img,
      desc: craft.desc,
      year: craft.year,
      link: craft.link || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveCraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.img.trim()) {
      alert('Judul dan gambar wajib diisi.');
      return;
    }

    if (editingCraft) {
      // Edit existing
      const updated = crafts.map(c => {
        if (c.id === editingCraft.id) {
          return {
            ...c,
            title: formData.title.trim(),
            tag: formData.tag.trim() || 'Creative Craft',
            category: formData.category,
            img: formData.img.trim(),
            desc: formData.desc.trim(),
            year: formData.year.trim() || '2024',
            link: formData.link.trim() || undefined
          };
        }
        return c;
      });
      saveStoredCrafts(updated);
      showToast(`Craft "${formData.title}" berhasil diperbarui!`);
    } else {
      // Add new
      const nextId = crafts.length > 0 ? Math.max(...crafts.map(c => c.id)) + 1 : 1;
      const newCraft: Project = {
        id: nextId,
        title: formData.title.trim(),
        tag: formData.tag.trim() || 'Creative Craft',
        category: formData.category,
        img: formData.img.trim(),
        desc: formData.desc.trim(),
        year: formData.year.trim() || '2024',
        link: formData.link.trim() || undefined
      };
      const updated = [newCraft, ...crafts];
      saveStoredCrafts(updated);
      showToast(`Craft baru "${formData.title}" berhasil ditambahkan!`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    const target = crafts.find(c => c.id === id);
    const updated = crafts.filter(c => c.id !== id);
    saveStoredCrafts(updated);
    setDeleteConfirmId(null);
    showToast(`Craft "${target?.title || 'Proyek'}" telah dihapus.`);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset semua data craft kembali ke template awal? Semua penambahan baru akan hilang.')) {
      resetStoredCrafts();
      showToast('Data crafts berhasil direset ke bawaan awal!');
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(crafts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `crafts-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            saveStoredCrafts(parsed);
            showToast('Data crafts berhasil diimpor dari file JSON!');
          } else {
            alert('Format file JSON tidak valid.');
          }
        } catch {
          alert('Gagal membaca file JSON.');
        }
      };
    }
  };

  // Filtered Crafts
  const filteredCrafts = crafts.filter(c => {
    const matchesCategory = filterCategory === 'all' || c.category === filterCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // If Not Authenticated, Show Lock Screen
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0d0d0d] text-[#e5e5e5] flex flex-col items-center justify-center p-6 selection:bg-[#ff3b00] selection:text-white">
        <div className="w-full max-w-md bg-[#161616] border border-neutral-800 p-8 rounded-2xl shadow-2xl relative">
          <div className="w-12 h-12 bg-[#ff3b00]/10 border border-[#ff3b00]/30 rounded-xl flex items-center justify-center text-[#ff3b00] mb-6 mx-auto">
            <Lock size={24} />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-white text-center mb-1">
            Panel Khusus Admin Crafts
          </h1>
          <p className="text-xs text-neutral-400 text-center mb-6">
            Halaman ini dilindungi. Masukkan PIN akses atau gunakan link khusus untuk mengelola craft portofolio.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-2">
                PIN / Kunci Akses
              </label>
              <input
                type="password"
                placeholder="Masukkan PIN (Default: aghna1011)"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                className={`w-full bg-[#202020] border ${pinError ? 'border-red-500 text-red-300' : 'border-neutral-700 text-white'} px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[#ff3b00] transition-colors`}
                autoFocus
              />
              {pinError && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertTriangle size={12} /> PIN akses salah. Silakan coba lagi.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#ff3b00] hover:bg-[#e03400] text-white font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <Unlock size={16} /> Buka Panel Admin
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500">
            <Link href="/" className="hover:text-white flex items-center gap-1.5 transition-colors">
              <ArrowLeft size={14} /> Kembali ke Portofolio
            </Link>
            <span className="text-[10px] tracking-wider text-neutral-600">Aghna Fatkhi</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-200 selection:bg-[#ff3b00] selection:text-white pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#ff3b00] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold tracking-wide animate-bounce">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#121212]/90 backdrop-blur-md border-b border-neutral-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#ff3b00] text-white flex items-center justify-center font-black text-sm">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm text-white tracking-wide uppercase">
                  Studio Crafts Admin
                </h1>
                <span className="bg-[#ff3b00]/10 text-[#ff3b00] border border-[#ff3b00]/30 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Kelola karya grafik, video, foto, dan website portofolio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3.5 py-2 rounded-lg transition-colors border border-neutral-700"
            >
              <Eye size={14} /> Lihat Portofolio
            </Link>

            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 text-xs font-bold bg-[#ff3b00] hover:bg-[#e03400] text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-[#ff3b00]/20 uppercase tracking-wider"
            >
              <Plus size={16} /> Tambah Craft
            </button>

            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-neutral-400 hover:text-white px-2.5 py-2 transition-colors"
              title="Kunci Panel"
            >
              <Lock size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          <div className="bg-[#141414] border border-neutral-800 p-4 rounded-xl">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Crafts</span>
            <p className="text-2xl font-black text-white mt-1">{crafts.length}</p>
          </div>
          <div className="bg-[#141414] border border-neutral-800 p-4 rounded-xl">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Graphics</span>
            <p className="text-2xl font-black text-amber-400 mt-1">{crafts.filter(c => c.category === 'graphics').length}</p>
          </div>
          <div className="bg-[#141414] border border-neutral-800 p-4 rounded-xl">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Videography</span>
            <p className="text-2xl font-black text-blue-400 mt-1">{crafts.filter(c => c.category === 'videography').length}</p>
          </div>
          <div className="bg-[#141414] border border-neutral-800 p-4 rounded-xl">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Photography</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">{crafts.filter(c => c.category === 'photography').length}</p>
          </div>
          <div className="bg-[#141414] border border-neutral-800 p-4 rounded-xl col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Web / Dev</span>
            <p className="text-2xl font-black text-[#ff3b00] mt-1">{crafts.filter(c => c.category === 'web').length}</p>
          </div>
        </div>

        {/* Filters and Actions Bar */}
        <div className="bg-[#141414] border border-neutral-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'graphics', label: 'Graphics' },
              { id: 'videography', label: 'Videography' },
              { id: 'photography', label: 'Photography' },
              { id: 'web', label: 'Web / Dev' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id as any)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider ${
                  filterCategory === cat.id 
                    ? 'bg-[#ff3b00] text-white' 
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Tool Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Cari judul, tag, deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-neutral-700 text-xs text-white pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:border-[#ff3b00]"
              />
            </div>

            {/* Export / Import & Reset */}
            <button
              onClick={handleExportJSON}
              title="Backup data ke file JSON"
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs flex items-center gap-1 border border-neutral-700"
            >
              <Download size={14} />
            </button>

            <label
              title="Impor data dari file JSON"
              className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs flex items-center gap-1 border border-neutral-700 cursor-pointer"
            >
              <Upload size={14} />
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={handleResetToDefault}
              title="Reset ke data awal"
              className="p-2 bg-neutral-800 hover:bg-red-950/60 text-neutral-400 hover:text-red-300 rounded-lg text-xs flex items-center gap-1 border border-neutral-700"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Crafts Grid */}
        {filteredCrafts.length === 0 ? (
          <div className="text-center py-16 bg-[#141414] border border-neutral-800 rounded-2xl p-8">
            <p className="text-sm text-neutral-400 mb-4">Tidak ada craft yang ditemukan dengan kriteria ini.</p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 bg-[#ff3b00] hover:bg-[#e03400] text-white text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-wider"
            >
              <Plus size={14} /> Tambah Craft Baru
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCrafts.map((craft) => (
              <div 
                key={craft.id}
                className="bg-[#141414] border border-neutral-800 hover:border-neutral-700 rounded-xl overflow-hidden flex flex-col group transition-all"
              >
                {/* Image Preview */}
                <div className="relative aspect-video w-full bg-[#1e1e1e] overflow-hidden">
                  <Image
                    src={craft.img}
                    alt={craft.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Fallback image if broken
                      (e.target as any).src = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200';
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                      craft.category === 'graphics' ? 'bg-amber-500/90 text-black' :
                      craft.category === 'videography' ? 'bg-blue-500/90 text-white' :
                      craft.category === 'photography' ? 'bg-emerald-500/90 text-black' :
                      'bg-[#ff3b00] text-white'
                    }`}>
                      {craft.category}
                    </span>
                    <span className="bg-black/70 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                      {craft.year}
                    </span>
                  </div>

                  {craft.link && (
                    <div className="absolute top-2.5 right-2.5">
                      <a 
                        href={craft.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-1.5 bg-black/70 hover:bg-[#ff3b00] text-white rounded-md transition-colors inline-block"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#ff3b00] uppercase block mb-1">
                      {craft.tag}
                    </span>
                    <h3 className="font-bold text-base text-white line-clamp-1 mb-2">
                      {craft.title}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                      {craft.desc}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-neutral-500 font-mono">
                      ID #{craft.id}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(craft)}
                        className="flex items-center gap-1 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-2.5 py-1.5 rounded-md transition-colors"
                      >
                        <Edit3 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(craft.id)}
                        className="flex items-center gap-1 text-xs font-semibold bg-red-950/30 hover:bg-red-900/60 text-red-400 px-2.5 py-1.5 rounded-md transition-colors border border-red-900/30"
                      >
                        <Trash2 size={12} /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-neutral-800 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Konfirmasi Hapus Craft</h3>
            <p className="text-xs text-neutral-400 mb-6">
              Karya ini akan dihapus dari daftar portofolio Anda. Tindakan ini tidak dapat dibatalkan kecuali dengan reset.
            </p>
            <div className="flex items-center justify-center gap-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-300 uppercase tracking-wider transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white uppercase tracking-wider transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#161616] border border-neutral-800 rounded-2xl max-w-xl w-full p-6 my-8 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#ff3b00]/10 text-[#ff3b00] flex items-center justify-center">
                {editingCraft ? <Edit3 size={16} /> : <Plus size={16} />}
              </div>
              <h2 className="text-lg font-bold text-white">
                {editingCraft ? 'Edit Craft' : 'Tambah Craft Baru'}
              </h2>
            </div>

            <form onSubmit={handleSaveCraft} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                    Judul Karya *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Banner Classmeeting"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#202020] border border-neutral-700 text-xs text-white px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#ff3b00]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                    Kategori *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
                    className="w-full bg-[#202020] border border-neutral-700 text-xs text-white px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#ff3b00]"
                  >
                    <option value="graphics">Graphics (Desain Grafis)</option>
                    <option value="videography">Videography (Video)</option>
                    <option value="photography">Photography (Foto)</option>
                    <option value="web">Web (Website / Dev)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tag */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                    Tag / Sub-Label
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Visual Design, Web App"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full bg-[#202020] border border-neutral-700 text-xs text-white px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#ff3b00]"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                    Tahun Pembuatan
                  </label>
                  <input
                    type="text"
                    placeholder="2024"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-[#202020] border border-neutral-700 text-xs text-white px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#ff3b00]"
                  />
                </div>
              </div>

              {/* Image / Thumbnail Section with Upload & Drag-and-Drop */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <label className="block text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                    Thumbnail / Visual Karya *
                  </label>
                  
                  {/* Source Switcher */}
                  <div className="flex items-center bg-[#1a1a1a] p-0.5 rounded-lg border border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('upload')}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                        imageInputMode === 'upload'
                          ? 'bg-[#ff3b00] text-white shadow'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <UploadCloud size={12} /> Upload / Drag & Drop
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                        imageInputMode === 'url'
                          ? 'bg-[#ff3b00] text-white shadow'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <LinkIcon size={12} /> Tautan URL
                    </button>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {imageInputMode === 'upload' ? (
                  <div>
                    {!formData.img ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleFileDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-7 text-center cursor-pointer transition-all duration-200 ${
                          isDragging
                            ? 'border-[#ff3b00] bg-[#ff3b00]/10 scale-[1.01]'
                            : 'border-neutral-700 hover:border-neutral-500 bg-[#1e1e1e]/60 hover:bg-[#1e1e1e]'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-neutral-800/80 border border-neutral-700 flex items-center justify-center mx-auto mb-3 text-neutral-300 group-hover:text-white">
                          <UploadCloud size={22} className={isDragging ? 'text-[#ff3b00] animate-bounce' : ''} />
                        </div>
                        <p className="text-xs font-bold text-white mb-1">
                          {isDragging ? 'Lepaskan gambar di sini...' : 'Tarik & lepas file gambar ke sini, atau klik untuk memilih'}
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          Mendukung PNG, JPG, WebP, GIF, SVG (otomatis dioptimalkan)
                        </p>
                        {isProcessingImage && (
                          <div className="mt-3 inline-flex items-center gap-2 text-xs text-[#ff3b00] font-medium bg-[#ff3b00]/10 px-3 py-1 rounded-full">
                            <div className="w-3.5 h-3.5 border-2 border-[#ff3b00] border-t-transparent rounded-full animate-spin" />
                            Memproses gambar...
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl overflow-hidden p-3">
                        <div className="relative w-full h-44 rounded-lg overflow-hidden bg-neutral-900 mb-3 border border-neutral-800">
                          <Image
                            src={formData.img}
                            alt="Pratinjau Thumbnail"
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as any).src = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200';
                            }}
                          />
                          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Thumbnail Aktif</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-neutral-400 text-[10px]">
                            <FileImage size={13} className="text-neutral-300" />
                            <span className="truncate max-w-[150px]">Gambar siap</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openCropperWithImage(formData.img)}
                              className="px-3 py-1.5 bg-[#ff3b00]/15 hover:bg-[#ff3b00]/25 text-[#ff3b00] text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 border border-[#ff3b00]/30"
                              title="Potong dan atur rasio thumbnail"
                            >
                              <Crop size={12} /> Crop & Sesuaikan
                            </button>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 border border-neutral-700"
                            >
                              <Upload size={12} /> Ganti
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, img: '' })}
                              className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 border border-red-900/40"
                            >
                              <Trash2 size={12} /> Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... atau https://i.postimg.cc/..."
                      value={formData.img}
                      onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                      className="w-full bg-[#202020] border border-neutral-700 text-xs text-white px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#ff3b00]"
                    />
                    {/* URL Preview */}
                    {formData.img && (
                      <div className="mt-2.5 p-2 bg-[#1e1e1e] border border-neutral-800 rounded-lg flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-10 rounded overflow-hidden bg-black shrink-0 border border-neutral-800">
                            <Image 
                              src={formData.img} 
                              alt="Preview" 
                              fill 
                              className="object-cover" 
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as any).src = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200';
                              }}
                            />
                          </div>
                          <span className="text-[10px] text-neutral-400 truncate">Pratinjau gambar siap digunakan</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openCropperWithImage(formData.img)}
                            className="text-[10px] text-[#ff3b00] hover:text-[#ff3b00]/80 font-bold px-2.5 py-1 bg-[#ff3b00]/10 rounded border border-[#ff3b00]/20 flex items-center gap-1"
                            title="Potong dan atur rasio thumbnail"
                          >
                            <Crop size={11} /> Crop
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, img: '' })}
                            className="text-[10px] text-red-400 hover:text-red-300 font-bold px-2 py-1 bg-red-950/30 rounded border border-red-900/30"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                  Deskripsi Singkat Karya
                </label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan konsep, pesan, atau tujuan karya ini..."
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full bg-[#202020] border border-neutral-700 text-xs text-white px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#ff3b00]"
                />
              </div>

              {/* Link Project */}
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                  Link Project (Opsional)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/... atau https://mywebsite.com"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full bg-[#202020] border border-neutral-700 text-xs text-white px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#ff3b00]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-300 uppercase tracking-wider transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#ff3b00] hover:bg-[#e03400] text-xs font-bold text-white uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-lg shadow-[#ff3b00]/20"
                >
                  <CheckCircle2 size={14} /> {editingCraft ? 'Simpan Perubahan' : 'Tambahkan Craft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Image Cropper Modal */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        imageSrc={imageToCrop}
        onClose={() => setIsCropperOpen(false)}
        onCropComplete={(croppedDataUrl) => {
          setFormData((prev) => ({ ...prev, img: croppedDataUrl }));
          showToast('Thumbnail berhasil dipotong & disesuaikan!');
        }}
      />
    </main>
  );
}
