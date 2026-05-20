# supabase/

이 디렉토리는 Supabase 프로젝트 (prod + staging) 의 **스키마 마이그레이션 단일 소스**입니다.

## 환경

| 환경 | Project ID | 용도 |
|------|-----------|------|
| **production** | `nqsogxcasyjauqgwmrxi` | 실서비스, 실 사용자·예약 데이터 |
| **staging (dev)** | `luahtwecncwqmipztkyt` | 로컬 개발·테스트용 |

각 앱의 `.env.local` 은 staging 을 가리키고, Vercel production 환경변수가 prod 를 가리킵니다.

## 디렉토리

```
supabase/
├── config.toml         # Supabase CLI 설정 (자동 생성)
├── migrations/         # SQL migration 파일들 (시간순)
│   └── YYYYMMDDHHMMSS_<name>.sql
└── seed.sql            # 선택: staging 초기 데이터 시드
```

## 스키마 변경 워크플로우

```bash
# 1. 새 마이그레이션 파일 생성
npx supabase migration new add_some_table
# → supabase/migrations/20260520123000_add_some_table.sql 자동 생성

# 2. SQL 작성 (CREATE TABLE, ALTER 등)

# 3. staging 에 먼저 적용
npx supabase link --project-ref luahtwecncwqmipztkyt
npx supabase db push

# 4. 검증 후 prod 에 적용
npx supabase link --project-ref nqsogxcasyjauqgwmrxi
npx supabase db push

# 5. TypeScript 타입 재생성
pnpm --filter @seclub/supabase gen:types
# 주의: gen:types 는 현재 prod 기준으로 설정되어 있음.
# staging 만 가진 변경을 잠시 타입에 반영하려면 supabase/package.json 의
# project-id 를 staging 으로 임시 변경 후 generate.
```

**원칙:**
- 모든 schema 변경은 migration 파일로 commit (직접 SQL 실행 금지)
- staging 먼저 → 검증 → prod
- migration 파일은 immutable: 일단 적용되면 수정하지 말고 새 migration 으로 fix
- 손 SQL 변경이 있었다면 `supabase db pull --linked` 로 끌어와서 commit

## MCP 로 적용하는 경우 (Claude)

Supabase MCP 가 연결된 org 의 프로젝트면 `apply_migration` 으로도 적용 가능:

```
mcp__claude_ai_Supabase__apply_migration({ project_id, name, query })
```

이건 자동으로 `supabase/migrations/` 와 동일한 형식으로 기록됩니다.

## 초기 셋업 (staging 새 프로젝트)

`luahtwecncwqmipztkyt` 는 빈 프로젝트입니다. prod 의 schema 를 옮기려면:

```bash
# prod 의 현재 schema 를 dump
npx supabase link --project-ref nqsogxcasyjauqgwmrxi
npx supabase db dump --schema public > supabase/migrations/0_baseline_from_prod.sql

# staging 에 적용
npx supabase link --project-ref luahtwecncwqmipztkyt
npx supabase db push
```

이후로는 모든 변경이 migration 파일로 양쪽 동기화.
