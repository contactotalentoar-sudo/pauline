# Pauline · App de Toma de Pedidos

Sistema interno tipo POS (estilo MaxiRest) para tomar pedidos de mesa desde el celular o la compu. 100% interno, uso exclusivo del admin.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind
- Supabase (Postgres + Auth)

## Setup local

1. `npm install`
2. Copiá `.env.local.example` a `.env.local` y completá con las credenciales de tu proyecto de Supabase (Project Settings → API):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (solo se usa localmente para el seed, nunca se sube a Vercel como pública)
3. Corré las migraciones: pegá el contenido de `supabase/migrations/0001_schema.sql` en el SQL Editor de Supabase (o usá la CLI de Supabase) y ejecutalo.
4. Creá el usuario admin: en Supabase → Authentication → Users → "Add user", con el email/contraseña que vas a usar para loguearte.
5. Cargá el menú y las mesas: `npm run seed`
6. `npm run dev` y entrá a `http://localhost:3000/admin/login`

## Deploy en Vercel

1. Importá el repo de GitHub en Vercel.
2. Agregá las variables de entorno `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en Vercel → Project Settings → Environment Variables (NO subas la `SERVICE_ROLE_KEY` a Vercel).
3. Deploy. La app queda en `/admin/toma-de-pedidos` (la home redirige ahí).

## Rutas

- `/admin/login` — login del admin
- `/admin/toma-de-pedidos` — plano de mesas ("Mis mesas")
- `/admin/toma-de-pedidos/mesa/[mesaId]` — toma de pedido de una mesa (menú, modificadores, carrito, cerrar mesa)
- `/admin/menu` — edición de nombre/descripción/precio/disponibilidad de productos (ícono ✏️)

## Reseed / cambios de menú

El script `scripts/seed.mjs` es data-driven: todo el menú, los grupos de modificadores y el plano de mesas están definidos como objetos JS al principio del archivo. Para agregar o cambiar productos, es más simple editar ahí y volver a correr `npm run seed` en una base limpia, o usar `/admin/menu` para ediciones puntuales de productos ya cargados.
