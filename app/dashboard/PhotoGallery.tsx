"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Camera,
  Plus,
  Trash2,
  X,
  ImagePlus,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Photo {
  id: string;
  dataUrl: string;
  name: string;
  uploadedAt: string;
}

const STORAGE_KEY = "tuyor_gallery_photos";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function loadPhotos(): Photo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePhotos(photos: Photo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
}

interface PhotoGalleryProps {
  onGalleryChange?: () => void;
}

export default function PhotoGallery({ onGalleryChange }: PhotoGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // Load photos from localStorage on mount
  useEffect(() => {
    setPhotos(loadPhotos());
  }, []);

  // Process files into photos
  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (fileArray.length === 0) return;

      setIsLoading(true);
      let processed = 0;
      const newPhotos: Photo[] = [];

      fileArray.forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          processed++;
          if (processed === fileArray.length) {
            setPhotos((prev) => {
              const updated = [...newPhotos, ...prev];
              savePhotos(updated);
              return updated;
            });
            setIsLoading(false);
            onGalleryChange?.();
          }
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          newPhotos.push({
            id: generateId(),
            dataUrl: reader.result as string,
            name: file.name,
            uploadedAt: new Date().toISOString(),
          });
          processed++;
          if (processed === fileArray.length) {
            setPhotos((prev) => {
              const updated = [...newPhotos, ...prev];
              savePhotos(updated);
              return updated;
            });
            setIsLoading(false);
            onGalleryChange?.();
          }
        };
        reader.readAsDataURL(file);
      });
    },
    []
  );

  // Drag-and-drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  // Delete a photo
  const confirmDelete = (id: string) => {
    setPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      savePhotos(updated);
      return updated;
    });
    setDeleteTarget(null);
    // Close lightbox if we deleted the photo we were viewing
    if (lightboxIndex !== null) {
      setLightboxIndex(null);
    }
    onGalleryChange?.();
  };

  // Lightbox navigation
  const navigateLightbox = (direction: number) => {
    if (lightboxIndex === null) return;
    const next = lightboxIndex + direction;
    if (next >= 0 && next < photos.length) {
      setLightboxIndex(next);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") navigateLightbox(-1);
      if (e.key === "ArrowRight") navigateLightbox(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div className="mt-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/10">
            <Camera className="h-5 w-5 text-pink-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">My Photos</h2>
            <p className="text-xs text-zinc-500">
              {photos.length} photo{photos.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:from-indigo-500 hover:to-purple-500 active:scale-95 shadow-lg shadow-indigo-500/20"
        >
          <Plus className="h-4 w-4" /> Add Photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) processFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Drop Zone + Gallery */}
      <div
        ref={dropRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? "border-indigo-500 bg-indigo-500/10 scale-[1.01]"
            : "border-white/10 bg-white/[0.02]"
        }`}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-indigo-500" />
              <p className="text-sm text-zinc-300">Uploading...</p>
            </div>
          </div>
        )}

        {photos.length === 0 ? (
          /* Empty State */
          <div
            className="flex flex-col items-center justify-center py-20 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10">
              <ImagePlus className="h-10 w-10 text-zinc-600" />
            </div>
            <p className="text-lg font-medium text-zinc-400">
              No photos yet
            </p>
            <p className="mt-1 text-sm text-zinc-600">
              Click here or drag & drop images to upload
            </p>
            <div className="mt-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-zinc-500">
              <Upload className="h-4 w-4" /> JPG, PNG, GIF, WEBP — max 5MB
            </div>
          </div>
        ) : (
          /* Photo Grid */
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4">
            {/* Add More Card */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5"
            >
              <Plus className="h-8 w-8 text-zinc-600 transition-colors group-hover:text-indigo-400" />
              <span className="mt-2 text-xs text-zinc-600 group-hover:text-indigo-400">
                Add More
              </span>
            </div>

            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="photo-card group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black cursor-pointer transition-all hover:border-white/20 hover:shadow-lg hover:shadow-indigo-500/10"
                style={{ animationDelay: `${index * 60}ms` }}
                onClick={() => setLightboxIndex(index)}
              >
                <img
                  src={photo.dataUrl}
                  alt={photo.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex items-center justify-between p-3">
                    <p className="truncate text-xs font-medium text-white/80">
                      {photo.name}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(photo.id);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/20 text-red-400 transition-all hover:bg-red-500/40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Drag Overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-indigo-600/10 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-10 w-10 text-indigo-400 animate-bounce" />
              <p className="text-lg font-semibold text-indigo-300">
                Drop images here
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <div
          className="lightbox-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Photo Counter */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/70 backdrop-blur-md">
            {lightboxIndex + 1} / {photos.length}
          </div>

          {/* Navigation Arrows */}
          {lightboxIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox(-1);
              }}
              className="absolute left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          {lightboxIndex < photos.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox(1);
              }}
              className="absolute right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Image */}
          <img
            src={photos[lightboxIndex].dataUrl}
            alt={photos[lightboxIndex].name}
            className="lightbox-image max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Bottom Info Bar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 rounded-2xl bg-white/10 px-6 py-3 backdrop-blur-md">
            <p className="text-sm font-medium text-white/80">
              {photos[lightboxIndex].name}
            </p>
            <span className="text-xs text-zinc-500">
              {new Date(photos[lightboxIndex].uploadedAt).toLocaleDateString()}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTarget(photos[lightboxIndex].id);
              }}
              className="ml-2 flex items-center gap-1.5 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition-all hover:bg-red-500/30"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 mx-auto">
              <Trash2 className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-center text-lg font-semibold text-white">
              Delete Photo?
            </h3>
            <p className="mt-2 text-center text-sm text-zinc-400">
              This action cannot be undone. The photo will be permanently
              removed.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteTarget)}
                className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-all hover:bg-red-500 active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
