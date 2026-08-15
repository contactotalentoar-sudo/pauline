import { createClient } from "@/lib/supabase/server";
import MesasGrid from "@/components/MesasGrid";
import type { Mesa, Pedido, Salon } from "@/types/db";

export const dynamic = "force-dynamic";

export default async function TomaDePedidosPage() {
  const supabase = await createClient();

  const [{ data: salones }, { data: mesas }, { data: pedidosAbiertos }] =
    await Promise.all([
      supabase.from("salones").select("*").order("nombre"),
      supabase.from("mesas").select("*").order("nombre"),
      supabase.from("pedidos").select("*").eq("estado", "abierto"),
    ]);

  return (
    <MesasGrid
      salones={(salones ?? []) as Salon[]}
      mesas={(mesas ?? []) as Mesa[]}
      pedidosAbiertos={(pedidosAbiertos ?? []) as Pedido[]}
    />
  );
}
