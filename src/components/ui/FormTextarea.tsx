import type { TextareaHTMLAttributes } from "react";

type FormTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
};

export default function FormTextarea({
  label,
  error,
  containerClassName = "",
  labelClassName = "",
  textareaClassName = "",
  className = "",
  ...props
}: FormTextareaProps) {
  const baseTextareaClass =
    "w-full rounded-[10px] border border-[#dedee1] bg-[#ececee] px-3 py-3 text-[14px] text-[#20212a] placeholder:text-[#a3a2ad] focus:outline-none resize-none";

  return (
    <div className={`mb-[14px] ${containerClassName}`}>
      {label && <label className={`mb-2 block text-[14px] text-[#94919d] ${labelClassName}`}>{label}</label>}
      <textarea {...props} className={`${baseTextareaClass} ${textareaClassName} ${className}`} />
      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  );
}
