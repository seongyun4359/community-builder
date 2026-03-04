import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 히어로 섹션 */}
      <section className="flex flex-col items-center gap-6 px-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            나만의 커뮤니티를 만들어보세요
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            테마를 선택하고, 게시판을 구성하고,
            <br />
            멤버들과 함께 성장하는 공간
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/signup"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            시작하기
          </Link>
          <Link
            href="/boards"
            className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            둘러보기
          </Link>
        </div>
      </section>

      {/* 기능 소개 섹션 */}
      <section className="grid gap-4 px-4 py-8 sm:grid-cols-3">
        <FeatureCard
          icon="🎨"
          title="테마 선택"
          description="다양한 테마로 커뮤니티의 분위기를 설정하세요"
        />
        <FeatureCard
          icon="📋"
          title="게시판 관리"
          description="공지, 자유글, 갤러리 등 게시판을 자유롭게 구성"
        />
        <FeatureCard
          icon="👥"
          title="등급별 권한"
          description="멤버 등급에 따라 세밀한 권한을 부여하세요"
        />
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-sm">
      <span className="text-2xl">{icon}</span>
      <h3 className="text-base font-semibold text-card-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
