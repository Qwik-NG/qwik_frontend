import type { ReactNode } from "react";

function cn(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onLogoClick: () => void;
  topPromptText?: string;
  topPromptActionText?: string;
  onTopPromptActionClick?: () => void;
  cardClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  mainClassName?: string;
};

export default function AuthLayout({
  title,
  subtitle,
  children,
  onLogoClick,
  topPromptText,
  topPromptActionText,
  onTopPromptActionClick,
  cardClassName,
  titleClassName,
  subtitleClassName,
  mainClassName,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f4f1] font-outfit text-[#1f1f29]">
      <main className={cn("grid min-h-screen w-full grid-cols-1 md:grid-cols-[11fr_10fr] lg:grid-cols-[3fr_2fr]", mainClassName)}>
        <section className="relative hidden items-center justify-center overflow-hidden bg-[#efe2ce] px-10 py-16 md:flex lg:px-16">
          <img
            src="/auth-illustration.PNG"
            alt="Qwik marketplace illustration"
            className="h-auto max-h-[78vh] w-full max-w-[760px] object-contain"
            loading="eager"
          />
        </section>

        <section className="flex items-center justify-center px-4 py-8 sm:px-7 md:px-8 lg:px-10">
          <div className="w-full max-w-[540px] rounded-[30px] bg-white/95 p-6 shadow-[0_18px_65px_rgba(39,34,24,0.12)] backdrop-blur-sm sm:p-8 lg:p-10">
            <button
              onClick={onLogoClick}
              type="button"
              aria-label="Go to home"
              className="mb-4 text-left text-[42px] font-semibold leading-none text-[#ff8300] transition-opacity duration-200 hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2"
            >
              QWIK
            </button>

            {(topPromptText && topPromptActionText && onTopPromptActionClick) && (
              <p className="mb-6 text-[14px] leading-[1.45] text-[#7a7884]">
                {topPromptText}{" "}
                <button
                  className="font-semibold text-[#ff8f00] transition-colors duration-200 hover:text-[#e67f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2"
                  onClick={onTopPromptActionClick}
                  type="button"
                >
                  {topPromptActionText}
                </button>
              </p>
            )}

            <h1 className={cn("text-[32px] font-semibold leading-tight tracking-[-0.02em] text-[#252431] sm:text-[36px]", titleClassName)}>{title}</h1>
            {subtitle && (
              <p className={cn("mb-6 mt-2 text-[14px] leading-[1.5] text-[#6f6d78]", subtitleClassName)}>{subtitle}</p>
            )}

            <div className="transition-opacity duration-300">{children}</div>
          </div>
        </section>
      </main>
    </div>
  );
}
