-- Local development data. Runs on `npm run db:reset` (and on the first `npm run db:start`).
-- Keep this minimal: just what the app needs to work.

insert into public.parking_spots (label, sort_order)
values
  ('01', 1), ('02', 2), ('03', 3), ('04', 4), ('05', 5),
  ('06', 6), ('07', 7), ('08', 8), ('09', 9), ('10', 10);

-- Test accounts. Everyone uses the password `password123`.
-- Sign-ups are turned off (supabase/config.toml), so this is the only way accounts get created locally.
with test_users (id, email, full_name) as (
  values
    ('6f1c1a52-0c55-4d0e-9a0c-1d3a0f2b7a01'::uuid, 'alex@example.com', 'Alex Morgan'),
    ('6f1c1a52-0c55-4d0e-9a0c-1d3a0f2b7a02'::uuid, 'sam@example.com', 'Sam Taylor'),
    ('6f1c1a52-0c55-4d0e-9a0c-1d3a0f2b7a03'::uuid, 'jordan@example.com', 'Jordan Lee')
),
new_users as (
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    -- GoTrue expects empty strings here, not NULL, or sign-in fails with a 500.
    confirmation_token, recovery_token, email_change, email_change_token_new
  )
  select
    '00000000-0000-0000-0000-000000000000', id, 'authenticated', 'authenticated', email,
    extensions.crypt('password123', extensions.gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}', jsonb_build_object('full_name', full_name),
    now(), now(),
    '', '', '', ''
  from test_users
  returning id, email
)
insert into auth.identities (user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
select id, id::text, 'email', jsonb_build_object('sub', id::text, 'email', email, 'email_verified', true), now(), now(), now()
from new_users;
