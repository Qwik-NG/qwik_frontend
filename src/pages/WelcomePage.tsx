import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f6f6f8] font-outfit text-[#1f1f29]">
      <header className="flex items-center justify-center px-4 pt-6 sm:pt-9 lg:pt-[46px]">
        <button
          onClick={() => navigate("/")}
          className="text-[34px] font-normal leading-none text-[#ff8300] sm:text-[40px]"
          aria-label="Qwik home"
        >
          qwik
        </button>
      </header>

      <main className="mx-auto flex min-h-[calc(100dvh-92px)] max-w-[1728px] flex-col items-center justify-center px-5 pb-12 pt-6 text-center sm:min-h-[calc(100dvh-110px)]">
        <img
          src="/images/welcome-illustration.png"
          alt=""
          className="mb-6 h-[150px] w-[150px] object-contain sm:mb-7 sm:h-[180px] sm:w-[180px]"
        />

        <h1 className="mb-2 text-[26px] font-semibold leading-[1.1] text-[#2f2f35] sm:text-[34px]">Welcome to Qwik.ng</h1>
        <p className="mb-6 max-w-[440px] text-[15px] font-normal leading-[1.45] text-[#9695a1] sm:mb-7 sm:text-[18px]">
          A place where you Buy and Sell qwik qwik
        </p>

        <button
          onClick={() => navigate("/")}
          className="h-[52px] w-full max-w-[435px] rounded-[12px] bg-gradient-to-r from-[#ffb900] to-[#ff6b0a] text-[17px] font-medium text-white shadow-[0_14px_28px_rgba(255,128,17,0.32)] transition hover:brightness-105 active:scale-[0.99] sm:h-[56px] sm:text-[18px]"
        >
          Start Shopping
        </button>
      </main>
    </div>
  );
}
