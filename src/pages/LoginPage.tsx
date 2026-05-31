import { useState } from "react";
import { useNavigate } from "react-router-dom";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.6-5.5 3.6A6 6 0 0 1 12 5.8c2.3 0 3.8 1 4.6 1.8l3.1-3A10.5 10.5 0 0 0 12 1.5a10.5 10.5 0 1 0 0 21c6 0 10-4.2 10-10.1 0-.7-.1-1.3-.2-1.9H12Z" />
      <path fill="#34A853" d="M3 7.2 6.6 9.8A6 6 0 0 1 12 5.8c2.3 0 3.8 1 4.6 1.8l3.1-3A10.5 10.5 0 0 0 3 7.2Z" />
      <path fill="#FBBC05" d="M12 22.5c2.8 0 5.2-.9 6.9-2.5l-3.2-2.6c-.9.6-2.1 1-3.7 1a6 6 0 0 1-5.6-4L3 17a10.5 10.5 0 0 0 9 5.5Z" />
      <path fill="#4285F4" d="M22 12.4c0-.7-.1-1.3-.2-1.9H12v3.9h5.5c-.3 1.3-1.1 2.3-2.2 3l3.2 2.6c1.9-1.8 3.5-4.4 3.5-7.6Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v5h3v-5h2.2l.8-3H13V9c0-.6.4-1 1-1Z" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const canContinue = /\S+@\S+\.\S+/.test(email);

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

          <button
            className="mb-[10px] flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#d9d9dc] text-[14px] text-[#20212a]"
            onClick={() => window.alert("Google login clicked")}
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          <button
            className="mb-[16px] flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#3f5db2] text-[14px] text-white"
            onClick={() => window.alert("Facebook login clicked")}
          >
            <FacebookIcon />
            <span>Continue with Facebook</span>
          </button>

          <div className="mb-[14px] flex items-center gap-3 text-[#7f7e88]">
            <span className="h-px flex-1 bg-[#d1d1d6]" />
            <span className="text-[12px]">or sign in with email</span>
            <span className="h-px flex-1 bg-[#d1d1d6]" />
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-[16px] h-[48px] w-full rounded-[10px] border border-[#dedee1] bg-[#ececee] px-3 text-[14px] text-[#20212a] placeholder:text-[#a3a2ad] focus:outline-none"
          />

          <button
            disabled={!canContinue}
            onClick={() => navigate("/login-password")}
            className={`h-[48px] w-full rounded-[10px] text-[14px] ${
              canContinue ? "bg-[#3f5db2] text-white" : "bg-[#d8d8dc] text-[#b5b4be]"
            }`}
          >
            Next
          </button>
        </section>
      </main>
    </div>
  );
}
