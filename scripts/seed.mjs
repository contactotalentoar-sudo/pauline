// Seed completo de Pauline: menú, modificadores, salones y mesas.
// Uso: node scripts/seed.mjs   (requiere NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local)

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { GRUPOS, CATEGORIAS, SALONES } from "./seed-data.mjs";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY (.env.local)"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

async function run() {
  console.log("Insertando grupos de modificadores...");
  const grupoIds = {};
  for (const [clave, g] of Object.entries(GRUPOS)) {
    const { data: grupo, error } = await supabase
      .from("grupos_modificadores")
      .insert({
        nombre: g.nombre,
        obligatorio: g.obligatorio,
        seleccion_multiple: g.seleccion_multiple,
        max_selecciones: g.max_selecciones ?? null,
      })
      .select("id")
      .single();
    if (error) throw error;
    grupoIds[clave] = grupo.id;

    const opciones = g.opciones.map((nombre, i) => ({
      grupo_id: grupo.id,
      nombre,
      orden: i,
    }));
    const { error: errOp } = await supabase
      .from("opciones_modificador")
      .insert(opciones);
    if (errOp) throw errOp;
  }

  console.log("Insertando categorías y productos...");
  let ordenCat = 0;
  for (const cat of CATEGORIAS) {
    const { data: categoria, error } = await supabase
      .from("categorias_menu")
      .insert({ nombre: cat.nombre, orden: ordenCat++ })
      .select("id")
      .single();
    if (error) throw error;

    let ordenProd = 0;
    for (const p of cat.productos) {
      const { data: producto, error: errProd } = await supabase
        .from("productos")
        .insert({
          categoria_id: categoria.id,
          nombre: p.nombre,
          descripcion: p.descripcion ?? null,
          precio: p.precio,
          orden: ordenProd++,
        })
        .select("id")
        .single();
      if (errProd) throw errProd;

      if (p.grupos?.length) {
        const puente = p.grupos.map((clave) => ({
          producto_id: producto.id,
          grupo_id: grupoIds[clave],
        }));
        const { error: errPuente } = await supabase
          .from("producto_grupos_modificadores")
          .insert(puente);
        if (errPuente) throw errPuente;
      }
    }
  }

  console.log("Insertando salones y mesas...");
  for (const salon of SALONES) {
    const { data: s, error } = await supabase
      .from("salones")
      .insert({ nombre: salon.nombre })
      .select("id")
      .single();
    if (error) throw error;

    const mesas = salon.mesas.map((m) => ({
      salon_id: s.id,
      nombre: m.nombre,
      forma: m.forma,
      posicion_x: m.x,
      posicion_y: m.y,
    }));
    const { error: errMesas } = await supabase.from("mesas").insert(mesas);
    if (errMesas) throw errMesas;
  }

  console.log("✅ Seed completo.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
