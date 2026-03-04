import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative flex flex-col items-center gap-6 px-4 py-16 text-center">
        <div className="overflow-hidden rounded-2xl">
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=640&q=80"
            alt="커뮤니티"
            width={640}
            height={260}
            className="h-[200px] w-full object-cover sm:h-[260px]"
            priority
          />
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

      <section className="grid gap-4 px-4 py-8 sm:grid-cols-3">
        <FeatureCard
          imageSrc="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80"
          title="테마 선택"
          description="다양한 테마로 커뮤니티의 분위기를 설정하세요"
        />
        <FeatureCard
          imageSrc="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80"
          title="게시판 관리"
          description="공지, 자유글, 갤러리 등 게시판을 자유롭게 구성"
        />
        <FeatureCard
          imageSrc="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80"
          title="등급별 권한"
          description="멤버 등급에 따라 세밀한 권한을 부여하세요"
        />
      </section>
    </div>
  );
}

function FeatureCard({
  imageSrc,
  title,
  description,
}: {
  imageSrc: string;
  title: string;
  description: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-sm">
      <Image
        src={imageSrc}
        alt={title}
        width={400}
        height={160}
        className="h-[120px] w-full object-cover"
      />
      <div className="flex flex-col gap-1 p-4">
        <h3 className="text-base font-semibold text-card-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
