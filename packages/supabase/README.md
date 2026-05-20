# @seclub/supabase

공통 Supabase client (브라우저/서버/middleware) + generated DB types.

## 사용

```ts
// 브라우저
import { createClient } from "@seclub/supabase/client";
const supabase = createClient();

// 서버 컴포넌트
import { createClient } from "@seclub/supabase/server";
const supabase = await createClient();

// Next middleware
import { updateSession } from "@seclub/supabase/middleware";

// 타입
import type { Database, Tables, Enums } from "@seclub/supabase/types";

type NoticeRow = Tables<"notice">;
type Role = Enums<"role">;
```

client/server/middleware는 모두 `Database` generic으로 묶여있어서, `supabase.from("notice").select()` 같은 호출이 자동으로 타입됩니다.

## DB 타입 재생성

스키마 변경 후:

```bash
# 1. Supabase 로그인 (최초 1회)
npx supabase login

# 2. 타입 갱신
pnpm --filter @seclub/supabase gen:types
```

타입은 `src/database.types.ts`에 저장되며, Project ID(`nqsogxcasyjauqgwmrxi`)는 스크립트에 하드코딩되어 있습니다.

CI에서 자동 갱신하려면 `SUPABASE_ACCESS_TOKEN` env 사용:

```bash
SUPABASE_ACCESS_TOKEN=xxx pnpm --filter @seclub/supabase gen:types
```

## 패턴: 앱별 view type

DB row를 그대로 쓰지 말고 앱별로 view type을 만들어서 import:

```ts
// apps/landing/src/types/notice.ts
import type { Tables } from "@seclub/supabase/types";

type NoticeRow = Tables<"notice">;

// 랜딩 목록용 (가벼움)
export type Notice = Pick<
  NoticeRow,
  "id" | "category" | "title" | "created_at" | "view" | "pinned"
>;

// 랜딩 상세용
export type NoticeDetail = Notice & Pick<NoticeRow, "content" | "images">;
```

```ts
// apps/admin/src/types/notices.ts
import type { Tables } from "@seclub/supabase/types";

// 어드민은 전체 row
export type Notice = Tables<"notice">;
```

이러면 스키마가 바뀌어도 `pnpm gen:types` 한 번으로 양쪽 앱 컴파일 에러로 변경 사항이 드러납니다.
