import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { api } from "../../services/api";
import { setRole, setToken } from "../../services/auth";
import { GoogleIcon } from "../icons/SocialIcons";

const GIS_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

type GoogleCredentialResponse = { credential?: string };

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            ux_mode?: "popup" | "redirect";
            auto_select?: boolean;
            use_fedcm_for_prompt?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: { theme?: string; size?: string; type?: string; shape?: string; width?: number; text?: string; logo_alignment?: string }
          ) => void;
          cancel: () => void;
        };
      };
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Identity script")), { once: true });
      if (window.google?.accounts?.id) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = GIS_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Identity script"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

type Props = {
  /** Label shown when Google is not configured (button stays disabled). */
  disabledLabel?: string;
};

export default function GoogleSignInButton({ disabledLabel = "Continue with Google" }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { error: showError, success } = useToast();
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const buttonId = useId();
  const isConfigured = Boolean(GOOGLE_CLIENT_ID);

  useEffect(() => {
    if (!isConfigured || !containerRef.current) return;
    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled || !window.google || !containerRef.current) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID!,
          callback: async (response: GoogleCredentialResponse) => {
            if (!response.credential) {
              showError("Google sign-in was cancelled");
              return;
            }
            try {
              setIsSubmitting(true);
              const res = await api.googleAuth({ credential: response.credential });
              setToken(res.data.token);
              setRole(res.data.user.role);
              success("Signed in with Google");
              navigate(res.data.user.role === "ADMIN" ? "/admin" : "/welcome");
            } catch (err) {
              showError(err instanceof Error ? err.message : "Google sign-in failed");
            } finally {
              setIsSubmitting(false);
            }
          },
          ux_mode: "popup",
          use_fedcm_for_prompt: true,
        });
        const width = Math.min(containerRef.current.clientWidth || 411, 411);
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          shape: "rectangular",
          text: "continue_with",
          logo_alignment: "left",
          width,
        });
        setIsReady(true);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
      });

    return () => {
      cancelled = true;
    };
  }, [isConfigured, navigate, showError, success]);

  if (!isConfigured) {
    return (
      <button
        className="mb-[10px] flex h-[48px] w-full cursor-not-allowed items-center justify-center gap-2 rounded-[10px] bg-[#d9d9dc] text-[14px] text-[#8b8a94] opacity-70 transition-all duration-200"
        type="button"
        disabled
        aria-disabled="true"
        title="Coming soon"
      >
        <GoogleIcon />
        <span>{disabledLabel}</span>
      </button>
    );
  }

  return (
    <div className="mb-[10px] w-full">
      <div
        ref={containerRef}
        id={buttonId}
        className="flex w-full justify-center"
        aria-busy={isSubmitting}
        style={{ minHeight: 48, opacity: isSubmitting ? 0.6 : 1, pointerEvents: isSubmitting ? "none" : "auto" }}
      />
      {!isReady && (
        <div className="flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#ececee] text-[14px] text-[#8b8a94]">
          <GoogleIcon />
          <span>Loading Google sign-in…</span>
        </div>
      )}
    </div>
  );
}
