import type { KeyboardEvent, ReactNode } from "react";

export type PromotionPaymentMethod = "paystack" | "bank_transfer";

const PROMOTION_PAYMENT_METHODS: Array<{
  id: PromotionPaymentMethod;
  title: string;
  description: string;
}> = [
  {
    id: "paystack",
    title: "Pay with Paystack",
    description: "Cards, Bank Transfer, USSD and more",
  },
  {
    id: "bank_transfer",
    title: "Pay with Bank Transfer",
    description: "Manually transfer to our bank account.",
  },
];

function PaymentLogo({ label }: { label: string }) {
  return <div className="rounded-[10px] bg-white px-4 py-2 text-[14px] font-semibold text-[#4b4b55] sm:text-[14px]">{label}</div>;
}

function RadioIndicator({ selected }: { selected: boolean }) {
  return (
    <span
      className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
        selected ? "border-[#ff6b1b] bg-[#ff6b1b]" : "border-[#c7c5d0] bg-white"
      }`}
      aria-hidden="true"
    >
      {selected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
    </span>
  );
}

function PaymentMethodCard({
  method,
  selected,
  onSelect,
  children,
}: {
  method: (typeof PROMOTION_PAYMENT_METHODS)[number];
  selected: boolean;
  onSelect: () => void;
  children?: ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`mt-4 w-full rounded-[18px] border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange sm:p-5 [&_*]:pointer-events-none ${
        selected ? "border-[#ff8e3b] bg-[#fff7ed] shadow-[0_10px_24px_rgba(255,151,21,0.12)]" : "border-[#d9d7de] bg-white hover:border-[#ff8e3b]"
      }`}
    >
      <div className="flex items-start gap-4">
        <RadioIndicator selected={selected} />
        <div className="min-w-0">
          <p className="text-[18px] font-semibold sm:text-[20px]">{method.title}</p>
          <p className="text-[14px] text-[#8f8b98] sm:text-[16px]">{method.description}</p>
        </div>
      </div>
      {children}
    </button>
  );
}

export function PromotionPaymentMethods({
  selectedPaymentMethod,
  onSelect,
}: {
  selectedPaymentMethod: PromotionPaymentMethod | null;
  onSelect: (method: PromotionPaymentMethod) => void;
}) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = PROMOTION_PAYMENT_METHODS.findIndex((method) => method.id === selectedPaymentMethod);
    const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + direction + PROMOTION_PAYMENT_METHODS.length) % PROMOTION_PAYMENT_METHODS.length;
    onSelect(PROMOTION_PAYMENT_METHODS[nextIndex].id);
  };

  return (
    <div role="radiogroup" aria-label="Promotion payment method" tabIndex={0} onKeyDown={handleKeyDown}>
      <PaymentMethodCard
        method={PROMOTION_PAYMENT_METHODS[0]}
        selected={selectedPaymentMethod === "paystack"}
        onSelect={() => onSelect("paystack")}
      >
        <div className="mt-4 rounded-[14px] bg-[#f2f2f5] p-4">
          <div className="flex flex-wrap gap-3">
            {["VISA", "GPay", "Apple Pay", "Mastercard"].map((label) => (
              <PaymentLogo key={label} label={label} />
            ))}
          </div>
          <p className="mt-4 text-[14px] text-[#9b98a3] sm:text-[14px]">You will be redirected to Paystack to complete your payment securely.</p>
        </div>
      </PaymentMethodCard>

      <PaymentMethodCard
        method={PROMOTION_PAYMENT_METHODS[1]}
        selected={selectedPaymentMethod === "bank_transfer"}
        onSelect={() => onSelect("bank_transfer")}
      />
    </div>
  );
}