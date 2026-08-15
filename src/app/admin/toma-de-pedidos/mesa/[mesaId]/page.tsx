import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TomaPedido from "@/components/TomaPedido";
import type {
  CategoriaMenu,
  GrupoModificador,
  Mesa,
  OpcionModificador,
  Pedido,
  PedidoItemModificador,
  Producto,
  Salon,
} from "@/types/db";

export const dynamic = "force-dynamic";

export default async function MesaPage({
  params,
}: {
  params: Promise<{ mesaId: string }>;
}) {
  const { mesaId } = await params;
  const supabase = await createClient();

  const { data: mesa } = await supabase
    .from("mesas")
    .select("*")
    .eq("id", mesaId)
    .single();

  if (!mesa) redirect("/admin/toma-de-pedidos");

  const { data: salon } = await supabase
    .from("salones")
    .select("*")
    .eq("id", mesa.salon_id)
    .single();

  let { data: pedido } = await supabase
    .from("pedidos")
    .select("*")
    .eq("mesa_id", mesaId)
    .eq("estado", "abierto")
    .maybeSingle();

  if (!pedido) {
    const { data: nuevoPedido } = await supabase
      .from("pedidos")
      .insert({ mesa_id: mesaId, estado: "abierto" })
      .select("*")
      .single();
    pedido = nuevoPedido;
  }

  const [
    { data: categorias },
    { data: productos },
    { data: grupos },
    { data: opciones },
    { data: puente },
    { data: items },
    { data: itemMods },
  ] = await Promise.all([
    supabase.from("categorias_menu").select("*").order("orden"),
    supabase
      .from("productos")
      .select("*")
      .eq("disponible", true)
      .order("orden"),
    supabase.from("grupos_modificadores").select("*"),
    supabase.from("opciones_modificador").select("*").order("orden"),
    supabase.from("producto_grupos_modificadores").select("*"),
    supabase
      .from("pedido_items")
      .select("*")
      .eq("pedido_id", pedido!.id)
      .order("created_at"),
    supabase.from("pedido_item_modificadores").select("*"),
  ]);

  return (
    <TomaPedido
      mesa={mesa as Mesa}
      salon={salon as Salon}
      pedidoInicial={pedido as Pedido}
      categorias={(categorias ?? []) as CategoriaMenu[]}
      productos={(productos ?? []) as Producto[]}
      grupos={(grupos ?? []) as GrupoModificador[]}
      opciones={(opciones ?? []) as OpcionModificador[]}
      puente={
        (puente ?? []) as { producto_id: string; grupo_id: string }[]
      }
      itemsIniciales={items ?? []}
      itemModsIniciales={(itemMods ?? []) as PedidoItemModificador[]}
    />
  );
}
