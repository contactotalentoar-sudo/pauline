"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type {
  CategoriaMenu,
  GrupoModificador,
  Mesa,
  OpcionModificador,
  Pedido,
  PedidoItem,
  PedidoItemModificador,
  Producto,
  Salon,
} from "@/types/db";

function money(n: number) {
  return n.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

type ItemLocal = PedidoItem & {
  modificadores: { opcion: OpcionModificador; grupoNombre: string }[];
};

type Props = {
  mesa: Mesa;
  salon: Salon;
  pedidoInicial: Pedido;
  categorias: CategoriaMenu[];
  productos: Producto[];
  grupos: GrupoModificador[];
  opciones: OpcionModificador[];
  puente: { producto_id: string; grupo_id: string }[];
  itemsIniciales: PedidoItem[];
  itemModsIniciales: PedidoItemModificador[];
};

export default function TomaPedido({
  mesa,
  salon,
  pedidoInicial,
  categorias,
  productos,
  grupos,
  opciones,
  puente,
  itemsIniciales,
  itemModsIniciales,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [vista, setVista] = useState<"menu" | "pedido">("menu");
  const [categoriaActiva, setCategoriaActiva] = useState(
    categorias[0]?.id ?? ""
  );
  const [productoModal, setProductoModal] = useState<Producto | null>(null);
  const [seleccion, setSeleccion] = useState<Record<string, string[]>>({});
  const [cantidadModal, setCantidadModal] = useState(1);
  const [notaModal, setNotaModal] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState<string | null>(null);

  const gruposPorProducto = useMemo(() => {
    const map = new Map<string, GrupoModificador[]>();
    for (const p of puente) {
      const grupo = grupos.find((g) => g.id === p.grupo_id);
      if (!grupo) continue;
      const arr = map.get(p.producto_id) ?? [];
      arr.push(grupo);
      map.set(p.producto_id, arr);
    }
    return map;
  }, [puente, grupos]);

  const opcionesPorGrupo = useMemo(() => {
    const map = new Map<string, OpcionModificador[]>();
    for (const o of opciones) {
      const arr = map.get(o.grupo_id) ?? [];
      arr.push(o);
      map.set(o.grupo_id, arr);
    }
    return map;
  }, [opciones]);

  const [items, setItems] = useState<ItemLocal[]>(() =>
    itemsIniciales.map((it) => ({
      ...it,
      modificadores: itemModsIniciales
        .filter((m) => m.pedido_item_id === it.id)
        .map((m) => {
          const opcion = opciones.find((o) => o.id === m.opcion_modificador_id)!;
          const grupo = grupos.find((g) => g.id === opcion?.grupo_id);
          return { opcion, grupoNombre: grupo?.nombre ?? "" };
        }),
    }))
  );

  const total = items.reduce((acc, it) => {
    const modsTotal = it.modificadores.reduce(
      (s, m) => s + Number(m.opcion.precio_adicional),
      0
    );
    return acc + it.cantidad * (Number(it.precio_unitario) + modsTotal);
  }, 0);

  function abrirProducto(producto: Producto) {
    setProductoModal(producto);
    setSeleccion({});
    setCantidadModal(1);
    setNotaModal("");
    setErrorModal(null);
  }

  function toggleOpcion(grupo: GrupoModificador, opcionId: string) {
    setSeleccion((prev) => {
      const actuales = prev[grupo.id] ?? [];
      if (grupo.seleccion_multiple) {
        const yaEsta = actuales.includes(opcionId);
        let nuevos = yaEsta
          ? actuales.filter((id) => id !== opcionId)
          : [...actuales, opcionId];
        if (grupo.max_selecciones && nuevos.length > grupo.max_selecciones) {
          nuevos = nuevos.slice(0, grupo.max_selecciones);
        }
        return { ...prev, [grupo.id]: nuevos };
      }
      return { ...prev, [grupo.id]: [opcionId] };
    });
  }

  async function confirmarAgregar() {
    if (!productoModal) return;
    const gruposDelProducto = gruposPorProducto.get(productoModal.id) ?? [];

    for (const g of gruposDelProducto) {
      const elegidos = seleccion[g.id] ?? [];
      if (g.obligatorio && elegidos.length === 0) {
        setErrorModal(`Elegí una opción en "${g.nombre}".`);
        return;
      }
      if (
        g.seleccion_multiple &&
        g.max_selecciones &&
        elegidos.length > 0 &&
        elegidos.length !== g.max_selecciones &&
        g.obligatorio
      ) {
        setErrorModal(
          `"${g.nombre}" necesita ${g.max_selecciones} selecciones.`
        );
        return;
      }
    }

    setGuardando(true);
    const { data: nuevoItem, error } = await supabase
      .from("pedido_items")
      .insert({
        pedido_id: pedidoInicial.id,
        producto_id: productoModal.id,
        cantidad: cantidadModal,
        precio_unitario: productoModal.precio,
        nota: notaModal || null,
      })
      .select("*")
      .single();

    if (error || !nuevoItem) {
      setErrorModal("No se pudo agregar el producto. Probá de nuevo.");
      setGuardando(false);
      return;
    }

    const opcionIds = Object.values(seleccion).flat();
    let modsGuardados: { opcion: OpcionModificador; grupoNombre: string }[] =
      [];

    if (opcionIds.length > 0) {
      const { data: modsInsertados } = await supabase
        .from("pedido_item_modificadores")
        .insert(
          opcionIds.map((opcion_modificador_id) => ({
            pedido_item_id: nuevoItem.id,
            opcion_modificador_id,
          }))
        )
        .select("*");

      modsGuardados = (modsInsertados ?? []).map((m) => {
        const opcion = opciones.find((o) => o.id === m.opcion_modificador_id)!;
        const grupo = grupos.find((g) => g.id === opcion?.grupo_id);
        return { opcion, grupoNombre: grupo?.nombre ?? "" };
      });
    }

    setItems((prev) => [
      ...prev,
      { ...nuevoItem, modificadores: modsGuardados },
    ]);
    setGuardando(false);
    setProductoModal(null);
  }

  async function quitarItem(itemId: string) {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    await supabase.from("pedido_items").delete().eq("id", itemId);
  }

  async function cerrarMesa() {
    if (items.length === 0) {
      if (!confirm("La mesa no tiene productos. ¿Cerrar de todas formas?"))
        return;
    } else if (!confirm(`Cerrar ${mesa.nombre} con un total de ${money(total)}?`)) {
      return;
    }
    await supabase
      .from("pedidos")
      .update({ estado: "cerrado", closed_at: new Date().toISOString() })
      .eq("id", pedidoInicial.id);
    router.push("/admin/toma-de-pedidos");
    router.refresh();
  }

  const productosCategoria = productos.filter(
    (p) => p.categoria_id === categoriaActiva
  );

  return (
    <div className="min-h-screen bg-[#f5ded1] pb-28">
      <header className="bg-[#3a241c] text-white px-5 py-4 sticky top-0 z-10 space-y-1">
        <button
          onClick={() => router.push("/admin/toma-de-pedidos")}
          className="text-xs underline opacity-80"
        >
          ← Volver al salón
        </button>
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-serif">{mesa.nombre}</h1>
          <span className="text-sm opacity-80">{salon?.nombre}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span
            className={
              items.length > 0
                ? "text-[#f2b090] font-medium"
                : "opacity-70"
            }
          >
            {items.length > 0 ? "Pedido abierto" : "Mesa libre"}
          </span>
          <span className="font-semibold">{money(total)}</span>
        </div>
      </header>

      <div className="flex px-4 pt-3 gap-2">
        <button
          onClick={() => setVista("menu")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium ${
            vista === "menu"
              ? "bg-[#3a241c] text-white"
              : "bg-white text-[#3a241c]"
          }`}
        >
          Menú
        </button>
        <button
          onClick={() => setVista("pedido")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium ${
            vista === "pedido"
              ? "bg-[#3a241c] text-white"
              : "bg-white text-[#3a241c]"
          }`}
        >
          Ver pedido ({items.length})
        </button>
      </div>

      {vista === "menu" && (
        <div>
          <div className="flex gap-2 overflow-x-auto px-4 py-3">
            {categorias.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoriaActiva(c.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm border ${
                  categoriaActiva === c.id
                    ? "bg-[#c98f6d] text-white border-[#c98f6d]"
                    : "bg-white text-[#3a241c] border-[#e2c9b8]"
                }`}
              >
                {c.nombre}
              </button>
            ))}
          </div>

          <div className="px-4 space-y-2">
            {productosCategoria.map((p) => (
              <button
                key={p.id}
                onClick={() => abrirProducto(p)}
                className="w-full bg-white rounded-xl p-3 flex items-center justify-between text-left shadow-sm active:scale-[0.99]"
              >
                <div>
                  <p className="font-medium text-[#3a241c]">{p.nombre}</p>
                  {p.descripcion && (
                    <p className="text-xs text-[#8a6a58] mt-0.5">
                      {p.descripcion}
                    </p>
                  )}
                </div>
                <span className="font-semibold text-[#3a241c] whitespace-nowrap ml-3">
                  {money(p.precio)}
                </span>
              </button>
            ))}
            {productosCategoria.length === 0 && (
              <p className="text-sm text-[#8a6a58] text-center py-8">
                Sin productos en esta categoría.
              </p>
            )}
          </div>
        </div>
      )}

      {vista === "pedido" && (
        <div className="px-4 py-3 space-y-2">
          {items.length === 0 && (
            <p className="text-sm text-[#8a6a58] text-center py-8">
              Todavía no agregaste productos.
            </p>
          )}
          {items.map((it) => {
            const producto = productos.find((p) => p.id === it.producto_id);
            const modsTotal = it.modificadores.reduce(
              (s, m) => s + Number(m.opcion.precio_adicional),
              0
            );
            const subtotal =
              it.cantidad * (Number(it.precio_unitario) + modsTotal);
            return (
              <div
                key={it.id}
                className="bg-white rounded-xl p-3 shadow-sm space-y-1"
              >
                <div className="flex items-start justify-between">
                  <p className="font-medium text-[#3a241c]">
                    {it.cantidad}× {producto?.nombre}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#3a241c]">
                      {money(subtotal)}
                    </span>
                    <button
                      onClick={() => quitarItem(it.id)}
                      className="text-red-500 text-xs underline"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
                {it.modificadores.length > 0 && (
                  <ul className="text-xs text-[#8a6a58] pl-3 list-disc">
                    {it.modificadores.map((m, i) => (
                      <li key={i}>
                        {m.grupoNombre}: {m.opcion.nombre}
                        {Number(m.opcion.precio_adicional) > 0
                          ? ` (+${money(m.opcion.precio_adicional)})`
                          : ""}
                      </li>
                    ))}
                  </ul>
                )}
                {it.nota && (
                  <p className="text-xs italic text-[#8a6a58]">
                    Nota: {it.nota}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-[#e2c9b8] px-4 py-3 flex gap-2 max-w-3xl mx-auto">
        <button
          onClick={() => setVista("menu")}
          className="flex-1 bg-[#8fd3a8] text-[#1f3d2b] rounded-lg py-2.5 font-medium text-sm"
        >
          + Agregar producto
        </button>
        <button
          onClick={cerrarMesa}
          className="flex-1 bg-[#d9694f] text-white rounded-lg py-2.5 font-medium text-sm"
        >
          Cerrar mesa
        </button>
      </div>

      {productoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-20 p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-[#3a241c]">
                  {productoModal.nombre}
                </h2>
                <p className="text-sm text-[#8a6a58]">
                  {money(productoModal.precio)}
                </p>
              </div>

              {(gruposPorProducto.get(productoModal.id) ?? []).map((g) => (
                <div key={g.id} className="space-y-2">
                  <p className="text-sm font-medium text-[#3a241c]">
                    {g.nombre}
                    {g.obligatorio && (
                      <span className="text-red-500"> *</span>
                    )}
                    {g.seleccion_multiple && g.max_selecciones && (
                      <span className="text-xs text-[#8a6a58]">
                        {" "}
                        (elegí {g.max_selecciones})
                      </span>
                    )}
                  </p>
                  <div className="space-y-1">
                    {(opcionesPorGrupo.get(g.id) ?? []).map((op) => {
                      const marcado = (seleccion[g.id] ?? []).includes(op.id);
                      return (
                        <label
                          key={op.id}
                          className="flex items-center justify-between gap-2 text-sm py-1 border-b border-[#f0e2d6] last:border-0"
                        >
                          <span className="flex items-center gap-2">
                            <input
                              type={g.seleccion_multiple ? "checkbox" : "radio"}
                              name={g.id}
                              checked={marcado}
                              onChange={() => toggleOpcion(g, op.id)}
                            />
                            {op.nombre}
                          </span>
                          {Number(op.precio_adicional) > 0 && (
                            <span className="text-[#8a6a58]">
                              +{money(op.precio_adicional)}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#3a241c]">
                  Cantidad
                </span>
                <button
                  onClick={() => setCantidadModal((c) => Math.max(1, c - 1))}
                  className="w-8 h-8 rounded-full bg-[#f0e2d6] text-[#3a241c]"
                >
                  −
                </button>
                <span className="w-6 text-center">{cantidadModal}</span>
                <button
                  onClick={() => setCantidadModal((c) => c + 1)}
                  className="w-8 h-8 rounded-full bg-[#f0e2d6] text-[#3a241c]"
                >
                  +
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#3a241c]">
                  Nota (opcional)
                </label>
                <textarea
                  value={notaModal}
                  onChange={(e) => setNotaModal(e.target.value)}
                  rows={2}
                  className="w-full border border-[#e2c9b8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c98f6d]"
                  placeholder="Ej: sin azúcar, para compartir..."
                />
              </div>

              {errorModal && (
                <p className="text-sm text-red-600">{errorModal}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setProductoModal(null)}
                  className="flex-1 bg-[#f0e2d6] text-[#3a241c] rounded-lg py-2.5 font-medium text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarAgregar}
                  disabled={guardando}
                  className="flex-1 bg-[#3a241c] text-white rounded-lg py-2.5 font-medium text-sm disabled:opacity-60"
                >
                  {guardando ? "Agregando..." : "Agregar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
