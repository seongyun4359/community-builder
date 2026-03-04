# 커뮤니티 빌더

누구나 쉽게 만드는 공동체, 커뮤니티 빌더

## 기능

- 최종관리자가 테마를 선택하여 커뮤니티 생성
- 등급별 권한 부여 (최종관리자 → 관리자 → 운영자 → 일반회원)
- 게시판, 공지, 게시글, 댓글 기능

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript (strict mode)
- **스타일링**: TailwindCSS 4
- **DB**: Supabase (연동 예정)

## 시작하기

```bash
npm install
npm run dev
```

`http://localhost:3000`에서 확인할 수 있습니다.

## 디렉토리 구조

```
src/
├── app/
│   ├── (main)/        # 일반 회원 영역
│   ├── (auth)/        # 인증 관련
│   ├── (admin)/       # 관리자 영역
│   ├── layout.tsx     # 루트 레이아웃
│   └── globals.css    # 글로벌 스타일 + 테마 토큰
├── components/
│   ├── ui/            # 공통 UI 컴포넌트
│   ├── layout/        # Header, BottomNav
│   ├── post/          # 게시글 관련
│   └── comment/       # 댓글 관련
├── lib/               # 유틸리티
├── types/             # TypeScript 타입
└── hooks/             # 커스텀 훅
```
