import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden bg-[#f3f3f5] font-outfit text-[#1f1f29]">
      <header className="pt-[46px] text-center">
        <button onClick={() => navigate("/")} className="text-[26px] font-normal leading-none text-[#ff8300]">
          qwik
        </button>
      </header>

      <main className="mx-auto flex h-[calc(100vh-96px)] max-w-[1728px] flex-col items-center justify-center px-4 pb-[90px]">
        <img src="/images/welcome-illustration.png" alt="welcome illustration" className="mb-[18px] mt-[72px] h-[153px] w-[153px] object-contain" />

        <h1 className="mb-[6px] text-[49px] font-semibold leading-[1.06] text-[#2f2f35]">Welcome to Qwik.ng</h1>
        <p className="mb-[22px] text-[21px] font-normal text-[#9695a1]">A place where you Buy and Sell qwik qwik</p>

        <button
          onClick={() => navigate("/")}
          className="h-[54px] w-[435px] rounded-[10px] bg-gradient-to-r from-[#ffb900] to-[#ff6b0a] text-[34px] text-white shadow-[0_10px_22px_rgba(255,128,17,0.28)]"
        >
          Start Shopping
        </button>
      </main>
    </div>
  );
}
