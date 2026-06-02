import type { SelectHTMLAttributes, ReactNode } from "react";

type FormSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options?: Array<{ value: string | number; label: string }>;
  children?: ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
};

export default function FormSelect({
  label,
  error,
  options = [],
  children,
  containerClassName = "",
  labelClassName = "",
  selectClassName = "",
  className = "",
  ...props
}: FormSelectProps) {
  const baseSelectClass =
    "h-[48px] w-full rounded-btn border border-[#dedee1] bg-[#ececee] px-3 text-[14px] text-[#20212a] focus:outline-none";

  return (
    <div className={`mb-[14px] ${containerClassName}`}>
      {label && <label className={`mb-2 block text-[14px] text-[#94919d] ${labelClassName}`}>{label}</label>}
      <select {...props} className={`${baseSelectClass} ${selectClassName} ${className}`}>
        {children ? (
          children
        ) : (
          <>
            <option value="">Select an option</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </>
        )}
      </select>
      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  );
}
