export function Tab({ label, active = false, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`text-[18px] sm:text-[22px] ${active ? "text-[#1f1d27]" : "text-[#9794a1]"}`} type="button">
      {label}
    </button>
  );
}
