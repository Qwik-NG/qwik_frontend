import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const isPhoneValid = useMemo(() => /^\+?\d{10,15}$/.test(phone.replace(/\s/g, "")), [phone]);
  const canCreate = fullName.trim().length >= 2 && isPhoneValid && password.length >= 6;

  return (
    <div className="min-h-screen overflow-hidden bg-[#f3f3f5] font-outfit text-[#1f1f29]">
      <header className="flex items-center justify-between px-[68px] pt-[46px]">
        <button onClick={() => navigate("/")} className="text-[50px] font-normal leading-none text-[#ff8300]">
          qwik
        </button>
        <p className="text-[15px] text-[#9a99a6]">
          New here?{" "}
          <button className="text-[#ff8f00]" onClick={() => navigate("/signup")}>
            Create an account
          </button>
        </p>
      </header>

      <main className="mx-auto flex h-[calc(100vh-124px)] w-full max-w-[1728px] items-center justify-center px-4 pb-8">
        <section className="mx-auto w-[540px] rounded-[24px] bg-white px-[26px] pb-[26px] pt-[18px]">
          <h2 className="mb-[14px] text-center text-[24px] font-normal leading-[1.1] text-[#22222b] whitespace-nowrap">
            Create a fresh account
          </h2>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mb-[12px] h-[54px] w-full rounded-[10px] border border-[#dedee1] bg-[#ececee] px-3 text-[11px] text-[#20212a] placeholder:text-[#a3a2ad] focus:outline-none"
          />

          <input
            type="tel"
            placeholder="Phone no."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mb-[12px] h-[54px] w-full rounded-[10px] border border-[#dedee1] bg-[#ececee] px-3 text-[11px] text-[#20212a] placeholder:text-[#a3a2ad] focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-[16px] h-[54px] w-full rounded-[10px] border border-[#dedee1] bg-[#ececee] px-3 text-[11px] text-[#20212a] placeholder:text-[#a3a2ad] focus:outline-none"
          />

          <button
            disabled={!canCreate}
            onClick={() => navigate("/singin")}
            className={`h-[54px] w-full rounded-[10px] text-[11px] ${
              canCreate ? "bg-[#3f5db2] text-white" : "bg-[#d8d8dc] text-[#b5b4be]"
            }`}
          >
            Create Account
          </button>
        </section>
      </main>
    </div>
  );
}
