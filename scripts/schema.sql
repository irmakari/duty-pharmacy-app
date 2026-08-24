-- Supabase SQL Editor içerisine kopyalayıp çalıştırabileceğiniz Tablo Oluşturma SQL Sorgusu

create table if not exists public.pharmacies (
  id bigint primary key generated always as identity,
  name text not null,
  dist text not null,
  city text default 'İstanbul',
  address text,
  address_note text,
  phone text,
  loc text,
  duty_hours text,
  duty_type text default '24saat',
  duty_type_label text default 'SABİT ECZANE',
  distance text,
  is_open_now boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) Okuma, Ekleme ve Silme İzinleri
alter table public.pharmacies enable row level security;

create policy "Eczaneler herkese açıktır." 
  on public.pharmacies for select 
  using (true);

create policy "Eczane ekleme izni" 
  on public.pharmacies for insert 
  with check (true);

create policy "Eczane silme izni" 
  on public.pharmacies for delete 
  using (true);
