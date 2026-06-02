import type { InputHTMLAttributes } from "react";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
};

export default function FormInput({
  label,
  error,
  containerClassName = "",
  labelClassName = "",
  inputClassName = "",
  className = "",
  ...props
}: FormInputProps) {
  const baseInputClass =
    "h-[48px] w-full rounded-[10px] border border-[#dedee1] bg-[#ececee] px-3 text-[14px] text-[#20212a] placeholder:text-[#a3a2ad] focus:outline-none";

  return (
    <div className={`mb-[14px] ${containerClassName}`}>
      {label && <label className={`mb-2 block text-[14px] text-[#94919d] ${labelClassName}`}>{label}</label>}
      <input {...props} className={`${baseInputClass} ${inputClassName} ${className}`} />
      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  );
}
