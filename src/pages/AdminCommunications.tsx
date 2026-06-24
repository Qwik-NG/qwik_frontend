import { useRef, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { api } from '../services/api';

export default function AdminCommunications() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const sendingRef = useRef(false);

  const subjectTrimmed = subject.trim();
  const messageTrimmed = message.trim();
  const isValid = subjectTrimmed.length > 0 && messageTrimmed.length > 0;

  const handleSend = async () => {
    if (sendingRef.current || !isValid) return;

    setResult(null);
    sendingRef.current = true;
    setSending(true);

    try {
      const response = await api.adminSendTestEmail({ subject: subjectTrimmed, message: messageTrimmed });
      setResult({
        ok: true,
        text: response.message ?? `Test email sent to ${response.data.recipient}.`,
      });
      setSubject('');
      setMessage('');
    } catch (err) {
      setResult({
        ok: false,
        text: err instanceof Error ? err.message : 'Failed to send test email. Please try again.',
      });
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  return (
    <AdminLayout
      title="Communications"
      description="Admin email tools — test and compose internal communications"
    >
      <div className="max-w-[640px] space-y-5">
        {/* Phase notice */}
        <div className="rounded-[12px] border border-[#e4e2ea] bg-[#fffbf2] px-4 py-3">
          <p className="text-[13px] font-medium text-[#8b6200]">
            ⚠️ Phase 2A — Test only. This form sends email to your own admin email address only. No users are contacted.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-[16px] border border-[#e8e8ea] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-[17px] font-semibold text-[#1f1f29]">Send Test Email</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="comm-subject" className="mb-1.5 block text-[13px] font-medium text-[#3a3743]">
                Subject <span className="text-[#d14343]">*</span>
              </label>
              <input
                id="comm-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={120}
                placeholder="Enter email subject"
                disabled={sending}
                className="h-[40px] w-full rounded-[9px] border border-[#d8d5de] px-3 text-[14px] text-[#1f1f29] outline-none focus:border-[#ff9715] focus:ring-2 focus:ring-[#ff9715]/20 disabled:opacity-60"
              />
              <p className="mt-1 text-right text-[11px] text-[#9a99a6]">{subject.length}/120</p>
            </div>

            <div>
              <label htmlFor="comm-message" className="mb-1.5 block text-[13px] font-medium text-[#3a3743]">
                Message <span className="text-[#d14343]">*</span>
              </label>
              <textarea
                id="comm-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={5000}
                rows={8}
                placeholder="Enter email message body"
                disabled={sending}
                className="w-full resize-y rounded-[9px] border border-[#d8d5de] px-3 py-2.5 text-[14px] text-[#1f1f29] outline-none focus:border-[#ff9715] focus:ring-2 focus:ring-[#ff9715]/20 disabled:opacity-60"
              />
              <p className="mt-1 text-right text-[11px] text-[#9a99a6]">{message.length}/5000</p>
            </div>

            {result ? (
              <div
                className={`rounded-[10px] px-4 py-3 text-[13px] ${
                  result.ok
                    ? 'border border-[#c3e6cb] bg-[#edfaf2] text-[#1a6035]'
                    : 'border border-[#f5c6cb] bg-[#fff0f0] text-[#c24141]'
                }`}
              >
                {result.text}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => void handleSend()}
              disabled={sending || !isValid}
              className="flex h-[44px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#ff9715] px-5 text-[14px] font-semibold text-white transition hover:bg-[#e6880f] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {sending ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Sending…
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 2 11 13" />
                    <path d="M22 2 15 22 11 13 2 9l20-7Z" />
                  </svg>
                  Send Test Email
                </>
              )}
            </button>
          </div>
        </div>

        {/* Safety info card */}
        <div className="rounded-[12px] border border-[#e8e8ea] bg-white p-4 shadow-sm">
          <h3 className="mb-2 text-[13px] font-semibold text-[#1f1f29]">How this works</h3>
          <ul className="space-y-1.5 text-[13px] text-[#6f6b77]">
            <li>✓ Email is sent only to your logged-in admin email address</li>
            <li>✓ No user email addresses are contacted</li>
            <li>✓ Sent via Qwik.ng's Resend email provider</li>
            <li>✓ Every send is recorded in the Admin Audit Log</li>
            <li className="text-[#8b6200]">⚠️ Phase 2B (send to selected user) is not yet enabled</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
