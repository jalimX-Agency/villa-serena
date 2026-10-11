"use client";
import { media } from "@/lib/media";
import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-stone-50">
      <div className="relative hidden lg:block">
        <Image src={media("/hero-main.jpg")} alt="" fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 to-transparent" />
        <p className="absolute bottom-10 left-10 font-serif text-3xl text-white">Villa Serena Marrakech</p>
      </div>
      <div className="flex items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white ring-1 ring-stone-200 shadow-sm p-8">
        <div className="text-center mb-8">
          <Image
            src={media("/logo-gold.png")}
            alt="Villa Serena Marrakech"
            width={346}
            height={337}
            className="h-24 w-auto mx-auto"
          />
          <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-muted-foreground mt-2">
            Administration
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="font-sans text-xs tracking-wider uppercase text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 rounded-lg px-3 py-2.5 ring-1 ring-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-villa-terracotta/60"
            />
          </div>
          <div>
            <label className="font-sans text-xs tracking-wider uppercase text-muted-foreground">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 rounded-lg px-3 py-2.5 ring-1 ring-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-villa-terracotta/60"
            />
          </div>
          {error && <p className="font-sans text-xs text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-3 bg-villa-terracotta text-white text-sm font-medium hover:brightness-95 transition-colors disabled:opacity-60"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}
