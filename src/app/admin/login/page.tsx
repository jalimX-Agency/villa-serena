"use client";
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
    <div className="min-h-screen flex items-center justify-center bg-villa-cream px-6">
      <div className="w-full max-w-sm bg-card border border-border shadow-sm p-8">
        <div className="text-center mb-8">
          <Image
            src="/logo-gold.png"
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
              className="w-full mt-1 px-3 py-2.5 border border-input bg-background font-sans text-sm focus:outline-none focus:ring-1 focus:ring-ring"
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
              className="w-full mt-1 px-3 py-2.5 border border-input bg-background font-sans text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          {error && <p className="font-sans text-xs text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-villa-terracotta text-white font-sans text-xs tracking-[0.15em] uppercase hover:bg-villa-terracotta/90 transition-colors disabled:opacity-60"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
