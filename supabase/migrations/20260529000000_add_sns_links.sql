-- SNS 플로팅 버튼 설정 테이블.
-- 어드민이 플랫폼별 URL / 노출여부 / 순서를 관리한다.
-- 아이콘은 코드(react-icons)에서 platform 키로 매핑하므로 DB에는 저장하지 않는다.
-- URL이 비어있거나 active=false 인 행은 랜딩에 노출되지 않는다.

create table public.sns_links (
  id          uuid primary key default gen_random_uuid(),
  platform    text not null unique,
  label       text not null,
  url         text not null default '',
  active      boolean not null default true,
  sort_order  integer not null default 0,
  updated_at  timestamptz not null default now()
);

-- updated_at 자동 갱신
create or replace function public.set_sns_links_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger sns_links_set_updated_at
  before update on public.sns_links
  for each row execute function public.set_sns_links_updated_at();

-- RLS: public read + admin (profile.role = 'admin') write
alter table public.sns_links enable row level security;

create policy "sns_links_select_all" on public.sns_links for select using (true);
create policy "sns_links_insert_admin" on public.sns_links for insert
  with check ((select role from public.profile where id = auth.uid()) = 'admin');
create policy "sns_links_update_admin" on public.sns_links for update
  using ((select role from public.profile where id = auth.uid()) = 'admin');
create policy "sns_links_delete_admin" on public.sns_links for delete
  using ((select role from public.profile where id = auth.uid()) = 'admin');

-- 일괄 순서 변경 RPC (reorder_videos 패턴과 동일, sort_order 는 unique 가 아님)
create or replace function public.reorder_sns_links(p_orders jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.sns_links s
  set sort_order = (e->>'order')::integer
  from jsonb_array_elements(p_orders) e
  where s.id = (e->>'id')::uuid;
end;
$$;

revoke all on function public.reorder_sns_links(jsonb) from public;
grant execute on function public.reorder_sns_links(jsonb) to authenticated;

-- 플랫폼 시드. 아이콘이 준비된 플랫폼을 미리 넣어두고, 운영자가 URL 을 채워 노출한다.
-- 사용자 확인된 SE Club URL 만 채우고, 나머지는 빈 URL(노출 안 됨)로 둔다.
insert into public.sns_links (platform, label, url, active, sort_order) values
  ('kakaotalk',     '카카오톡',      '',                                          true, 10),
  ('naver_reserve', '네이버 예약',   '',                                          true, 20),
  ('naver_map',     '네이버 지도',   '',                                          true, 30),
  ('naver_cafe',    '네이버 카페',   'https://cafe.naver.com/taeancamp',          true, 40),
  ('naver_blog',    '네이버 블로그', '',                                          true, 50),
  ('youtube',       '유튜브',        'https://www.youtube.com/@SECLUB_OFFICIAL',  true, 60),
  ('instagram',     '인스타그램',    'https://instagram.com/seclub_official',     true, 70),
  ('tiktok',        '틱톡',          'https://tiktok.com/@seclub_official',       true, 80),
  ('pinterest',     '핀터레스트',    'https://pinterest.co.kr/seclub_official',   true, 90);
