import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f3f3f5] font-outfit text-[#1f1f29]">
      <header className="px-4 pt-5 sm:px-8 sm:pt-7 lg:px-[60px] lg:pt-[46px]">
        <button onClick={() => navigate("/")} className="text-[34px] font-normal leading-none text-[#ff8300] sm:text-[40px]">
          qwik
        </button>
      </header>

      <main className="mx-auto flex min-h-[calc(100dvh-68px)] max-w-[1728px] flex-col items-center justify-center px-5 py-10 text-center sm:min-h-[calc(100dvh-80px)]">
        <img src="/images/welcome-illustration.png" alt="welcome illustration" className="mb-[18px] h-[128px] w-[128px] object-contain sm:h-[153px] sm:w-[153px]" />

        <h1 className="mb-[6px] text-[27px] font-semibold leading-[1.1] text-[#2f2f35] sm:text-[34px]">Welcome to Qwik.ng</h1>
        <p className="mb-[22px] max-w-[440px] text-[15px] font-normal leading-[1.45] text-[#9695a1] sm:text-[18px]">A place where you Buy and Sell qwik qwik</p>

        <button
          onClick={() => navigate("/")}
          className="h-[52px] w-full max-w-[435px] rounded-[10px] bg-gradient-to-r from-[#ffb900] to-[#ff6b0a] text-[17px] text-white shadow-[0_10px_22px_rgba(255,128,17,0.28)] sm:h-[54px] sm:text-[20px]"
        >
          Start Shopping
        </button>
      </main>
    </div>
  );
}
