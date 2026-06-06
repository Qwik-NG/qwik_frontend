import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

type BackButtonProps = {
  className?: string;
};

export default function BackButton({ className = "" }: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const hasUsefulHistory = typeof window !== "undefined" && window.history.length > 1 && location.key !== "default";
    if (hasUsefulHistory) {
      navigate(-1);
      return;
    }
    navigate(ROUTES.HOME);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex h-11 items-center justify-center rounded-[12px] border border-[#e2ded7] bg-white px-4 text-[14px] font-medium text-[#1f1d27] shadow-[0_8px_20px_rgba(31,29,39,0.05)] ${className}`.trim()}
      aria-label="Go back"
    >
      <span aria-hidden="true">←</span>
      <span className="ml-2">Back</span>
    </button>
  );
}
