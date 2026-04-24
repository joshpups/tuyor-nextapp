import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] text-white selection:bg-indigo-500/30">
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/profile-bg.jpg"
          alt="Personal Background"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
      </div>

      <main className="relative flex w-full max-w-5xl flex-col items-center gap-12 px-6 py-20 text-center">
        {/* Subtle Glows */}
        <div className="absolute -top-40 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
        
        <div className="flex flex-col items-center gap-4">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-indigo-300 backdrop-blur-md">
            <span className="mr-2 flex h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            Project Live: tuyor-nextapp
          </div>
          <h1 className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-6xl font-bold tracking-tight text-transparent sm:text-7xl">
            Next.js Mastery
          </h1>
          <p className="max-w-2xl text-lg text-zinc-300 drop-shadow-sm sm:text-xl">
            Initialized and ready for development. This project is now connected to Git and optimized for high-performance deployment.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Project Setup", desc: "Next.js 16 with App Router and Tailwind CSS 4.", icon: "🚀" },
            { title: "Git Workflow", desc: "Initialized repository with version control best practices.", icon: "🌿" },
            { title: "Modern Stack", desc: "React 19, TypeScript, and Geist Typography.", icon: "💎" },
          ].map((item, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-left transition-all hover:bg-white/[0.05] backdrop-blur-sm">
              <div className="mb-4 text-3xl">{item.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-zinc-500 group-hover:text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href="https://github.com/joshpups/tuyor-nextapp"
            className="flex h-12 items-center justify-center rounded-xl bg-white px-8 font-semibold text-black transition-transform hover:scale-105 active:scale-95"
          >
            Check Repository
          </a>
          <a
            href="https://nextjs.org/docs"
            className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 font-semibold transition-all hover:bg-white/10 backdrop-blur-md"
          >
            Documentation
          </a>
        </div>
      </main>

      <footer className="w-full border-t border-white/5 py-8 text-center text-sm text-zinc-600 backdrop-blur-md">
        &copy; {new Date().getFullYear()} tuyor-nextapp. Built with precision.
      </footer>
    </div>
  );
}
