import type { ReactNode } from "react";

/**
 * Generic Loading State Component
 */
export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-border-secondary border-t-amber"></div>
      <p className="text-[16px] text-muted-text">{message}</p>
    </div>
  );
}

/**
 * Generic Error State Component
 */
export function ErrorState({
  message = "Something went wrong",
  onRetry,
  details
}: {
  message?: string;
  onRetry?: () => void;
  details?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
        <span className="text-[32px]">⚠️</span>
      </div>
      <div className="text-center">
        <p className="text-[18px] font-semibold text-ink">{message}</p>
        {details && <p className="mt-2 text-[14px] text-muted-text">{details}</p>}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-6 py-2 rounded-btn bg-gradient-to-r from-amber to-orange text-white font-medium text-[14px] hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

/**
 * Generic Empty State Component
 */
export function EmptyState({
  title = "No items found",
  description = "There's nothing here yet",
  action,
  icon = "📭"
}: {
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  icon?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="text-[48px]">{icon}</div>
      <div className="text-center">
        <p className="text-[18px] font-semibold text-ink">{title}</p>
        <p className="mt-2 text-[14px] text-muted-text">{description}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-6 py-2 rounded-btn bg-gradient-to-r from-amber to-orange text-white font-medium text-[14px] hover:opacity-90 transition-opacity"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

/**
 * State Wrapper Component - combines loading, error, and content rendering
 */
export function RequestStateWrapper({
  loading,
  error,
  empty,
  children,
  loadingMessage,
  errorMessage,
  emptyTitle,
  emptyDescription,
  onRetry
}: {
  loading: boolean;
  error: Error | null;
  empty: boolean;
  children: ReactNode;
  loadingMessage?: string;
  errorMessage?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  onRetry?: () => void;
}) {
  if (loading) return <LoadingState message={loadingMessage} />;
  if (error) return <ErrorState message={errorMessage || error.message} onRetry={onRetry} />;
  if (empty) return <EmptyState title={emptyTitle} description={emptyDescription} />;
  return <>{children}</>;
}
