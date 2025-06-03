1. 개요
이 문서는 숙박업소(호텔·게스트하우스·캠핑장 등) 웹사이트 리메이크 프로젝트의 전체 구조와 요구사항을 정리한 것입니다.

목표: 사용자에게 직관적이고 세련된 정보 제공을 하고, 관리자는 별도의 관리자 페이지에서 콘텐츠를 손쉽게 관리할 수 있도록 설계

대상 기능

정보성 페이지 (Front-end)

관리자 페이지 (Admin Panel)

로그인/인증

갤러리·후기·공지사항 CRUD

유지보수·운영 (Maintenance & Operations)

2. 기술 스택 및 호스팅
2.1. 기술 스택
프론트엔드

Next.js (App Router, TypeScript, Tailwind CSS)

React 기반 컴포넌트 구조

Supabase (CMS 역할: 데이터베이스 + 인증 + 스토리지)

Vercel (호스팅 & CI/CD)

백엔드

Next.js API Routes (필요 시 간단한 커스텀 API)

Supabase (PostgreSQL 데이터베이스, Auth, Storage)

별도 서버 불필요 (서버리스 아키텍처 활용)

관리자 인증

Supabase Auth (이메일/비밀번호 로그인 + JWT 세션)

Role-Based Access Control (단일 관리자 계정)

데이터베이스 모델 (Supabase PostgreSQL)

gallery_items (갤러리 사진)

reviews (고객 후기)

notices (공지사항)

admins (관리자 계정 정보)

(추가) settings 등 기타 설정 테이블

2.2. 호스팅 & 배포
Vercel

Git 연동 → Push 시 자동 빌드·배포

Preview Deployments로 PR단위 확인

Production 환경에 머스터(main 브랜치 머지) 시 배포

Supabase

Free Tier로 시작 (작은 규모 적합)

향후 사용자/콘텐츠 증가 시 Pro 요금제로 업그레이드

환경 변수 (SUPABASE_URL, SUPABASE_ANON_KEY, SERVICE_ROLE_KEY 등) Vercel Secrets로 관리

3. 프론트엔드 구조 (정보성 페이지)
전체적으로 “One-Page Scroll” 혹은 “멀티 페이지” 형태로 구성할 수 있지만, 유지보수·확장성 관점에서 각 페이지를 분리하는 것을 권장합니다.

3.1. 페이지 목록
홈 (Home)

대표 히어로 섹션 (풀스크린 배경 + 키 비주얼)

간략한 소개(슬로건) + 주요 CTA 버튼(“예약하기”)

핵심 가치 제안(Why Us)

객실(숙박) 소개 (Rooms/Accommodations)

여러 타입(풀빌라, 스탠다드, 캠핑 등) 카드 레이아웃

각 카드에 요금·인원·간단 설명

“자세히 보기” → 방별 상세 페이지로 이동

객실 상세 페이지 (Room Detail) – 선택 사항

대표 이미지 슬라이드

주요 편의시설(아메니티) 목록

룸 특징 및 요금, 정책(체크인·체크아웃 등)

“예약하기” 버튼 (외부 예약 플랫폼 링크)

갤러리 (Gallery)

사진 썸네일 그리드 (Lightbox 기능)

Supabase Storage에 저장된 이미지 URL을 동적으로 로드

카테고리별(예: 룸별/리조트 전경/어메니티) 필터 기능

고객 후기 (Reviews/Testimonials)

최신 순 · 평점 순 정렬

리뷰어 이름·날짜·내용 표시

(선택) 별점 시각화 (★ 아이콘)

공지사항 (Notices/Announcements)

리스트형(글 제목 · 날짜)

클릭 시 상세 페이지(제목·내용·작성일)

위치·오시는 길 (Location & Access)

구글 맵 Embed 또는 커스텀 맵

연락처(전화번호·이메일) + 주소

대중교통/자가용 안내 정보

문의 및 연락처 (Contact Us)

간단한 연락처 폼 (이름·이메일·메시지)

Supabase Functions 또는 Next.js API Route로 메일 전송 로직 연결

운영 시간 및 전화번호 노출

푸터 (Footer)

SNS 아이콘(인스타그램, 페이스북 등)

저작권 및 이용약관, 개인정보처리방침 링크

4. 관리자 페이지 구조 (Admin Panel)
관리자는 단일 계정으로 로그인하여 갤러리, 후기, 공지사항 등을 CRUD 형태로 관리할 수 있어야 합니다.

4.1. URL 구조 예시
/admin/login

/admin/dashboard

/admin/gallery

/admin/reviews

/admin/notices

(Next.js App Router 기준, 각 경로는 /app/admin/... 디렉터리에 대응)

4.2. 주요 기능
4.2.1. 로그인/인증 (Authentication)
페이지 경로: /admin/login

입력 필드: 이메일, 비밀번호

로그인 방식:

Admin 계정정보는 Supabase Auth admins 테이블에 저장

NextAuth 또는 Supabase Auth를 이용해 이메일/비밀번호 로그인

로그인 성공 시 JWT 세션 발급 → 쿠키 혹은 Local Storage에 저장

Protected Route: /admin/* 경로 접근 시 세션 체크, 없으면 /admin/login으로 리다이렉트

토큰 관리:

클라이언트(프론트) 측에서는 Supabase Client가 자동으로 세션 토큰 관리

서버 컴포넌트(Next.js)에서도 getServerSession() 등을 통해 인증 상태 확인

4.2.2. 대시보드 (Dashboard)
URL: /admin/dashboard

콘텐츠:

최근 등록된 갤러리 사진 미리보기(썸네일)

최근 후기 5건(리스트)

공지사항 최근 3건

총 레코드 개수(갤러리·후기·공지)

간단한 차트(옵션): 월별 신규 리뷰 수, 갤러리 업로드 수 등 (추후 확장)

4.2.3. 갤러리 관리 (Manage Gallery)
URL: /admin/gallery

기능:

목록 조회

썸네일, 제목(옵션), 업로드 날짜 표시

페이징 처리(10~20개 단위)

업로드 (Create)

이미지 선택(파일 업로드) → Supabase Storage에 저장

제목, 설명, 카테고리(예: 룸별/전체) 입력

‘저장’ 시 Supabase 데이터베이스(gallery_items)에 메타데이터 저장 (이미지 URL 포함)

수정 (Update)

메타데이터(제목·설명·카테고리) 변경

(선택) 이미지를 교체할 경우, 기존 이미지는 Supabase Storage에서 삭제하고 새로 업로드

삭제 (Delete)

개별 선택 삭제

Supabase Storage의 이미지 파일과 데이터베이스 레코드 동시 삭제

검색/필터

제목·카테고리 키워드 검색

카테고리별 필터(예: 객실, 리조트 전경 등)

4.2.4. 후기 관리 (Manage Reviews)
URL: /admin/reviews

기능:

목록 조회

리뷰어 이름, 날짜, 별점, 내용 일부 노출

상태 표시(예: 승인 대기, 승인 완료)

상세 보기 & 승인/거부

승인 대기 중인 리뷰의 경우, ‘승인’ 버튼 클릭 시 웹사이트에 노출

‘거부’ 시 해당 리뷰 DB에서 삭제 혹은 상태 변경

수정 (Update)

리뷰 내용(관리자 코멘트 추가) 수정 가능

삭제 (Delete)

스팸 리뷰 등 불필요한 리뷰 완전 삭제

4.2.5. 공지사항 관리 (Manage Notices)
URL: /admin/notices

기능:

목록 조회

공지 제목, 작성일, 작성자(관리자) 표시

페이징 처리

생성 (Create)

제목, 내용(리치 텍스트 또는 마크다운 편집기), 첨부 파일(옵션) 입력

등록 시 자동으로 작성일, 작성자 정보 저장

수정 (Update)

제목·내용·첨부 파일 변경 가능

삭제 (Delete)

개별 공지 삭제 시 DB 레코드 삭제 (첨부 파일도 Supabase Storage에서 삭제)

4.2.6. 프로필/비밀번호 관리 (Optional)
관리자가 로그인 후 자신의 비밀번호를 변경하거나, 계정 정보를 수정할 수 있는 페이지

URL: /admin/profile

기능: 현재 비밀번호 확인 → 새 비밀번호 입력 → Supabase Auth를 통해 비밀번호 업데이트

5. 인증 & 권한 흐름
관리자만 CMS(관리자 페이지)에 접근할 수 있어야 하므로, 아래 흐름을 따릅니다.

회원 가입 (관리자 계정 생성)

초기 세팅 단계에서 슈퍼 관리자 계정을 미리 Supabase 콘솔이나 배포 스크립트로 생성

이메일, 비밀번호는 클라이언트와 개발자 간 협의 후 결정

로그인 (Authentication)

/admin/login 폼 제출 → Supabase Client signInWithPassword({ email, password }) 호출

성공 시 JWT 토큰 → Next.js에서는 cookies/Session으로 관리

실패 시 에러 메시지(“이메일 또는 비밀번호가 올바르지 않습니다.”) 노출

세션 유지 & 보호 라우트

Admin Dashboard 및 CRUD 페이지(/admin/*)에 진입 시, getServerSideProps 또는 Next.js App Router의 layout.tsx 내 authRequired 훅을 사용해 세션 확인

인증되지 않으면 /admin/login으로 리다이렉트

로그아웃

메뉴 혹은 우측 상단에 “로그아웃” 버튼 노출

클릭 시 supabase.auth.signOut() 호출 → 쿠키/세션 삭제 → /admin/login으로 리다이렉트

권한 확인 (Role-Based Access)

단일 관리자 계정만 있다면 Role 체크는 생략 가능

향후 멀티 관리자 또는 역할 분리(예: 콘텐츠 관리자, 댓글 관리자) 도입 시 Supabase Row-Level Security (RLS) 정책 적용

6. 데이터 모델 (Supabase 테이블 설계)
아래 예시는 Supabase PostgreSQL 스키마이며, 필요한 컬럼 및 타입을 예시로 제시합니다.

sql
Copy
Edit
-- 6.1. 관리자 계정 (admins)
create table if not exists admins (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  password text not null,         -- supabase auth를 사용할 경우 암호 해시 저장
  role text default 'admin',      -- 확장성을 위해 role 필드 추가
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6.2. 갤러리 아이템 (gallery_items)
create table if not exists gallery_items (
  id uuid default uuid_generate_v4() primary key,
  title text,
  description text,
  category text,                  -- ex. 'room', 'resort', 'amenities' 등
  image_url text not null,        -- Supabase Storage에 업로드된 파일 URL or path
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6.3. 고객 후기 (reviews)
create table if not exists reviews (
  id uuid default uuid_generate_v4() primary key,
  reviewer_name text not null,
  rating integer check (rating >= 1 and rating <= 5),
  content text not null,
  status text default 'pending',  -- 'pending', 'approved', 'rejected'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6.4. 공지사항 (notices)
create table if not exists notices (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,          -- 마크다운 혹은 HTML 저장
  author_email text not null,     -- 작성자(관리자) 이메일
  attachment_url text,            -- 첨부 파일이 있을 경우 URL 저장
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6.5. 설정 테이블 (settings) – Optional
create table if not exists settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);
기본 제약 조건

created_at 및 updated_at은 트리거(Trigger)나 Next.js 코드에서 자동 업데이트

필요 시 Supabase RLS(Row-Level Security) 설정:

관리자만 특정 테이블 접근 허용

reviews 테이블은 익명 사용자가 작성 가능하되, 관리는 관리자만 가능하도록 정책 설정

7. 유지보수 및 운영 (Maintenance & Operations)
관리자는 직접 유지보수를 맡지 않고 “친한 형”이 무료로 지원해 준다고 하였으나, 아래는 일반적인 유지보수 항목을 정리한 것입니다.

7.1. 콘텐츠 업데이트
작업 내용

갤러리 사진 교체/추가

공지사항·후기 관리

텍스트·사진 교체 등

주체: 관리자 페이지에서 직접 처리 (No deployment)

권장 주기: 필요 시 수시 업데이트

7.2. 백업 및 복구 (Database Backup & Recovery)
Supabase Backup

매주/매월 자동 스냅샷 생성(유료 플랜 시)

필요 시 Supabase 콘솔에서 Export 기능 사용 (CSV/SQL)

이미지 파일 백업

Supabase Storage → 로컬 또는 별도 S3 버킷에 주기적으로 다운로드 백업

7.3. 의존성 업데이트 (Dependencies)
Next.js, Tailwind 등 패키지

3~6개월 단위로 주요 버전 체크 후 업데이트

Vercel Preview 배포 → QA → Production 배포 순서

Supabase 라이브러리

@supabase/supabase-js 최신 버전으로 유지

보안 패치

npm audit, GitHub Dependabot Alerts 활용

7.4. 모니터링 & 로깅 (Monitoring & Logging)
Vercel Analytics

페이지뷰, 응답 속도, 오류율 간단 모니터링

Sentry (선택)

React 에러 추적

Admin 페이지 에러 로깅

Supabase Logs

SQL 쿼리 실행 로그

Auth 로그인/로그아웃 이벤트

7.5. 비용 관리 (Cost Management)
Vercel

Hobby (무료) → 트래픽 급증 시 Pro ($20/user·월) 검토

초과 빌드 시간/대역폭 모니터링

Supabase

Free Tier: 500MB DB, 1GB Storage, 월 2백만 리소스 요청

사용량 증가 시 Pro 플랜 ($25~50/월) 업그레이드

도메인/SSL

Vercel 기본 제공 SSL

기간 만료 전 도메인 갱신 안내

8. 배포 & CI/CD
8.1. Git 브랜치 전략
main 브랜치: Production 배포용

develop 브랜치 (선택): 개발 중간 통합

Feature 브랜치: 각 기능별 (예: feature/admin-dashboard)

8.2. Vercel 설정
GitHub/GitLab/Bitbucket 저장소 연결

Environment Variables 설정

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY (서버 사이드에서만 사용)

빌드 & 배포 설정

Build Command: npm run build

Output Directory: .next

자동 프리뷰 배포

PR 생성 시 Vercel Preview 배포 URL 생성 → QA/검수 용도로 사용

Production 배포

main 브랜치에 머지될 때 자동 배포

9. 비기능 요구사항 (Non-functional Requirements)
9.1. 성능 (Performance)
First Contentful Paint (FCP): 1.5s 이하 유지

Largest Contentful Paint (LCP): 2.5s 이하

이미지 최적화 (WebP, next/image 사용)

코드 스플리팅(dynamic import)

인터랙티브 (TTI): 3s 이하

불필요한 모션 스크립트 최소화

핵심 콘텐츠 우선 로드

9.2. 보안 (Security)
HTTPS 강제 적용 (Vercel 기본 SSL)

CSP(Content Security Policy) 헤더 설정

XSS 방어

외부 입력(리뷰·공지 작성) 시 Sanitization 적용

CSRF 방어

Supabase Auth가 자동 관리하나, Next.js API Route의 경우 csrf 토큰 체크(필요 시)

비밀번호 정책

최소 8자리, 영문·숫자 조합 권장

9.3. 접근성 (Accessibility, a11y)
WCAG 2.1 AA 수준 준수

명확한 대비(Contrast Ratio ≥ 4.5:1)

버튼·링크 키보드 포커스 스타일 제공

이미지 alt 속성 전부 입력

ARIA 속성(예: aria-label, role) 적절히 사용

반응형 디자인

모바일·태블릿·데스크톱 레이아웃 최적화

터치 영역(버튼·링크) 최소 40×40px

9.4. 확장성 (Scalability)
컴포넌트 재사용

Atomic Design(Atoms/Molecules/Organisms) 패턴 권장

데이터베이스 스키마

신규 기능(예: 행사 예약, 요금제 관리) 추가 시 테이블 확장 용이하도록 설계

Supabase RLS 정책

다중 관리자, 역할 분리 시 유연하게 정책 추가 가능

10. 결론 및 다음 단계
컨텐츠·페이지 구성 확정

Front-end 정보성 페이지(홈, 객실, 갤러리, 후기, 공지, 위치, 문의) 목록 최종 확정

관리자 페이지 CRUD 범위(갤러리·후기·공지) 확인

디자인 시안 제작

컨셉(예: 클린 미니멀리즘, 네이처 인스파이어 등) 선택 후, 와이어프레임 → 하이파이 시안

데이터베이스 및 Supabase 설정

테이블(갤러리, 후기, 공지, 관리자) 생성

인증 설정(관리자 계정)

프론트엔드 구현 (Next.js + Tailwind)

각 페이지 컴포넌트 작성

Supabase Client 연동 (CRUD API)

관리자 페이지 구현

로그인/인증 로직

CRUD UI 및 Supabase 연동

QA 및 테스트

기능 테스트(로그인/CRUD/페이지 렌더링)

반응형·접근성·성능 테스트

배포 & 모니터링

Vercel 환경변수 설정 → Production 배포

Sentry(선택) / Vercel Analytics 도입

사후 유지보수

콘텐츠 업데이트(관리자 페이지를 통해 실시간 반영)

패키지·보안 패치

주기적 백업 및 비용 모니터링