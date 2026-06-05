import type { ButtonHTMLAttributes } from "react";

type FormButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadingText?: string;
  containerClassName?: string;
  buttonClassName?: string;
};

export default function FormButton({
  isLoading = false,
  loadingText = "Loading...",
  disabled = false,
  containerClassName = "",
  buttonClassName = "",
  className = "",
  children,
  ...props
}: FormButtonProps) {
  const isDisabledState = disabled || isLoading;

  const baseButtonClass =
    "h-[48px] w-full rounded-btn text-[14px] font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  const stateClass = isDisabledState
    ? "bg-[#d8d8dc] text-[#b5b4be] cursor-not-allowed"
    : "bg-[#3f5db2] text-white hover:bg-[#354aa3] active:scale-[0.99]";

  return (
    <div className={containerClassName}>
      <button
        {...props}
        disabled={isDisabledState}
        className={`${baseButtonClass} ${stateClass} ${buttonClassName} ${className}`}
      >
        {isLoading ? loadingText : children}
      </button>
    </div>
  );
}
