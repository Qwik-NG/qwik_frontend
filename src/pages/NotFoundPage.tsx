import { useNavigate } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import { ROUTES } from "../constants/routes";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <PageLayout className="font-outfit" contentClassName="mx-auto flex w-full max-w-[1512px] flex-1 flex-col items-center justify-center px-[24px] py-[80px] sm:px-[60px]">
        <div className="text-center">
          <h1 className="text-[52px] sm:text-[64px] font-bold text-[#ff4e4e] mb-4">404</h1>
          <h2 className="text-[24px] sm:text-[32px] font-semibold text-ink mb-4">Page Not Found</h2>
          <p className="text-[16px] sm:text-[18px] text-muted-text mb-8 max-w-[500px]">
            Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="px-8 py-4 bg-gradient-to-r from-amber to-orange text-white rounded-btn font-semibold text-[16px] hover:opacity-90 transition-opacity"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-4 border-2 border-border-secondary text-ink rounded-btn font-semibold text-[16px] hover:bg-[#f9f9fb] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
    </PageLayout>
  );
}
