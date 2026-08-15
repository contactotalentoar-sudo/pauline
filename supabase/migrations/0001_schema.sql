-- Pauline · Toma de Pedidos (POS interno)
-- Schema completo

create extension if not exists "pgcrypto";

-- =========================
-- MENÚ
-- =========================

create table categorias_menu (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  orden int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table productos (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references categorias_menu(id) on delete cascade,
  nombre text not null,
  descripcion text,
  precio numeric(12,2) not null default 0,
  disponible boolean not null default true,
  orden int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table grupos_modificadores (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  obligatorio boolean not null default false,
  seleccion_multiple boolean not null default false,
  max_selecciones int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table opciones_modificador (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid not null references grupos_modificadores(id) on delete cascade,
  nombre text not null,
  precio_adicional numeric(12,2) not null default 0,
  orden int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table producto_grupos_modificadores (
  producto_id uuid not null references productos(id) on delete cascade,
  grupo_id uuid not null references grupos_modificadores(id) on delete cascade,
  primary key (producto_id, grupo_id)
);

-- =========================
-- SALONES Y MESAS
-- =========================

create table salones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table mesas (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references salones(id) on delete cascade,
  nombre text not null,
  forma text not null default 'cuadrado', -- cuadrado | rectangulo | circulo
  posicion_x numeric not null default 0,
  posicion_y numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================
-- PEDIDOS
-- =========================

create table pedidos (
  id uuid primary key default gen_random_uuid(),
  mesa_id uuid not null references mesas(id) on delete restrict,
  estado text not null default 'abierto', -- abierto | cerrado
  total numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

-- Solo puede haber UN pedido "abierto" por mesa a la vez
create unique index one_open_pedido_per_mesa
  on pedidos (mesa_id)
  where estado = 'abierto';

create table pedido_items (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos(id) on delete cascade,
  producto_id uuid not null references productos(id) on delete restrict,
  cantidad int not null default 1,
  precio_unitario numeric(12,2) not null default 0,
  nota text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table pedido_item_modificadores (
  id uuid primary key default gen_random_uuid(),
  pedido_item_id uuid not null references pedido_items(id) on delete cascade,
  opcion_modificador_id uuid not null references opciones_modificador(id) on delete restrict
);

-- =========================
-- TOTALES AUTOMÁTICOS
-- =========================

create or replace function recalcular_total_pedido(p_pedido_id uuid)
returns void as $$
begin
  update pedidos
  set total = coalesce((
    select sum(
      pi.cantidad * (
        pi.precio_unitario + coalesce((
          select sum(om.precio_adicional)
          from pedido_item_modificadores pim
          join opciones_modificador om on om.id = pim.opcion_modificador_id
          where pim.pedido_item_id = pi.id
        ), 0)
      )
    )
    from pedido_items pi
    where pi.pedido_id = p_pedido_id
  ), 0)
  where id = p_pedido_id;
end;
$$ language plpgsql;

create or replace function trg_recalcular_total_item()
returns trigger as $$
declare
  v_pedido_id uuid;
begin
  v_pedido_id := coalesce(new.pedido_id, old.pedido_id);
  perform recalcular_total_pedido(v_pedido_id);
  return null;
end;
$$ language plpgsql;

create trigger recalc_on_item_change
after insert or update or delete on pedido_items
for each row execute function trg_recalcular_total_item();

create or replace function trg_recalcular_total_modificador()
returns trigger as $$
declare
  v_pedido_id uuid;
  v_item_id uuid;
begin
  v_item_id := coalesce(new.pedido_item_id, old.pedido_item_id);
  select pedido_id into v_pedido_id from pedido_items where id = v_item_id;
  if v_pedido_id is not null then
    perform recalcular_total_pedido(v_pedido_id);
  end if;
  return null;
end;
$$ language plpgsql;

create trigger recalc_on_modificador_change
after insert or update or delete on pedido_item_modificadores
for each row execute function trg_recalcular_total_modificador();

-- =========================
-- RLS: acceso solo a usuarios autenticados (admin)
-- =========================

alter table categorias_menu enable row level security;
alter table productos enable row level security;
alter table grupos_modificadores enable row level security;
alter table opciones_modificador enable row level security;
alter table producto_grupos_modificadores enable row level security;
alter table salones enable row level security;
alter table mesas enable row level security;
alter table pedidos enable row level security;
alter table pedido_items enable row level security;
alter table pedido_item_modificadores enable row level security;

create policy "auth_full_access" on categorias_menu for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_full_access" on productos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_full_access" on grupos_modificadores for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_full_access" on opciones_modificador for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_full_access" on producto_grupos_modificadores for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_full_access" on salones for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_full_access" on mesas for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_full_access" on pedidos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_full_access" on pedido_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_full_access" on pedido_item_modificadores for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
