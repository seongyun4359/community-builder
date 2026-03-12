# 커뮤니티 빌더

누구나 쉽게 만드는 공동체, 커뮤니티 빌더

## 기능

- 최종관리자가 테마를 선택하여 커뮤니티 생성
- 등급별 권한 부여 (최종관리자 → 관리자 → 운영자 → 일반회원)
- 게시판, 공지, 게시글, 댓글 기능
- 모임(이벤트) 생성/조회
- 모임(이벤트)별 채팅방 (`/{communityId}/events/{eventId}/chat`)

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript (strict mode)
- **스타일링**: TailwindCSS 4
- **UI**: MUI (`@mui/material`) + Emotion
- **상태/데이터**: React Query, Zustand
- **DB**: MongoDB (Atlas) + Mongoose
- **애니메이션**: Framer Motion

## 시작하기

### 1) 설치

```bash
npm install
```

### 2) 환경 변수

이 프로젝트는 `.env*` 파일을 커밋하지 않습니다. 로컬에서만 설정하세요.

- **필수**
  - `MONGODB_URI`: MongoDB Atlas 연결 문자열
- **선택(권장)**
  - `NEXT_PUBLIC_BASE_URL`: 배포/로컬 base url (기본값: `http://localhost:3000`)
  - `AUTH_SECRET`: 세션 토큰 서명용 시크릿 (프로덕션에서는 필수)
- **선택(카카오 로그인/공유)**
  - `KAKAO_REST_API_KEY`
  - `KAKAO_REDIRECT_URI`
  - `KAKAO_CLIENT_SECRET` (선택)
  - `NEXT_PUBLIC_KAKAO_JS_KEY` (카카오톡 공유용 JS 키)

권장: `.env.example`를 복사해 `.env.local`로 만들어 사용하세요.

### 3) 실행

```bash
npm run dev
```

`http://localhost:3000`에서 확인할 수 있습니다.

## 스크립트

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## 디렉토리 구조

```
src/
├── app/
│   ├── (main)/        # 일반 회원 영역
│   ├── (auth)/        # 인증 관련
│   ├── (admin)/       # 관리자 영역
│   ├── [communityId]/
│   │   ├── (user)/     # 커뮤니티 유저 영역 (Header+BottomNav)
│   │   ├── (chat)/     # 채팅 전용 레이아웃 (BottomNav 없음)
│   │   └── admin/      # 커뮤니티 관리자 영역
│   ├── layout.tsx     # 루트 레이아웃
│   └── globals.css    # 글로벌 스타일 + 테마 토큰
├── components/
│   ├── ui/            # 공통 UI 컴포넌트
│   ├── layout/        # Header, BottomNav
│   ├── post/          # 게시글 관련
│   ├── comment/       # 댓글 관련
│   └── chat/          # 채팅 UI (버블/인풋/룸 시트)
├── models/             # Mongoose 모델
├── services/           # fetch 래퍼(API 호출 레이어)
├── queries/            # React Query 키/훅
├── stores/             # Zustand 스토어
├── lib/               # 유틸리티
├── types/             # TypeScript 타입
└── hooks/             # 커스텀 훅
```

## 채팅(모임별)

- **URL**: `/{communityId}/events/{eventId}/chat`
- **API**:
  - `GET /api/communities/[slug]/events/[eventId]/chat`
  - `POST /api/communities/[slug]/events/[eventId]/chat/messages`

## 트러블슈팅

- **`MONGODB_URI 환경 변수가 설정되지 않았습니다.`**
  - `.env.local`에 `MONGODB_URI`를 설정하세요.
- **`Made-with: Cursor` 같은 문구가 커밋에 붙음**
  - 커밋 정책상 금지입니다. 로컬 훅으로 제거하거나(예: `.git/hooks/commit-msg`) 커밋 템플릿/훅 설정을 점검하세요.
