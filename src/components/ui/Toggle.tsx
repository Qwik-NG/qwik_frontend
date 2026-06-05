type ToggleProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "sm" | "md" | "lg";
  ariaLabelChecked?: string;
  ariaLabelUnchecked?: string;
  className?: string;
};

import { useEffect, useState } from "react";

const sizeClasses = {
  sm: {
    track: "h-[24px] w-[44px] p-[2px]",
    thumb: "h-[20px] w-[20px]",
  },
  md: {
    track: "h-10 w-[66px] p-1",
    thumb: "h-8 w-8",
  },
  lg: {
    track: "h-[42px] w-[78px] p-[4px]",
    thumb: "h-[34px] w-[34px]",
  },
} as const;

export default function Toggle({
  checked,
  defaultChecked = false,
  onCheckedChange,
  size = "md",
  ariaLabelChecked = "Disable option",
  ariaLabelUnchecked = "Enable option",
  className = "",
}: ToggleProps) {
  const isControlled = typeof checked === "boolean";
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  useEffect(() => {
    if (!isControlled) {
      setInternalChecked(defaultChecked);
    }
  }, [defaultChecked, isControlled]);

  const isChecked = isControlled ? checked : internalChecked;
  const currentSize = sizeClasses[size];

  const handleClick = () => {
    const nextChecked = !isChecked;

    if (!isControlled) {
      setInternalChecked(nextChecked);
    }

    onCheckedChange?.(nextChecked);
  };

  return (
    <button
      type="button"
      className={`flex items-center rounded-full transition ${currentSize.track} ${isChecked ? "justify-end bg-gradient-to-r from-amber/30 to-orange/20" : "justify-start bg-[#d3d2d8]"} ${className}`.trim()}
      onClick={handleClick}
      aria-label={isChecked ? ariaLabelChecked : ariaLabelUnchecked}
      aria-pressed={isChecked}
    >
      <span className={`${currentSize.thumb} rounded-full ${isChecked ? "bg-gradient-to-r from-amber to-orange" : "bg-[#adabb6]"}`} />
    </button>
  );
}