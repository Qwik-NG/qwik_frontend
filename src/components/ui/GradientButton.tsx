import type { ButtonHTMLAttributes } from "react";

type GradientButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "compact";
  fullWidth?: boolean;
  className?: string;
};

export function GradientButton({
  variant = "default",
  fullWidth = true,
  className = "",
  children,
  ...props
}: GradientButtonProps) {
  const baseClasses = "bg-gradient-to-r from-amber to-orange text-white shadow-glow rounded-[8px] transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeClasses = variant === "compact" 
    ? "h-[48px] px-4 text-[14px]"
    : "h-[52px] px-[18px] text-[16px]";
  
  const widthClasses = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${widthClasses} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
