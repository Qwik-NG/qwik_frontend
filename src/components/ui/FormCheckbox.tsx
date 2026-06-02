import type { InputHTMLAttributes } from "react";

type FormCheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
  checkboxClassName?: string;
};

export default function FormCheckbox({
  label,
  containerClassName = "",
  labelClassName = "",
  checkboxClassName = "",
  className = "",
  ...props
}: FormCheckboxProps) {
  const baseCheckboxClass = "h-[16px] w-[16px] rounded";

  return (
    <label className={`flex items-center gap-2 text-[12px] text-[#9a99a6] cursor-pointer ${containerClassName}`}>
      <input type="checkbox" {...props} className={`${baseCheckboxClass} ${checkboxClassName} ${className}`} />
      {label && <span className={labelClassName}>{label}</span>}
    </label>
  );
}
