import type { InputHTMLAttributes, ReactNode } from "react";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  rightAdornment?: ReactNode;
};

export default function FormInput({
  label,
  error,
  type = "text",
  containerClassName = "",
  labelClassName = "",
  inputClassName = "",
  rightAdornment,
  className = "",
  id,
  ...props
}: FormInputProps) {
  const baseInputClass =
    "h-[52px] w-full rounded-[12px] border border-[#dbd8d1] bg-[#fdfdfd] px-4 text-[14px] text-[#20212a] placeholder:text-[#9c98a3] transition-all duration-200 focus:border-[#ffb357] focus:outline-none focus:ring-2 focus:ring-[#ffedd2]";

  const inputId = id ?? props.name;

  return (
    <div className={`mb-[14px] ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className={`mb-2 block text-[13px] font-medium text-[#676472] ${labelClassName}`}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={type}
          {...props}
          className={`${baseInputClass} ${rightAdornment ? "pr-12" : ""} ${inputClassName} ${className}`}
        />
        {rightAdornment && <div className="absolute inset-y-0 right-0 flex items-center pr-3">{rightAdornment}</div>}
      </div>
      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  );
}
