-- Parking spots and bookings.

create table public.parking_spots (
  id bigint generated always as identity primary key,
  label text not null unique,
  sort_order integer not null,
  is_active boolean not null default true
);

alter table public.parking_spots enable row level security;

create policy "Signed-in users can see spots"
  on public.parking_spots for select
  to authenticated
  using (true);


create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  spot_id bigint not null references public.parking_spots (id),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  booking_date date not null,
  driver_name text not null check (char_length(trim(driver_name)) > 0),
  license_plate text not null check (char_length(trim(license_plate)) > 0),
  note text,
  created_at timestamptz not null default now(),
  -- One booking per spot per day. People can book several spots (e.g. for guests).
  unique (spot_id, booking_date)
);

create index bookings_user_id_booking_date_idx on public.bookings (user_id, booking_date);
create index bookings_booking_date_idx on public.bookings (booking_date);

alter table public.bookings enable row level security;

-- Bookings are private: you only ever see, change or cancel your own.
create policy "Users can see their own bookings"
  on public.bookings for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can book for today or later"
  on public.bookings for insert
  to authenticated
  with check ((select auth.uid()) = user_id and booking_date >= current_date);

create policy "Users can edit their own bookings"
  on public.bookings for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can cancel their own bookings"
  on public.bookings for delete
  to authenticated
  using ((select auth.uid()) = user_id);


-- Everyone needs to know which spots are taken, but not who took them.
-- This function returns only (spot, day) pairs and runs with the owner's rights,
-- so it can read past the policies above without exposing any booking details.
create function public.get_taken_spots(from_date date, to_date date)
returns table (spot_id bigint, booking_date date)
language sql
stable
security definer
set search_path = ''
as $$
  select b.spot_id, b.booking_date
  from public.bookings b
  where (select auth.uid()) is not null
    and b.booking_date between from_date and to_date;
$$;

revoke execute on function public.get_taken_spots(date, date) from public, anon;
grant execute on function public.get_taken_spots(date, date) to authenticated;
