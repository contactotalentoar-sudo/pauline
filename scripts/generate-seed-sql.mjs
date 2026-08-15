// Genera supabase/seed/seed.sql a partir de los mismos datos de scripts/seed.mjs,
// pero como INSERTs planos (sin conectarse a Supabase) para pegar en el SQL Editor.

import { randomUUID } from "node:crypto";
import { writeFileSync } from "node:fs";
import { GRUPOS, CATEGORIAS, SALONES } from "./seed-data.mjs";

function sqlStr(v) {
  if (v === null || v === undefined) return "NULL";
  return `'${String(v).replace(/'/g, "''")}'`;
}

const lines = [];
lines.push("-- Seed generado automáticamente. Pegar en el SQL Editor de Supabase.");
lines.push("begin;");

// ---------- Grupos + opciones ----------
const grupoIds = {};
for (const [clave, g] of Object.entries(GRUPOS)) {
  const grupoId = randomUUID();
  grupoIds[clave] = grupoId;
  lines.push(
    `insert into grupos_modificadores (id, nombre, obligatorio, seleccion_multiple, max_selecciones) values (${sqlStr(
      grupoId
    )}, ${sqlStr(g.nombre)}, ${g.obligatorio}, ${g.seleccion_multiple}, ${
      g.max_selecciones ?? "NULL"
    });`
  );
  g.opciones.forEach((nombre, i) => {
    lines.push(
      `insert into opciones_modificador (id, grupo_id, nombre, precio_adicional, orden) values (${sqlStr(
        randomUUID()
      )}, ${sqlStr(grupoId)}, ${sqlStr(nombre)}, 0, ${i});`
    );
  });
}

// ---------- Categorías + productos ----------
let ordenCat = 0;
for (const cat of CATEGORIAS) {
  const catId = randomUUID();
  lines.push(
    `insert into categorias_menu (id, nombre, orden) values (${sqlStr(
      catId
    )}, ${sqlStr(cat.nombre)}, ${ordenCat++});`
  );

  let ordenProd = 0;
  for (const p of cat.productos) {
    const prodId = randomUUID();
    lines.push(
      `insert into productos (id, categoria_id, nombre, descripcion, precio, orden) values (${sqlStr(
        prodId
      )}, ${sqlStr(catId)}, ${sqlStr(p.nombre)}, ${sqlStr(
        p.descripcion ?? null
      )}, ${p.precio}, ${ordenProd++});`
    );
    for (const clave of p.grupos ?? []) {
      lines.push(
        `insert into producto_grupos_modificadores (producto_id, grupo_id) values (${sqlStr(
          prodId
        )}, ${sqlStr(grupoIds[clave])});`
      );
    }
  }
}

// ---------- Salones + mesas ----------
for (const salon of SALONES) {
  const salonId = randomUUID();
  lines.push(
    `insert into salones (id, nombre) values (${sqlStr(salonId)}, ${sqlStr(
      salon.nombre
    )});`
  );
  for (const m of salon.mesas) {
    lines.push(
      `insert into mesas (id, salon_id, nombre, forma, posicion_x, posicion_y) values (${sqlStr(
        randomUUID()
      )}, ${sqlStr(salonId)}, ${sqlStr(m.nombre)}, ${sqlStr(m.forma)}, ${m.x}, ${m.y});`
    );
  }
}

lines.push("commit;");

writeFileSync("supabase/seed/seed.sql", lines.join("\n") + "\n");
console.log(`✅ Generado supabase/seed/seed.sql (${lines.length} statements)`);
