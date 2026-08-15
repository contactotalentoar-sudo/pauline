"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { CategoriaMenu, Producto } from "@/types/db";

function money(n: number) {
  return n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

export default function MenuAdmin({
  categoriasIniciales,
  productosIniciales,
}: {
  categoriasIniciales: CategoriaMenu[];
  productosIniciales: Producto[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [productos, setProductos] = useState(productosIniciales);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    if (!editando) return;
    setGuardando(true);
    const { error } = await supabase
      .from("productos")
      .update({
        nombre: editando.nombre,
        descripcion: editando.descripcion,
        precio: editando.precio,
        disponible: editando.disponible,
      })
      .eq("id", editando.id);
    setGuardando(false);
    if (!error) {
      setProductos((prev) =>
        prev.map((p) => (p.id === editando.id ? editando : p))
      );
      setEditando(null);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f5ded1] pb-16">
      <header className="flex items-center justify-between px-5 py-4 bg-[#3a241c] text-white sticky top-0 z-10">
        <h1 className="text-xl font-serif">Menú</h1>
        <div className="flex items-center gap-4 text-sm">
          <a href="/admin/toma-de-pedidos" className="underline opacity-80">
            Toma de pedidos
          </a>
          <button onClick={logout} className="underline opacity-80">
            Salir
          </button>
        </div>
      </header>

      <div className="px-4 py-5 space-y-8 max-w-2xl mx-auto">
        {categoriasIniciales.map((cat) => (
          <section key={cat.id}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#8a6a58] mb-2">
              {cat.nombre}
            </h2>
            <div className="space-y-2">
              {productos
                .filter((p) => p.categoria_id === cat.id)
                .map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm"
                  >
                    <div>
                      <p
                        className={`font-medium ${
                          p.disponible ? "text-[#3a241c]" : "text-gray-400 line-through"
                        }`}
                      >
                        {p.nombre}
                      </p>
                      <p className="text-xs text-[#8a6a58]">
                        {money(p.precio)}
                        {!p.disponible && " · No disponible"}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditando(p)}
                      className="text-[#c98f6d] text-lg"
                      aria-label="Editar"
                    >
                      ✏️
                    </button>
                  </div>
                ))}
            </div>
          </section>
        ))}
      </div>

      {editando && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-20">
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-5 space-y-4">
            <h2 className="text-lg font-semibold text-[#3a241c]">
              Editar producto
            </h2>

            <div className="space-y-1">
              <label className="text-sm text-[#3a241c]">Nombre</label>
              <input
                value={editando.nombre}
                onChange={(e) =>
                  setEditando({ ...editando, nombre: e.target.value })
                }
                className="w-full border border-[#e2c9b8] rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#3a241c]">Descripción</label>
              <textarea
                value={editando.descripcion ?? ""}
                onChange={(e) =>
                  setEditando({ ...editando, descripcion: e.target.value })
                }
                rows={2}
                className="w-full border border-[#e2c9b8] rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#3a241c]">Precio</label>
              <input
                type="number"
                value={editando.precio}
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    precio: Number(e.target.value),
                  })
                }
                className="w-full border border-[#e2c9b8] rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-[#3a241c]">
              <input
                type="checkbox"
                checked={editando.disponible}
                onChange={(e) =>
                  setEditando({ ...editando, disponible: e.target.checked })
                }
              />
              Disponible
            </label>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setEditando(null)}
                className="flex-1 bg-[#f0e2d6] text-[#3a241c] rounded-lg py-2.5 font-medium text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                disabled={guardando}
                className="flex-1 bg-[#3a241c] text-white rounded-lg py-2.5 font-medium text-sm disabled:opacity-60"
              >
                {guardando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
