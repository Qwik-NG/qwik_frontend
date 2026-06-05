import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function BaseIcon({ className = "h-[46px] w-[46px]", children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export function CarsIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="9" y="20" width="30" height="11" rx="4" fill="#F28C28" />
      <path d="M15 20l4-6h10l4 6" stroke="#1F1D27" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="17" cy="32" r="3" fill="#1F1D27" />
      <circle cx="31" cy="32" r="3" fill="#1F1D27" />
      <path d="M15 24h4M29 24h4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function PhonesIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="14" y="9" width="20" height="30" rx="5" fill="#5B7BE3" />
      <rect x="18" y="13" width="12" height="18" rx="2" fill="#fff" fillOpacity="0.92" />
      <circle cx="24" cy="34.5" r="1.5" fill="#fff" />
    </BaseIcon>
  );
}

export function JobsIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="10" y="15" width="28" height="20" rx="4" fill="#6D6A74" />
      <path d="M18 15v-3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" stroke="#1F1D27" strokeWidth="2" />
      <path d="M10 23h28" stroke="#fff" strokeWidth="2" />
      <path d="M22 23v4h4v-4" fill="#F3F3F5" />
    </BaseIcon>
  );
}

export function AgricultureIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M23 11c5 2 8 7 8 13 0 7-5 12-11 12-4 0-7-3-7-7 0-8 6-14 10-18Z" fill="#49A86E" />
      <path d="M24 13c-1 9-1 17 0 24" stroke="#F7FFF9" strokeWidth="2" strokeLinecap="round" />
      <path d="M19 24c2 1 4 1 6 0M18 29c2 1 5 1 8 0" stroke="#F7FFF9" strokeWidth="2" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function SportsIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="24" cy="24" r="13" fill="#1F1D27" />
      <path d="M24 11a13 13 0 0 1 9 4l-4 3h-10l-4-3a13 13 0 0 1 9-4Z" fill="#fff" />
      <path d="M14 17l3 9-5 4a13 13 0 0 1 2-13Z" fill="#fff" />
      <path d="M34 17a13 13 0 0 1 2 13l-5-4 3-9Z" fill="#fff" />
      <path d="M19 29h10l3 7a13 13 0 0 1-16 0l3-7Z" fill="#fff" />
    </BaseIcon>
  );
}

export function FashionIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M18 13l4 4h4l4-4 5 6-4 4v14H13V23l-4-4 5-6Z" fill="#C67A3E" />
      <path d="M22 17l-2 20M26 17l2 20" stroke="#FCEFDA" strokeWidth="2" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function ElectronicsIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="10" y="12" width="28" height="19" rx="3" fill="#5F6071" />
      <rect x="14" y="16" width="20" height="11" rx="2" fill="#E8F0FF" />
      <path d="M18 36h12M21 31v5M27 31v5" stroke="#1F1D27" strokeWidth="2" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function PropertiesIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M12 22l12-10 12 10v14a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V22Z" fill="#58A785" />
      <path d="M19 38V27h10v11" fill="#E8FFF6" />
      <path d="M19 22h4v4h-4zM25 22h4v4h-4z" fill="#E8FFF6" />
    </BaseIcon>
  );
}

export function FurnitureIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="11" y="20" width="26" height="10" rx="4" fill="#A56DB2" />
      <rect x="14" y="16" width="20" height="7" rx="3.5" fill="#C58AD5" />
      <path d="M16 30v8M32 30v8" stroke="#6F4A79" strokeWidth="2.5" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function LaptopIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="13" y="12" width="22" height="15" rx="2" fill="#7B63B9" />
      <rect x="16" y="15" width="16" height="9" rx="1.5" fill="#EEF0FF" />
      <path d="M9 30h30l-2 4H11l-2-4Z" fill="#4F4470" />
    </BaseIcon>
  );
}

export function BeautyIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="18" y="11" width="12" height="8" rx="3" fill="#B17AA0" />
      <path d="M20 19h8l-1 17h-6l-1-17Z" fill="#D6A5C7" />
      <path d="M17 19h14" stroke="#8B5D80" strokeWidth="2" strokeLinecap="round" />
    </BaseIcon>
  );
}

export function MoreIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="17" cy="24" r="3" fill="#1F1D27" />
      <circle cx="24" cy="24" r="3" fill="#1F1D27" />
      <circle cx="31" cy="24" r="3" fill="#1F1D27" />
    </BaseIcon>
  );
}