"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImageIcon, HardDrive, Clock, LogOut } from "lucide-react";
import PhotoGallery from "./PhotoGallery";

const STORAGE_KEY = "tuyor_gallery_photos";

interface StoredPhoto {
  id: string;
  dataUrl: string;
  name: string;
  uploadedAt: string;
}

function getPhotoStats() {
  if (typeof window === "undefined") return { count: 0, sizeKB: 0, latest: "" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const photos: StoredPhoto[] = raw ? JSON.parse(raw) : [];
    const sizeBytes = new Blob([raw || ""]).size;
    const sizeKB = Math.round(sizeBytes / 1024);
    const latest = photos.length > 0
      ? new Date(photos[0].uploadedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "—";
    return { count: photos.length, sizeKB, latest };
  } catch {
    return { count: 0, sizeKB: 0, latest: "—" };
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ count: 0, sizeKB: 0, latest: "—" });

  useEffect(() => {
    setStats(getPhotoStats());

    // Listen for storage changes to update stats in real-time
    const handleStorage = () => setStats(getPhotoStats());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Re-calculate stats when gallery changes
  const handleGalleryChange = () => {
    setStats(getPhotoStats());
  };

  const handleLogout = () => {
    router.push("/");
  };

  const statCards = [
    { title: "Total Photos", value: stats.count.toString(), Icon: ImageIcon, color: "text-pink-400", dot: "bg-pink-500" },
    { title: "Storage Used", value: stats.sizeKB < 1024 ? `${stats.sizeKB} KB` : `${(stats.sizeKB / 1024).toFixed(1)} MB`, Icon: HardDrive, color: "text-cyan-400", dot: "bg-cyan-500" },
    { title: "Latest Upload", value: stats.latest, Icon: Clock, color: "text-amber-400", dot: "bg-amber-500" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden text-white selection:bg-indigo-500/30 font-[family-name:var(--font-geist-sans)]">
      {/* Background */}
      <div 
        className="absolute inset-0 -z-10 bg-black"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(10, 10, 10, 0.7), rgba(10, 10, 10, 0.9)), url("/profile-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <div className="w-full max-w-4xl px-6 py-20">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">My Gallery</h1>
            <p className="mt-2 text-zinc-400">Your personal photo collection.</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-2 font-semibold transition-all hover:bg-white/10 hover:border-white/20"
          >
            Log Out <LogOut className="h-4 w-4 text-red-400" />
          </button>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat, i) => (
            <div key={i} className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all hover:bg-white/10">
              <div className="flex items-center justify-between mb-4">
                <stat.Icon className={`h-8 w-8 ${stat.color}`} />
                <span className={`h-2 w-2 rounded-full ${stat.dot} shadow-[0_0_8px_rgba(255,255,255,0.4)]`} />
              </div>
              <h3 className="text-sm font-medium text-zinc-500">{stat.title}</h3>
              <p className="mt-2 text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Photo Gallery Section */}
        <PhotoGallery onGalleryChange={handleGalleryChange} />
      </div>
    </div>
  );
}

