'use client';

import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { 
  Crop, RotateCw, RotateCcw, ZoomIn, ZoomOut, 
  Check, X, Sparkles, RefreshCw, Layers
} from 'lucide-react';
import { getCroppedImg } from '@/lib/cropImage';

export interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
}

type AspectRatioPreset = {
  label: string;
  value: number | undefined;
  desc: string;
};

const ASPECT_RATIOS: AspectRatioPreset[] = [
  { label: '16:9', value: 16 / 9, desc: 'Landscape (Rekomendasi)' },
  { label: '4:3', value: 4 / 3, desc: 'Visual Standar' },
  { label: '3:2', value: 3 / 2, desc: 'Foto & Kamera' },
  { label: '1:1', value: 1, desc: 'Persegi / Square' },
  { label: 'Bebas', value: undefined, desc: 'Sesuai Aslinya' },
];

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = useCallback((newCrop: { x: number; y: number }) => {
    setCrop(newCrop);
  }, []);

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const onCropAreaComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleApplyCrop = async () => {
    if (!croppedAreaPixels || !imageSrc) return;

    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      onCropComplete(croppedImage);
      onClose();
    } catch (err) {
      console.error('Error cropping image:', err);
      alert('Gagal memotong gambar. Pastikan gambar dapat dimuat dengan baik.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setAspect(16 / 9);
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#141414] border border-neutral-800 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-[#181818]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ff3b00]/10 border border-[#ff3b00]/20 flex items-center justify-center text-[#ff3b00]">
              <Crop size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Sesuaikan & Potong Thumbnail
              </h3>
              <p className="text-[11px] text-neutral-400">
                Pilih rasio dan atur posisi bingkai agar tampilan thumbnail seragam & konsisten.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Cropping Canvas Area */}
        <div className="relative w-full h-80 sm:h-96 bg-[#0a0a0a] overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropAreaComplete}
            showGrid={true}
            style={{
              containerStyle: {
                backgroundColor: '#0a0a0a',
              },
              cropAreaStyle: {
                border: '2px solid #ff3b00',
                boxShadow: '0 0 0 9999em rgba(0, 0, 0, 0.7)',
              },
            }}
          />

          {/* Hint Overlay */}
          <div className="absolute top-3 left-3 pointer-events-none bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] text-neutral-300 flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#ff3b00]" />
            <span>Geser / Drag untuk menyesuaikan posisi</span>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="p-4 sm:p-5 bg-[#161616] border-t border-neutral-800 space-y-4">
          
          {/* Aspect Ratio Selector */}
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              <Layers size={12} className="text-[#ff3b00]" />
              <span>Rasio Aspek Thumbnail:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {ASPECT_RATIOS.map((item) => {
                const isSelected = aspect === item.value;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setAspect(item.value)}
                    className={`px-3 py-2 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-[#ff3b00]/15 border-[#ff3b00] text-white shadow-sm'
                        : 'bg-[#1f1f1f] border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>{item.label}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b00]" />}
                    </div>
                    <div className="text-[9px] text-neutral-400 truncate mt-0.5">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zoom and Rotation Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-800/60">
            {/* Zoom Slider */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider w-12 shrink-0">
                Zoom:
              </span>
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.max(1, prev - 0.2))}
                className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-[#ff3b00] h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.min(3, prev + 0.2))}
                className="w-7 h-7 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
              <span className="text-[11px] font-mono text-neutral-400 w-10 text-right">
                {zoom.toFixed(1)}x
              </span>
            </div>

            {/* Rotation & Reset Controls */}
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mr-1">
                  Putar:
                </span>
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev - 90) % 360)}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Putar 90 derajat ke kiri"
                >
                  <RotateCcw size={13} /> -90°
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Putar 90 derajat ke kanan"
                >
                  <RotateCw size={13} /> +90°
                </button>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1.5 rounded-lg bg-neutral-800/60 hover:bg-neutral-700 text-neutral-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
                title="Reset Penyesuaian"
              >
                <RefreshCw size={12} /> Reset
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-white rounded-xl transition-colors"
              disabled={isProcessing}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleApplyCrop}
              disabled={isProcessing}
              className="px-5 py-2 bg-[#ff3b00] hover:bg-[#e03400] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#ff3b00]/20 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Memproses Crop...
                </>
              ) : (
                <>
                  <Check size={14} />
                  Terapkan & Simpan Crop
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
