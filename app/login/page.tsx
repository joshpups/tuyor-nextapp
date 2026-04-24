"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden text-white selection:bg-indigo-500/30">
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

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
        <div className="mb-10 text-center">
          <Link href="/" className="mb-6 inline-block text-sm font-semibold text-indigo-400 hover:text-indigo-300">
            &larr; Back to Home
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">Sign In</h1>
          <p className="mt-2 text-zinc-400">Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-2 w-full rounded-xl border ${errors.email ? 'border-red-500' : 'border-white/10'} bg-white/5 p-4 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none transition-all`}
              placeholder="name@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-2 w-full rounded-xl border ${errors.password ? 'border-red-500' : 'border-white/10'} bg-white/5 p-4 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none transition-all`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 py-4 font-semibold text-white transition-all hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            Log In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
