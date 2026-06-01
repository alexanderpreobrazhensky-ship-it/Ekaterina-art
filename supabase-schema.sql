-- Supabase schema for Ekaterina Art Platform
-- Run this file in Supabase SQL Editor after creating the project.

create extension if not exists "pgcrypto";

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
    or coalesce(auth.jwt() -> 'app_metadata' ->> 'is_admin', 'false') = 'true';
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  phone text,
  city text,
  preferred_contact text check (preferred_contact in ('Telegram', 'WhatsApp', 'Телефон', 'Email')) default 'Email',
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'Новая заявка' check (status in (
    'Новая заявка',
    'В обсуждении',
    'ТЗ подготовлено',
    'Ожидает подтверждения клиента',
    'Подтверждено клиентом',
    'Ожидает предоплаты',
    'В работе',
    'Готово',
    'Передано / отправлено',
    'Завершено'
  )),
  product_type text not null,
  approximate_size text,
  wishes text,
  budget text,
  desired_deadline text,
  created_at timestamptz not null default now()
);

create table if not exists public.technical_specifications (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  dimensions text,
  color_tone text,
  texture text,
  materials text,
  price text,
  prepayment text,
  production_time text,
  delivery_method text,
  master_comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.consent_records (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  offer_version text not null,
  privacy_policy_version text not null,
  confirmed_at timestamptz not null default now(),
  ip_address inet,
  created_at timestamptz not null default now()
);

create table if not exists public.order_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  event_type text not null,
  actor text not null check (actor in ('Клиент', 'Мастер', 'Система')),
  description text,
  created_at timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles(email);
create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists technical_specifications_order_id_idx on public.technical_specifications(order_id);
create index if not exists consent_records_order_id_idx on public.consent_records(order_id);
create index if not exists order_history_order_id_idx on public.order_history(order_id);

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.technical_specifications enable row level security;
alter table public.consent_records enable row level security;
alter table public.order_history enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own_or_admin" on public.profiles;
drop policy if exists "orders_select_own_or_admin" on public.orders;
drop policy if exists "orders_insert_own" on public.orders;
drop policy if exists "orders_update_admin" on public.orders;
drop policy if exists "orders_delete_admin" on public.orders;
drop policy if exists "technical_specs_select_order_owner_or_admin" on public.technical_specifications;
drop policy if exists "technical_specs_admin_all" on public.technical_specifications;
drop policy if exists "consent_records_select_order_owner_or_admin" on public.consent_records;
drop policy if exists "consent_records_insert_order_owner_or_admin" on public.consent_records;
drop policy if exists "consent_records_admin_update_delete" on public.consent_records;
drop policy if exists "order_history_select_order_owner_or_admin" on public.order_history;
drop policy if exists "order_history_insert_order_owner_or_admin" on public.order_history;
drop policy if exists "order_history_admin_update_delete" on public.order_history;
drop policy if exists "portfolio_public_read" on storage.objects;
drop policy if exists "portfolio_admin_write" on storage.objects;
drop policy if exists "order_files_owner_read" on storage.objects;
drop policy if exists "order_files_owner_upload" on storage.objects;
drop policy if exists "order_files_admin_all" on storage.objects;

create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());

create policy "profiles_update_own_or_admin" on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy "orders_select_own_or_admin" on public.orders
  for select using (user_id = auth.uid() or public.is_admin());

create policy "orders_insert_own" on public.orders
  for insert with check (user_id = auth.uid());

create policy "orders_update_admin" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

create policy "orders_delete_admin" on public.orders
  for delete using (public.is_admin());

create policy "technical_specs_select_order_owner_or_admin" on public.technical_specifications
  for select using (
    public.is_admin()
    or exists (select 1 from public.orders where orders.id = technical_specifications.order_id and orders.user_id = auth.uid())
  );

create policy "technical_specs_admin_all" on public.technical_specifications
  for all using (public.is_admin()) with check (public.is_admin());

create policy "consent_records_select_order_owner_or_admin" on public.consent_records
  for select using (
    public.is_admin()
    or exists (select 1 from public.orders where orders.id = consent_records.order_id and orders.user_id = auth.uid())
  );

create policy "consent_records_insert_order_owner_or_admin" on public.consent_records
  for insert with check (
    public.is_admin()
    or exists (select 1 from public.orders where orders.id = consent_records.order_id and orders.user_id = auth.uid())
  );

create policy "consent_records_admin_update_delete" on public.consent_records
  for all using (public.is_admin()) with check (public.is_admin());

create policy "order_history_select_order_owner_or_admin" on public.order_history
  for select using (
    public.is_admin()
    or exists (select 1 from public.orders where orders.id = order_history.order_id and orders.user_id = auth.uid())
  );

create policy "order_history_insert_order_owner_or_admin" on public.order_history
  for insert with check (
    public.is_admin()
    or exists (select 1 from public.orders where orders.id = order_history.order_id and orders.user_id = auth.uid())
  );

create policy "order_history_admin_update_delete" on public.order_history
  for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into storage.buckets (id, name, public)
values
  ('portfolio', 'portfolio', true),
  ('order-files', 'order-files', false)
on conflict (id) do nothing;

create policy "portfolio_public_read" on storage.objects
  for select using (bucket_id = 'portfolio');

create policy "portfolio_admin_write" on storage.objects
  for all using (bucket_id = 'portfolio' and public.is_admin())
  with check (bucket_id = 'portfolio' and public.is_admin());

create policy "order_files_owner_read" on storage.objects
  for select using (
    bucket_id = 'order-files'
    and (public.is_admin() or auth.uid()::text = (storage.foldername(name))[1])
  );

create policy "order_files_owner_upload" on storage.objects
  for insert with check (
    bucket_id = 'order-files'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "order_files_admin_all" on storage.objects
  for all using (bucket_id = 'order-files' and public.is_admin())
  with check (bucket_id = 'order-files' and public.is_admin());
