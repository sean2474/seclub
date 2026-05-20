# seclub

Monorepo for 서산컨트리클럽 web platform.

## Structure

```
apps/
  landing/   seclub.kr            - 메인 홍보 페이지
  admin/     admin.seclub.kr      - 관리자
  reserve/   reserve.seclub.kr    - 예약 시스템
  mypage/    my.seclub.kr         - 사용자 마이페이지
  auth/      auth.seclub.kr       - SSO 인증

packages/
  ui/          공통 컴포넌트
  supabase/    Supabase client + 타입
  auth/        SSO 쿠키/세션 헬퍼
  types/       공통 도메인 타입
  config/      공통 tsconfig/eslint/tailwind preset
```

## 개발

```bash
pnpm install
pnpm dev                     # 5개 앱 동시 실행
pnpm --filter=admin dev      # 특정 앱만
pnpm build                   # 전부 빌드 (캐시 활용)
```

## 로컬 SSO 테스트

서브도메인 쿠키 동작 확인용으로 `/etc/hosts` 설정 필요:

```bash
sudo ./scripts/setup-local-domains.sh
```

이후 `http://admin.seclub.local:3001` 같이 접근.
