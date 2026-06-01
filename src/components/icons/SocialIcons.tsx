export function GoogleIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.6-5.5 3.6A6 6 0 0 1 12 5.8c2.3 0 3.8 1 4.6 1.8l3.1-3A10.5 10.5 0 0 0 12 1.5a10.5 10.5 0 1 0 0 21c6 0 10-4.2 10-10.1 0-.7-.1-1.3-.2-1.9H12Z" />
      <path fill="#34A853" d="M3 7.2 6.6 9.8A6 6 0 0 1 12 5.8c2.3 0 3.8 1 4.6 1.8l3.1-3A10.5 10.5 0 0 0 3 7.2Z" />
      <path fill="#FBBC05" d="M12 22.5c2.8 0 5.2-.9 6.9-2.5l-3.2-2.6c-.9.6-2.1 1-3.7 1a6 6 0 0 1-5.6-4L3 17a10.5 10.5 0 0 0 9 5.5Z" />
      <path fill="#4285F4" d="M22 12.4c0-.7-.1-1.3-.2-1.9H12v3.9h5.5c-.3 1.3-1.1 2.3-2.2 3l3.2 2.6c1.9-1.8 3.5-4.4 3.5-7.6Z" />
    </svg>
  );
}

export function FacebookIcon({ className = "h-[18px] w-[18px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v5h3v-5h2.2l.8-3H13V9c0-.6.4-1 1-1Z" />
    </svg>
  );
}