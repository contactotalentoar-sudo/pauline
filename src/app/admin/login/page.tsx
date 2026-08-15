"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError("Email o contraseña incorrectos.");
      return;
    }
    router.push("/admin/toma-de-pedidos");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5ded1] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-8 space-y-5"
      >
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-serif text-[#3a241c]">Pauline</h1>
          <p className="text-sm text-[#8a6a58]">Toma de Pedidos · Admin</p>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-[#3a241c]">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#e2c9b8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c98f6d]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-[#3a241c]">Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[#e2c9b8] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c98f6d]"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#3a241c] text-white rounded-lg py-2 font-medium disabled:opacity-60"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
