import type { ReactNode } from "react";

function cn(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

type AuthLayoutProps = {
  title: string;
  children: ReactNode;
  onLogoClick: () => void;
  onCreateAccountClick: () => void;
  cardClassName?: string;
  titleClassName?: string;
  headerClassName?: string;
};

export default function AuthLayout({
  title,
  children,
  onLogoClick,
  onCreateAccountClick,
  cardClassName,
  titleClassName,
  headerClassName,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f3f3f5] font-outfit text-[#1f1f29]">
      <header className={cn("flex items-start justify-between gap-4 px-4 pt-5 sm:px-8 sm:pt-7 lg:px-[60px] lg:pt-[48px]", headerClassName)}>
        <button onClick={onLogoClick} className="shrink-0 text-[34px] font-normal leading-none text-[#ff8300] sm:text-[40px] lg:text-[56px]">
          qwik
        </button>
        <p className="max-w-[210px] text-right text-[13px] leading-[1.35] text-[#9a99a6] sm:max-w-none sm:text-[16px]">
          New here?{" "}
          <button className="text-[#ff8f00]" onClick={onCreateAccountClick}>
            Create an account
          </button>
        </p>
      </header>

      <main className="mx-auto flex min-h-[calc(100dvh-84px)] w-full max-w-[1728px] items-center justify-center px-4 py-8 sm:min-h-[calc(100dvh-100px)] lg:min-h-[calc(100dvh-120px)]">
        <section className={cn("mx-auto max-w-full rounded-[24px] bg-white px-[22px] pb-[24px] pt-[18px]", cardClassName)}>
          <h2 className={cn("mb-[14px] text-center text-[28px] font-normal leading-[1.05] text-[#22222b]", titleClassName)}>
            {title}
          </h2>
          {children}
        </section>
      </main>
    </div>
  );
}
