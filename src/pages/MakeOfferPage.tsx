import { useState } from "react";

const quickPrices = ["₦15,000,000", "₦13,000,000", "₦10,000,000", "₦8,000,000"];

export default function MakeOfferPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [price, setPrice] = useState("");

  return (
    <div className="grid min-h-screen place-items-center bg-black p-4">
      <div className="w-full max-w-[370px] rounded-[28px] bg-white p-6">
        <h1 className="mb-6 text-center text-[36px] font-medium text-[#23222b]">Make an offer</h1>

        <div className="mb-6 grid grid-cols-2 gap-3">
          {quickPrices.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setSelected(p);
                setPrice(p);
              }}
              className={`h-[48px] rounded-[10px] text-[18px] ${
                selected === p ? "bg-[#ffe6bf] text-[#ff970f]" : "bg-[#f6efe4] text-[#ff970f]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <label className="mb-2 block text-[33px] text-[#9b98a4]">Enter Price</label>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="What are you selling?"
          className="mb-6 h-[48px] w-full rounded-[10px] border border-[#e2e0e8] bg-[#f7f7f9] px-3 text-[17px] text-[#85828e] outline-none"
        />

        <button type="button" className="h-[50px] w-full rounded-[10px] bg-[#ececf0] text-[34px] text-[#b9b7bf]">
          Send offer
        </button>
      </div>
    </div>
  );
}
