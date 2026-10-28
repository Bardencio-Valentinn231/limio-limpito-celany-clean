-- Cleany Clean: almacenamiento centralizado de pedidos.
-- Ejecutá este archivo completo en el SQL Editor del proyecto Supabase.

create table if not exists public.orders (
  id text primary key,
  created_at timestamptz not null default now(),
  customer jsonb not null default '{}'::jsonb,
  forma_pago text not null default 'No especificado',
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12,2) not null default 0 check (subtotal >= 0),
  total numeric(12,2) not null default 0 check (total >= 0),
  currency text not null default 'ARS',
  status text not null default 'Recibido'
);

alter table public.orders enable row level security;
revoke all on table public.orders from anon, authenticated;
grant insert on table public.orders to anon, authenticated;
grant select, update, delete on table public.orders to authenticated;

drop policy if exists "Visitors can create orders" on public.orders;
create policy "Visitors can create orders"
  on public.orders for insert to anon, authenticated
  with check (
    length(id) between 1 and 80
    and jsonb_typeof(customer) = 'object'
    and jsonb_typeof(items) = 'array'
    and total >= 0
    and subtotal >= 0
  );

drop policy if exists "Admins can read orders" on public.orders;
create policy "Admins can read orders"
  on public.orders for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
  on public.orders for update to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "Admins can delete orders" on public.orders;
create policy "Admins can delete orders"
  on public.orders for delete to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- La clave pública no permite leer pedidos de clientes: SELECT queda limitado
-- a usuarios autenticados cuyo app_metadata.role sea "admin".
-- Nunca agregues una service_role key al frontend.
