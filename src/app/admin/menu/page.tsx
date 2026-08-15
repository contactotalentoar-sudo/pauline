import { createClient } from "@/lib/supabase/server";
import MenuAdmin from "@/components/MenuAdmin";
import type { CategoriaMenu, Producto } from "@/types/db";

export const dynamic = "force-dynamic";

export default async function MenuAdminPage() {
  const supabase = await createClient();

  const [{ data: categorias }, { data: productos }] = await Promise.all([
    supabase.from("categorias_menu").select("*").order("orden"),
    supabase.from("productos").select("*").order("orden"),
  ]);

  return (
    <MenuAdmin
      categoriasIniciales={(categorias ?? []) as CategoriaMenu[]}
      productosIniciales={(productos ?? []) as Producto[]}
    />
  );
}
