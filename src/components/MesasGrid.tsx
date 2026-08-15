"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Mesa, Pedido, Salon } from "@/types/db";

function formaClass(forma: Mesa["forma"]) {
  if (forma === "circulo") return "rounded-full aspect-square";
  if (forma === "rectangulo") return "rounded-xl aspect-[3/5]";
  return "rounded-xl aspect-square";
}

function money(n: number) {
  return n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

export default function MesasGrid({
  salones,
  mesas,
  pedidosAbiertos,
}: {
  salones: Salon[];
  mesas: Mesa[];
  pedidosAbiertos: Pedido[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loadingMesa, setLoadingMesa] = useState<string | null>(null);

  const pedidoPorMesa = new Map(pedidosAbiertos.map((p) => [p.mesa_id, p]));

  async function abrirMesa(mesa: Mesa) {
    setLoadingMesa(mesa.id);
    const existente = pedidoPorMesa.get(mesa.id);
    if (existente) {
      router.push(`/admin/toma-de-pedidos/mesa/${mesa.id}`);
      return;
    }
    const { error } = await supabase
      .from("pedidos")
      .insert({ mesa_id: mesa.id, estado: "abierto" });
    if (error) {
      // si otro admin ya abrió esta mesa justo ahora, igual navegamos
      console.error(error);
    }
    router.push(`/admin/toma-de-pedidos/mesa/${mesa.id}`);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f5ded1] pb-16">
      <header className="flex items-center justify-between px-5 py-4 bg-[#3a241c] text-white sticky top-0 z-10">
        <h1 className="text-xl font-serif">Mis mesas</h1>
        <button onClick={logout} className="text-sm underline opacity-80">
          Salir
        </button>
      </header>

      <div className="px-4 py-5 space-y-8 max-w-3xl mx-auto">
        {salones.map((salon) => (
          <section key={salon.id}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8a6a58] mb-3">
              {salon.nombre}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {mesas
                .filter((m) => m.salon_id === salon.id)
                .map((mesa) => {
                  const pedido = pedidoPorMesa.get(mesa.id);
                  const ocupada = !!pedido;
                  return (
                    <button
                      key={mesa.id}
                      onClick={() => abrirMesa(mesa)}
                      disabled={loadingMesa === mesa.id}
                      className={`${formaClass(mesa.forma)} flex flex-col items-center justify-center gap-1 shadow-md transition active:scale-95 disabled:opacity-60 ${
                        ocupada
                          ? "bg-[#d9694f] text-white"
                          : "bg-[#8fd3a8] text-[#1f3d2b]"
                      }`}
                    >
                      <span className="font-bold text-lg">{mesa.nombre}</span>
                      {ocupada ? (
                        <span className="text-xs font-medium">
                          {money(pedido!.total)}
                        </span>
                      ) : (
                        <span className="text-xs opacity-80">Libre</span>
                      )}
                    </button>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
