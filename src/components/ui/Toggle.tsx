type ToggleProps = {
  checked?: boolean;
};

export default function Toggle({ checked = false }: ToggleProps) {
  return (
    <button type="button" className={`relative h-10 w-[66px] rounded-full ${checked ? "bg-[#f6d8b0]" : "bg-[#d3d2d8]"}`}>
      <span className={`absolute top-1 h-8 w-8 rounded-full ${checked ? "right-1 bg-gradient-to-r from-amber to-orange" : "left-1 bg-[#adabb6]"}`} />
    </button>
  );
}