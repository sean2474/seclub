-- =====================================================================
-- seclub baseline migration
-- Generated from prod (project: nqsogxcasyjauqgwmrxi) on 2026-05-21
--
-- 적용 순서를 보장하기 위해 timestamped filename 사용.
-- 새 staging 프로젝트(luahtwecncwqmipztkyt)에 처음 적용할 때 사용.
-- 이후 변경은 별도 마이그레이션 파일로 추가.
-- =====================================================================

-- ---------------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------------
create type public.role as enum ('admin', 'reservation_manager', 'gallery_manager', 'user');

-- ---------------------------------------------------------------------
-- TABLES
-- ---------------------------------------------------------------------

-- 사용자 프로필 (auth.users 1:1, 트리거로 자동 생성)
create table public.profile (
  id          uuid primary key default gen_random_uuid()
              references auth.users(id) on update cascade on delete cascade,
  role        public.role not null default 'user',
  name        text,
  image_path  text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 공지 카테고리 (notice.category FK 대상)
create table public.category (
  id          uuid primary key default gen_random_uuid(),
  type        text not null unique,
  created_at  timestamptz not null default now()
);

-- 공지사항
create table public.notice (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  content     text not null,
  category    text not null references public.category(type),
  active      boolean not null,
  pinned      boolean default false,
  view        integer not null default 0,
  images      text[],
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 메인 hero 텍스트 (1 row 운용)
create table public.main_hero_text (
  id                uuid primary key default gen_random_uuid(),
  tagline           text not null default '당신만의 힐링',
  heading_line1     text not null default 'SE Club에서 누리는',
  heading_line2     text not null default '완벽한 휴식',
  button_text       text not null default '지금 예약하기',
  notices_new_badge boolean not null default true,
  updated_at        timestamptz not null default now()
);

-- 팝업 배너
create table public.popups (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  content     text,
  image_url   text,
  link_url    text,
  active      boolean not null default false,
  priority    integer not null default 0,
  start_date  timestamptz,
  end_date    timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 객실 정보 (slug별)
create table public.room_infos (
  id          uuid primary key default gen_random_uuid(),
  slug        varchar(50) not null unique,
  data        jsonb not null,
  is_active   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
create index idx_rooms_slug on public.room_infos using btree (slug);
create index idx_rooms_active on public.room_infos using btree (is_active) where (is_active = true);

-- 객실 요금
create table public.room_rates (
  id                  serial primary key,
  name                text not null unique,
  type                text not null check (type in ('lodging', 'camping')),
  peak_rate           integer not null,
  winter_rate         integer not null,
  long_stay_discount  integer default 0,
  display_order       integer default 0,
  created_at          timestamp default now(),
  updated_at          timestamp default now()
);

-- 레이트 체크아웃 요금 (room_rates 1:1)
create table public.late_checkout_rates (
  id        serial primary key,
  room_id   integer not null unique references public.room_rates(id) on delete cascade,
  hours_3   integer not null,
  hours_6   integer not null
);

-- 할인율
create table public.discount_rates (
  id                serial primary key,
  season            text not null check (season in ('highSeason', 'winterSeason')),
  category          text not null,
  nights            text not null,
  discount_percent  integer not null,
  unique (season, category, nights)
);

-- 비디오
create table public.videos (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  link        text not null,
  "order"     smallint not null unique,
  created_at  timestamptz not null default now()
);

-- 웰니스 프로그램 (slug PK, no id)
create table public.wellness_programs (
  slug        text primary key,
  header      jsonb not null,
  contents    jsonb not null default '[]'::jsonb,
  images      jsonb not null default '[]'::jsonb,
  updated_at  timestamptz not null default now()
);

-- 캠핑 이용가이드
create table public.camping_guide (
  id          uuid primary key default gen_random_uuid(),
  sections    jsonb not null default '[]'::jsonb,
  updated_at  timestamptz not null default now()
);

-- 갤러리 환생 항목
create table public.gallery_reborn_items (
  id            uuid primary key default gen_random_uuid(),
  image_path    text not null,
  small_path    text,
  title         text,
  description   text,
  caption_en    text,
  layout_type   text not null default 'centered'
                check (layout_type in ('full', 'asymmetric', 'centered', 'quote')),
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index gallery_reborn_items_order_idx
  on public.gallery_reborn_items using btree (display_order, created_at desc);

-- ---------------------------------------------------------------------
-- FUNCTIONS
-- ---------------------------------------------------------------------

-- auth.users INSERT 트리거: provider 별로 profile 생성
create or replace function public.add_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.raw_app_meta_data ->> 'provider' = 'email' then
    insert into public.profile (id) values (new.id);
  elsif new.raw_app_meta_data ->> 'provider' in ('kakao', 'google') then
    insert into public.profile (id, name, image_path)
    values (
      new.id,
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'avatar_url'
    );
  end if;
  return new;
end;
$$;

-- notice 조회수 증가 RPC
create or replace function public.increment_notice_view_count(p_notice_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.notice set view = view + 1 where id = p_notice_id;
end;
$$;

-- updated_at 자동 갱신 (gallery_reborn_items)
create or replace function public.set_gallery_reborn_items_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- updated_at 자동 갱신 (room_infos)
create or replace function public.update_rooms_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- TRIGGERS
-- ---------------------------------------------------------------------
create trigger tg_add_new_user
  after insert on auth.users
  for each row execute function public.add_new_user();

create trigger gallery_reborn_items_set_updated_at
  before update on public.gallery_reborn_items
  for each row execute function public.set_gallery_reborn_items_updated_at();

create trigger trigger_rooms_updated_at
  before update on public.room_infos
  for each row execute function public.update_rooms_updated_at();

-- ---------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- 패턴: public read + admin (profile.role = 'admin') write
-- ---------------------------------------------------------------------
alter table public.profile               enable row level security;
alter table public.category              enable row level security;
alter table public.notice                enable row level security;
alter table public.main_hero_text        enable row level security;
alter table public.popups                enable row level security;
alter table public.room_infos            enable row level security;
alter table public.room_rates            enable row level security;
alter table public.late_checkout_rates   enable row level security;
alter table public.discount_rates        enable row level security;
alter table public.videos                enable row level security;
alter table public.wellness_programs     enable row level security;
alter table public.camping_guide         enable row level security;
alter table public.gallery_reborn_items  enable row level security;

-- profile: 본인 관리 + admin 만 role 변경
create policy "Users can manage their profile" on public.profile
  for all
  using (auth.uid() = id)
  with check (
    (select auth.uid()) = id
    and role = (select role from public.profile where id = auth.uid())
  );

create policy "Admins can update roles" on public.profile
  for update to authenticated
  with check (
    (select role from public.profile where id = auth.uid()) = 'admin'
  );

-- category (authenticated admin all)
create policy "Policy with security definer functions" on public.category
  for all to authenticated
  using ((select role from public.profile where id = auth.uid()) = 'admin');

-- notice
create policy "notice_select_all" on public.notice for select using (true);
create policy "notice_insert_admin" on public.notice for insert
  with check ((select role from public.profile where id = auth.uid()) = 'admin');
create policy "notice_update_admin" on public.notice for update
  using ((select role from public.profile where id = auth.uid()) = 'admin');
create policy "notice_delete_admin" on public.notice for delete
  using ((select role from public.profile where id = auth.uid()) = 'admin');

-- main_hero_text
create policy "Public read hero text" on public.main_hero_text for select using (true);
create policy "Admin update hero text" on public.main_hero_text for update
  using ((select role from public.profile where id = auth.uid()) = 'admin')
  with check ((select role from public.profile where id = auth.uid()) = 'admin');

-- popups
create policy "Public read active popups" on public.popups for select
  using (
    active = true
    and (start_date is null or start_date <= now())
    and (end_date   is null or end_date   >= now())
  );
create policy "Admin manage popups" on public.popups for all
  using ((select role from public.profile where id = auth.uid()) = 'admin')
  with check ((select role from public.profile where id = auth.uid()) = 'admin');

-- room_infos
create policy "room_infos_select_all" on public.room_infos for select using (true);
create policy "room_infos_insert_admin" on public.room_infos for insert
  with check ((select role from public.profile where id = auth.uid()) = 'admin');
create policy "room_infos_update_admin" on public.room_infos for update
  using ((select role from public.profile where id = auth.uid()) = 'admin');
create policy "room_infos_delete_admin" on public.room_infos for delete
  using ((select role from public.profile where id = auth.uid()) = 'admin');

-- room_rates
create policy "room_rates_select_all" on public.room_rates for select using (true);
create policy "room_rates_insert_admin" on public.room_rates for insert
  with check ((select role from public.profile where id = auth.uid()) = 'admin');
create policy "room_rates_update_admin" on public.room_rates for update
  using ((select role from public.profile where id = auth.uid()) = 'admin');
create policy "room_rates_delete_admin" on public.room_rates for delete
  using ((select role from public.profile where id = auth.uid()) = 'admin');

-- late_checkout_rates
create policy "late_checkout_rates_select_all" on public.late_checkout_rates for select using (true);
create policy "late_checkout_rates_insert_admin" on public.late_checkout_rates for insert
  with check ((select role from public.profile where id = auth.uid()) = 'admin');
create policy "late_checkout_rates_update_admin" on public.late_checkout_rates for update
  using ((select role from public.profile where id = auth.uid()) = 'admin');
create policy "late_checkout_rates_delete_admin" on public.late_checkout_rates for delete
  using ((select role from public.profile where id = auth.uid()) = 'admin');

-- discount_rates
create policy "discount_rates_select_all" on public.discount_rates for select using (true);
create policy "discount_rates_insert_admin" on public.discount_rates for insert
  with check ((select role from public.profile where id = auth.uid()) = 'admin');
create policy "discount_rates_update_admin" on public.discount_rates for update
  using ((select role from public.profile where id = auth.uid()) = 'admin');
create policy "discount_rates_delete_admin" on public.discount_rates for delete
  using ((select role from public.profile where id = auth.uid()) = 'admin');

-- videos
create policy "video_select_all" on public.videos for select using (true);
create policy "video_insert_admin" on public.videos for insert
  with check ((select role from public.profile where id = auth.uid()) = 'admin');
create policy "video_update_admin" on public.videos for update
  using ((select role from public.profile where id = auth.uid()) = 'admin');
create policy "videos_delete_admin" on public.videos for delete
  using ((select role from public.profile where id = auth.uid()) = 'admin');

-- wellness_programs
create policy "Public read wellness_programs" on public.wellness_programs for select using (true);
create policy "Admin manage wellness_programs" on public.wellness_programs for all
  using ((select role from public.profile where id = auth.uid()) = 'admin')
  with check ((select role from public.profile where id = auth.uid()) = 'admin');

-- camping_guide
create policy "Public read camping_guide" on public.camping_guide for select using (true);
create policy "Admin manage camping_guide" on public.camping_guide for all
  using ((select role from public.profile where id = auth.uid()) = 'admin')
  with check ((select role from public.profile where id = auth.uid()) = 'admin');

-- gallery_reborn_items
create policy "Public read gallery_reborn_items" on public.gallery_reborn_items for select using (true);
create policy "Admin manage gallery_reborn_items" on public.gallery_reborn_items for all
  using ((select role from public.profile where id = auth.uid()) = 'admin')
  with check ((select role from public.profile where id = auth.uid()) = 'admin');

-- ---------------------------------------------------------------------
-- STORAGE BUCKETS
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('gallery',        'gallery',        true, null,     null),
  ('gallery-reborn', 'gallery-reborn', true, 10485760, '{image/jpeg,image/jpg,image/png,image/webp,image/avif}'),
  ('notice',         'notice',         true, null,     null),
  ('popups',         'popups',         true, null,     '{image/jpeg,image/jpg,image/png}')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- STORAGE OBJECT POLICIES
-- 패턴: public select + admin {insert, update, delete} per bucket
-- ---------------------------------------------------------------------

-- gallery
create policy "gallery_bucket_select" on storage.objects for select
  using (bucket_id = 'gallery');
create policy "gallery_bucket_insert" on storage.objects for insert
  with check (
    bucket_id = 'gallery'
    and exists (select 1 from public.profile where id = auth.uid() and role = 'admin')
  );
create policy "gallery_bucket_update" on storage.objects for update
  using (
    bucket_id = 'gallery'
    and exists (select 1 from public.profile where id = auth.uid() and role = 'admin')
  );
create policy "gallery_bucket_delete" on storage.objects for delete
  using (
    bucket_id = 'gallery'
    and exists (select 1 from public.profile where id = auth.uid() and role = 'admin')
  );

-- gallery-reborn
create policy "Public read gallery-reborn" on storage.objects for select
  using (bucket_id = 'gallery-reborn');
create policy "Admin insert gallery-reborn" on storage.objects for insert
  with check (
    bucket_id = 'gallery-reborn'
    and (select role from public.profile where id = auth.uid()) = 'admin'
  );
create policy "Admin update gallery-reborn" on storage.objects for update
  using (
    bucket_id = 'gallery-reborn'
    and (select role from public.profile where id = auth.uid()) = 'admin'
  );
create policy "Admin delete gallery-reborn" on storage.objects for delete
  using (
    bucket_id = 'gallery-reborn'
    and (select role from public.profile where id = auth.uid()) = 'admin'
  );

-- notice
create policy "notice_bucket_select" on storage.objects for select
  using (bucket_id = 'notice');
create policy "notice_bucket_insert" on storage.objects for insert
  with check (
    bucket_id = 'notice'
    and exists (select 1 from public.profile where id = auth.uid() and role = 'admin')
  );
create policy "notice_bucket_update" on storage.objects for update
  using (
    bucket_id = 'notice'
    and exists (select 1 from public.profile where id = auth.uid() and role = 'admin')
  );
create policy "notice_bucket_delete" on storage.objects for delete
  using (
    bucket_id = 'notice'
    and exists (select 1 from public.profile where id = auth.uid() and role = 'admin')
  );

-- popups
create policy "popups_bucket_select" on storage.objects for select
  using (bucket_id = 'popups');
create policy "popups_bucket_insert" on storage.objects for insert
  with check (
    bucket_id = 'popups'
    and exists (select 1 from public.profile where id = auth.uid() and role = 'admin')
  );
create policy "popups_bucket_update" on storage.objects for update
  using (
    bucket_id = 'popups'
    and exists (select 1 from public.profile where id = auth.uid() and role = 'admin')
  );
create policy "popups_bucket_delete" on storage.objects for delete
  using (
    bucket_id = 'popups'
    and exists (select 1 from public.profile where id = auth.uid() and role = 'admin')
  );

-- ---------------------------------------------------------------------
-- 끝
-- ---------------------------------------------------------------------
