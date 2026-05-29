import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const canLogin = password.length >= 6;

  return (
    <div className="min-h-screen overflow-hidden bg-[#f3f3f5] font-outfit text-[#1f1f29]">
      <header className="flex items-center justify-between px-[60px] pt-[48px]">
        <button onClick={() => navigate("/")} className="text-[56px] font-normal leading-none text-[#ff8300]">
          qwik
        </button>
        <p className="text-[16px] text-[#9a99a6]">
          New here?{" "}
          <button className="text-[#ff8f00]" onClick={() => navigate("/signup")}>
            Create an account
          </button>
        </p>
      </header>

      <main className="mx-auto flex h-[calc(100vh-120px)] w-full max-w-[1728px] items-center justify-center px-4 pb-8">
        <section className="mx-auto w-[430px] rounded-[24px] bg-white px-[22px] pb-[24px] pt-[18px]">
          <h2 className="mb-[14px] whitespace-nowrap text-center text-[28px] font-normal leading-[1.05] text-[#22222b]">Log in to your account</h2>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-[14px] h-[48px] w-full rounded-[10px] border border-[#dedee1] bg-[#ececee] px-3 text-[14px] text-[#20212a] placeholder:text-[#a3a2ad] focus:outline-none"
          />

          <div className="mb-[16px] flex items-center justify-between">
            <label className="flex items-center gap-2 text-[12px] text-[#9a99a6]">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-[16px] w-[16px]" />
              <span>Remember me</span>
            </label>
            <button onClick={() => navigate("/recover-password")} className="text-[12px] text-[#9a99a6]">
              Forgot Password?
            </button>
          </div>

          <button
            disabled={!canLogin}
            onClick={() => navigate("/welcome")}
            className={`h-[48px] w-full rounded-[10px] text-[14px] ${
              canLogin ? "bg-[#3f5db2] text-white" : "bg-[#d8d8dc] text-[#b5b4be]"
            }`}
          >
            Login
          </button>
        </section>
      </main>
    </div>
  );
}
