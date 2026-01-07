-- The office (and its car park) is closed at weekends.
alter table public.bookings
  add constraint bookings_on_workdays_only
  check (extract(isodow from booking_date) < 6);
