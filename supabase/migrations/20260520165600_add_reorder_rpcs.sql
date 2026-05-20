-- Batch reorder RPCs to avoid N round trips from the admin client.
-- - reorder_videos: handles the unique constraint on videos."order" by
--   deferring constraint checks for the duration of the function.
-- - reorder_gallery_reborn_items: bulk update display_order.
--
-- Both accept a JSON array of {id, order} objects.

-- Make videos."order" UNIQUE constraint deferrable so the bulk update inside
-- reorder_videos can temporarily violate uniqueness mid-statement.
do $$
declare
  cons_name text;
begin
  select c.conname into cons_name
  from pg_constraint c
  join pg_class t on t.oid = c.conrelid
  where t.relname = 'videos'
    and t.relnamespace = 'public'::regnamespace
    and c.contype = 'u'
    and array_length(c.conkey, 1) = 1
    and (select attname from pg_attribute where attrelid = t.oid and attnum = c.conkey[1]) = 'order';

  if cons_name is not null then
    execute format('alter table public.videos drop constraint %I', cons_name);
    execute 'alter table public.videos add constraint videos_order_unique unique ("order") deferrable initially immediate';
  end if;
end$$;


create or replace function public.reorder_videos(p_orders jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- videos."order" has a UNIQUE constraint; defer it so the bulk update can
  -- swap rows without intermediate conflicts.
  set constraints all deferred;

  update public.videos v
  set "order" = (e->>'order')::smallint
  from jsonb_array_elements(p_orders) e
  where v.id = (e->>'id')::uuid;
end;
$$;

revoke all on function public.reorder_videos(jsonb) from public;
grant execute on function public.reorder_videos(jsonb) to authenticated;


create or replace function public.reorder_gallery_reborn_items(p_orders jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.gallery_reborn_items g
  set display_order = (e->>'order')::integer
  from jsonb_array_elements(p_orders) e
  where g.id = (e->>'id')::uuid;
end;
$$;

revoke all on function public.reorder_gallery_reborn_items(jsonb) from public;
grant execute on function public.reorder_gallery_reborn_items(jsonb) to authenticated;
