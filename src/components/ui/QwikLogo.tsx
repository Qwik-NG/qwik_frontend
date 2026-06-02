export function QwikLogo() {
  return (
    <button className="relative h-[92px] w-[92px] shrink-0 rounded-full bg-white" aria-label="Qwik home">
      <span className="absolute left-[33px] top-[12px] h-[17px] w-[29px] rounded-t-full border-x-[5px] border-t-[5px] border-amber" />
      <span className="absolute left-[14px] top-[35px] grid h-[20px] w-[51px] place-items-center rounded-[8px] bg-orange text-[10px] font-semibold text-white">
        Qwik
      </span>
      <span className="absolute right-[19px] top-[52px] grid h-[31px] w-[31px] rotate-[-22deg] place-items-center rounded-[8px] bg-[#0b6a48] text-[9px] text-white">
        .ng
      </span>
      <span className="absolute bottom-[13px] left-[28px] h-2.5 w-2.5 rounded-full bg-orange" />
      <span className="absolute bottom-[13px] left-[54px] h-2.5 w-2.5 rounded-full bg-orange" />
    </button>
  );
}
