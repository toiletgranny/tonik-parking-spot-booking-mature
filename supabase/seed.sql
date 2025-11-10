-- Local development data. Runs on `npm run db:reset` (and on the first `npm run db:start`).
-- Keep this minimal: just what the app needs to work.

insert into public.parking_spots (label, sort_order)
values
  ('01', 1), ('02', 2), ('03', 3), ('04', 4), ('05', 5),
  ('06', 6), ('07', 7), ('08', 8), ('09', 9), ('10', 10);
