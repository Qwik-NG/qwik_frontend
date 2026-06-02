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
    "h-[48px] w-full rounded-[10px] text-[14px] font-medium transition-colors";

  const stateClass = isDisabledState
    ? "bg-[#d8d8dc] text-[#b5b4be] cursor-not-allowed"
    : "bg-[#3f5db2] text-white hover:bg-[#354aa3]";

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
