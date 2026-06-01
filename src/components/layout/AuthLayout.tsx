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
    <div className="min-h-screen overflow-hidden bg-[#f3f3f5] font-outfit text-[#1f1f29]">
      <header className={cn("flex items-center justify-between px-[60px] pt-[48px]", headerClassName)}>
        <button onClick={onLogoClick} className="text-[56px] font-normal leading-none text-[#ff8300]">
          qwik
        </button>
        <p className="text-[16px] text-[#9a99a6]">
          New here?{" "}
          <button className="text-[#ff8f00]" onClick={onCreateAccountClick}>
            Create an account
          </button>
        </p>
      </header>

      <main className="mx-auto flex h-[calc(100vh-120px)] w-full max-w-[1728px] items-center justify-center px-4 pb-8">
        <section className={cn("mx-auto rounded-[24px] bg-white px-[22px] pb-[24px] pt-[18px]", cardClassName)}>
          <h2 className={cn("mb-[14px] text-center text-[28px] font-normal leading-[1.05] text-[#22222b]", titleClassName)}>
            {title}
          </h2>
          {children}
        </section>
      </main>
    </div>
  );
}