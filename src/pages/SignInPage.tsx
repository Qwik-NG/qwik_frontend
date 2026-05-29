import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const canContinue = isEmailValid && acceptedTerms;

  return (
    <div className="min-h-screen overflow-hidden bg-[#f3f3f5] font-outfit text-[#1f1f29]">
      <header className="flex items-center justify-between px-[68px] pt-[46px]">
        <h1 className="text-[50px] font-normal leading-none text-[#ff8300]">qwik</h1>
        <p className="text-[15px] text-[#9a99a6]">
          New here?{" "}
          <button className="text-[#ff8f00]" onClick={() => navigate("/singin")}>
            Create an account
          </button>
        </p>
      </header>

      <main className="mx-auto flex h-[calc(100vh-124px)] w-full max-w-[1728px] items-center justify-center px-4 pb-8">
        <section className="mx-auto w-[455px] rounded-[22px] bg-[#f0f0f1] px-[22px] pb-[22px] pt-[16px]">
          <h2 className="mb-[12px] text-center text-[30px] font-normal leading-[1.05] text-[#22222b]">
            Sign in to your account
          </h2>

          <button
            className="mb-[10px] h-[48px] w-full rounded-[10px] bg-[#d9d9dc] text-[14px] text-[#20212a]"
            onClick={() => window.alert("Google auth UI clicked")}
          >
            G Continue with Google
          </button>

          <button
            className="mb-[16px] h-[48px] w-full rounded-[10px] bg-[#3f5db2] text-[14px] text-white"
            onClick={() => window.alert("Facebook auth UI clicked")}
          >
            f Continue with Facebook
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
            className="mb-[12px] h-[48px] w-full rounded-[10px] border border-[#dedee1] bg-[#ececee] px-3 text-[14px] text-[#20212a] placeholder:text-[#a3a2ad] focus:outline-none"
          />

          <label className="mb-[14px] flex items-center gap-2.5 text-[12px] text-[#9a99a6]">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="h-[16px] w-[16px] rounded-[4px] border border-[#acabb6] bg-transparent"
            />
            <span>I confirm & accept the Terms of Use</span>
          </label>

          <button
            disabled={!canContinue}
            onClick={() => navigate("/")}
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
