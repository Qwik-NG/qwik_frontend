export function NewBadge() {
  return (
    <span className="rounded-btn bg-badge-bg px-2.5 py-1 text-[14px] text-orange font-medium">
      New
    </span>
  );
}

export function Badge({ 
  label, 
  variant = "default" 
}: { 
  label: string; 
  variant?: "default" | "success" | "error" | "info" 
}) {
  const variantClasses = {
    default: "bg-badge-bg text-orange",
    success: "bg-green-100 text-success",
    error: "bg-red-100 text-error",
    info: "bg-blue-100 text-info"
  };

  return (
    <span className={`rounded-btn px-2.5 py-1 text-[14px] font-medium ${variantClasses[variant]}`}>
      {label}
    </span>
  );
}
