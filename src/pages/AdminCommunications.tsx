import { useRef, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { api } from '../services/api';
import type { User } from '../types';

type AdminUserOption = User & { _count?: { ads?: number } };
const MAX_SELECTED_SELLERS = 25;

function isSellerEligible(user: AdminUserOption): boolean {
  return Number(user._count?.ads ?? 0) > 0;
}

export default function AdminCommunications() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const sendingRef = useRef(false);

  const [usersLoading, setUsersLoading] = useState(false);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [users, setUsers] = useState<AdminUserOption[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedMessage, setSelectedMessage] = useState('');
  const [selectedSending, setSelectedSending] = useState(false);
  const [selectedResult, setSelectedResult] = useState<{ ok: boolean; text: string } | null>(null);
  const selectedSendingRef = useRef(false);

  const [sellerSearch, setSellerSearch] = useState('');
  const [sellers, setSellers] = useState<AdminUserOption[]>([]);
  const [sellersLoading, setSellersLoading] = useState(false);
  const [sellersLoaded, setSellersLoaded] = useState(false);
  const [sellersError, setSellersError] = useState<string | null>(null);
  const [selectedSellerIds, setSelectedSellerIds] = useState<string[]>([]);
  const [sellerSubject, setSellerSubject] = useState('');
  const [sellerMessage, setSellerMessage] = useState('');
  const [sellerSending, setSellerSending] = useState(false);
  const [sellerResult, setSellerResult] = useState<{ ok: boolean; text: string } | null>(null);
  const sellerSendingRef = useRef(false);

  const subjectTrimmed = subject.trim();
  const messageTrimmed = message.trim();
  const isValid = subjectTrimmed.length > 0 && messageTrimmed.length > 0;

  const selectedSubjectTrimmed = selectedSubject.trim();
  const selectedMessageTrimmed = selectedMessage.trim();
  const selectedUser = users.find((user) => user.id === selectedUserId) || null;
  const selectedIsValid = selectedUserId.trim().length > 0 && selectedSubjectTrimmed.length > 0 && selectedMessageTrimmed.length > 0;

  const sellerSubjectTrimmed = sellerSubject.trim();
  const sellerMessageTrimmed = sellerMessage.trim();
  const selectedSellers = sellers.filter((seller) => selectedSellerIds.includes(seller.id));
  const sellerIsValid = selectedSellerIds.length > 0 && sellerSubjectTrimmed.length > 0 && sellerMessageTrimmed.length > 0;

  const loadUsers = async (search?: string) => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const response = await api.adminUsers({
        page: 1,
        pageSize: 100,
        search: search?.trim() || undefined,
        status: 'ACTIVE',
      });
      setUsers(response.data);
      setUsersLoaded(true);
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const loadSellers = async (search?: string) => {
    setSellersLoading(true);
    setSellersError(null);
    try {
      const response = await api.adminUsers({
        page: 1,
        pageSize: 100,
        search: search?.trim() || undefined,
        status: 'ACTIVE',
        role: 'USER',
      });
      const sellerOnly = (response.data as AdminUserOption[]).filter(isSellerEligible);
      setSellers(sellerOnly);
      setSellersLoaded(true);
      setSelectedSellerIds((current) => current.filter((id) => sellerOnly.some((seller) => seller.id === id)));
    } catch (err) {
      setSellersError(err instanceof Error ? err.message : 'Failed to load sellers');
    } finally {
      setSellersLoading(false);
    }
  };

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

  const handleSendSelectedUser = async () => {
    if (selectedSendingRef.current || !selectedIsValid) return;

    setSelectedResult(null);
    selectedSendingRef.current = true;
    setSelectedSending(true);

    try {
      const response = await api.adminSendUserEmail({
        userId: selectedUserId,
        subject: selectedSubjectTrimmed,
        message: selectedMessageTrimmed,
      });
      setSelectedResult({
        ok: true,
        text: response.message ?? `Email sent to ${response.data.recipient}.`,
      });
      setSelectedSubject('');
      setSelectedMessage('');
    } catch (err) {
      setSelectedResult({
        ok: false,
        text: err instanceof Error ? err.message : 'Failed to send to selected user. Please try again.',
      });
    } finally {
      selectedSendingRef.current = false;
      setSelectedSending(false);
    }
  };

  const toggleSellerSelection = (sellerId: string) => {
    setSellerResult(null);
    setSelectedSellerIds((current) => {
      if (current.includes(sellerId)) {
        return current.filter((id) => id !== sellerId);
      }

      if (current.length >= MAX_SELECTED_SELLERS) {
        return current;
      }

      return [...current, sellerId];
    });
  };

  const clearSellerSelection = () => {
    setSelectedSellerIds([]);
    setSellerResult(null);
  };

  const handleSendSelectedSellers = async () => {
    if (sellerSendingRef.current || !sellerIsValid) return;

    const confirmed = window.confirm(
      `Send this email to ${selectedSellerIds.length} selected seller${selectedSellerIds.length === 1 ? '' : 's'}?`,
    );
    if (!confirmed) return;

    sellerSendingRef.current = true;
    setSellerSending(true);
    setSellerResult(null);

    try {
      const response = await api.adminSendSelectedSellersEmail({
        userIds: selectedSellerIds,
        subject: sellerSubjectTrimmed,
        message: sellerMessageTrimmed,
      });

      const summary = response.data;
      setSellerResult({
        ok: summary.sentCount > 0 && summary.failedCount === 0,
        text: `Requested: ${summary.requestedCount}, Eligible: ${summary.eligibleCount}, Sent: ${summary.sentCount}, Failed: ${summary.failedCount}, Skipped non-seller: ${summary.skippedNonSellerCount}.`,
      });
      setSellerSubject('');
      setSellerMessage('');
      setSelectedSellerIds([]);
    } catch (err) {
      setSellerResult({
        ok: false,
        text: err instanceof Error ? err.message : 'Failed to send to selected sellers. Please try again.',
      });
    } finally {
      sellerSendingRef.current = false;
      setSellerSending(false);
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
            <li className="text-[#8b6200]">⚠️ Phase 2C supports only manually selected sellers. No send-to-all is enabled.</li>
          </ul>
        </div>

        {/* Phase 2B single-user section */}
        <div className="rounded-[16px] border border-[#e8e8ea] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-1 text-[17px] font-semibold text-[#1f1f29]">Send Email to One User</h2>
          <p className="mb-4 text-[13px] text-[#6f6b77]">
            This sends to one selected user only. Bulk email is not enabled yet.
          </p>

          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users by name or email"
                className="h-[40px] flex-1 rounded-[9px] border border-[#d8d5de] px-3 text-[14px] text-[#1f1f29] outline-none focus:border-[#ff9715] focus:ring-2 focus:ring-[#ff9715]/20"
              />
              <button
                type="button"
                onClick={() => void loadUsers(userSearch)}
                disabled={usersLoading}
                className="h-[40px] rounded-[9px] border border-[#d8d5de] px-4 text-[13px] font-medium text-[#4f4b59] transition hover:bg-[#f4f3f6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {usersLoading ? 'Loading…' : 'Search'}
              </button>
            </div>

            <div>
              <label htmlFor="selected-user" className="mb-1.5 block text-[13px] font-medium text-[#3a3743]">
                Select user <span className="text-[#d14343]">*</span>
              </label>
              <select
                id="selected-user"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="h-[40px] w-full rounded-[9px] border border-[#d8d5de] px-3 text-[14px] text-[#1f1f29] outline-none focus:border-[#ff9715]"
              >
                <option value="">Select one user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} {user.email ? `(${user.email})` : '(no email)'}
                  </option>
                ))}
              </select>
              {usersError ? <p className="mt-1 text-[12px] text-[#c24141]">{usersError}</p> : null}
              {!usersLoaded ? (
                <p className="mt-1 text-[12px] text-[#9a99a6]">Search to load users from the admin user list.</p>
              ) : null}
            </div>

            {selectedUser ? (
              <div className="rounded-[10px] border border-[#e4e2ea] bg-[#f8f8fa] px-3 py-2 text-[13px] text-[#3a3743]">
                Sending to: <strong>{selectedUser.fullName}</strong> {selectedUser.email ? `(${selectedUser.email})` : '(no email on account)'}
              </div>
            ) : null}

            <div>
              <label htmlFor="selected-subject" className="mb-1.5 block text-[13px] font-medium text-[#3a3743]">
                Subject <span className="text-[#d14343]">*</span>
              </label>
              <input
                id="selected-subject"
                type="text"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                maxLength={120}
                placeholder="Enter email subject"
                disabled={selectedSending}
                className="h-[40px] w-full rounded-[9px] border border-[#d8d5de] px-3 text-[14px] text-[#1f1f29] outline-none focus:border-[#ff9715] focus:ring-2 focus:ring-[#ff9715]/20 disabled:opacity-60"
              />
              <p className="mt-1 text-right text-[11px] text-[#9a99a6]">{selectedSubject.length}/120</p>
            </div>

            <div>
              <label htmlFor="selected-message" className="mb-1.5 block text-[13px] font-medium text-[#3a3743]">
                Message <span className="text-[#d14343]">*</span>
              </label>
              <textarea
                id="selected-message"
                value={selectedMessage}
                onChange={(e) => setSelectedMessage(e.target.value)}
                maxLength={5000}
                rows={7}
                placeholder="Enter email message body"
                disabled={selectedSending}
                className="w-full resize-y rounded-[9px] border border-[#d8d5de] px-3 py-2.5 text-[14px] text-[#1f1f29] outline-none focus:border-[#ff9715] focus:ring-2 focus:ring-[#ff9715]/20 disabled:opacity-60"
              />
              <p className="mt-1 text-right text-[11px] text-[#9a99a6]">{selectedMessage.length}/5000</p>
            </div>

            {selectedResult ? (
              <div
                className={`rounded-[10px] px-4 py-3 text-[13px] ${
                  selectedResult.ok
                    ? 'border border-[#c3e6cb] bg-[#edfaf2] text-[#1a6035]'
                    : 'border border-[#f5c6cb] bg-[#fff0f0] text-[#c24141]'
                }`}
              >
                {selectedResult.text}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => void handleSendSelectedUser()}
              disabled={selectedSending || !selectedIsValid}
              className="flex h-[44px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#ff9715] px-5 text-[14px] font-semibold text-white transition hover:bg-[#e6880f] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {selectedSending ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Sending…
                </>
              ) : (
                <>Send to selected user</>
              )}
            </button>
          </div>
        </div>

        {/* Phase 2C selected-sellers section */}
        <div className="rounded-[16px] border border-[#e8e8ea] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-1 text-[17px] font-semibold text-[#1f1f29]">Send Email to Selected Sellers</h2>
          <p className="mb-4 text-[13px] text-[#6f6b77]">
            This sends only to manually selected seller accounts. Bulk send to all sellers is not enabled.
          </p>

          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                value={sellerSearch}
                onChange={(e) => setSellerSearch(e.target.value)}
                placeholder="Search sellers by name or email"
                className="h-[40px] flex-1 rounded-[9px] border border-[#d8d5de] px-3 text-[14px] text-[#1f1f29] outline-none focus:border-[#ff9715] focus:ring-2 focus:ring-[#ff9715]/20"
              />
              <button
                type="button"
                onClick={() => void loadSellers(sellerSearch)}
                disabled={sellersLoading}
                className="h-[40px] rounded-[9px] border border-[#d8d5de] px-4 text-[13px] font-medium text-[#4f4b59] transition hover:bg-[#f4f3f6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sellersLoading ? 'Loading…' : 'Search'}
              </button>
            </div>

            <div className="flex items-center justify-between rounded-[10px] border border-[#e4e2ea] bg-[#f8f8fa] px-3 py-2">
              <p className="text-[13px] text-[#3a3743]">
                Selected sellers: <strong>{selectedSellerIds.length}</strong> / {MAX_SELECTED_SELLERS}
              </p>
              <button
                type="button"
                onClick={clearSellerSelection}
                disabled={selectedSellerIds.length === 0}
                className="text-[12px] font-medium text-[#6f6b77] underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear selection
              </button>
            </div>

            <div className="rounded-[10px] border border-[#d8d5de]">
              <div className="max-h-[220px] overflow-y-auto">
                {sellers.map((seller) => {
                  const checked = selectedSellerIds.includes(seller.id);
                  const disableUnchecked = !checked && selectedSellerIds.length >= MAX_SELECTED_SELLERS;
                  return (
                    <label
                      key={seller.id}
                      className="flex cursor-pointer items-start gap-3 border-b border-[#f0eef3] px-3 py-2.5 last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disableUnchecked || sellerSending}
                        onChange={() => toggleSellerSelection(seller.id)}
                        className="mt-0.5 h-4 w-4 rounded border-[#c9c5d1] text-[#ff9715] focus:ring-[#ff9715]"
                      />
                      <span className="min-w-0 text-[13px] text-[#3a3743]">
                        <span className="block truncate font-medium text-[#1f1f29]">{seller.fullName}</span>
                        <span className="block truncate text-[#6f6b77]">{seller.email || 'No email on account'}</span>
                      </span>
                    </label>
                  );
                })}
                {sellersLoaded && sellers.length === 0 ? (
                  <p className="px-3 py-3 text-[13px] text-[#6f6b77]">No seller accounts found for this search.</p>
                ) : null}
                {!sellersLoaded ? (
                  <p className="px-3 py-3 text-[13px] text-[#6f6b77]">Search to load seller-eligible users.</p>
                ) : null}
              </div>
            </div>

            {sellersError ? <p className="text-[12px] text-[#c24141]">{sellersError}</p> : null}

            <div>
              <label htmlFor="seller-subject" className="mb-1.5 block text-[13px] font-medium text-[#3a3743]">
                Subject <span className="text-[#d14343]">*</span>
              </label>
              <input
                id="seller-subject"
                type="text"
                value={sellerSubject}
                onChange={(e) => setSellerSubject(e.target.value)}
                maxLength={120}
                placeholder="Enter email subject"
                disabled={sellerSending}
                className="h-[40px] w-full rounded-[9px] border border-[#d8d5de] px-3 text-[14px] text-[#1f1f29] outline-none focus:border-[#ff9715] focus:ring-2 focus:ring-[#ff9715]/20 disabled:opacity-60"
              />
              <p className="mt-1 text-right text-[11px] text-[#9a99a6]">{sellerSubject.length}/120</p>
            </div>

            <div>
              <label htmlFor="seller-message" className="mb-1.5 block text-[13px] font-medium text-[#3a3743]">
                Message <span className="text-[#d14343]">*</span>
              </label>
              <textarea
                id="seller-message"
                value={sellerMessage}
                onChange={(e) => setSellerMessage(e.target.value)}
                maxLength={5000}
                rows={7}
                placeholder="Enter email message body"
                disabled={sellerSending}
                className="w-full resize-y rounded-[9px] border border-[#d8d5de] px-3 py-2.5 text-[14px] text-[#1f1f29] outline-none focus:border-[#ff9715] focus:ring-2 focus:ring-[#ff9715]/20 disabled:opacity-60"
              />
              <p className="mt-1 text-right text-[11px] text-[#9a99a6]">{sellerMessage.length}/5000</p>
            </div>

            {selectedSellers.length > 0 ? (
              <p className="text-[12px] text-[#6f6b77]">
                Ready to send to {selectedSellers.length} selected seller{selectedSellers.length === 1 ? '' : 's'}.
              </p>
            ) : null}

            {sellerResult ? (
              <div
                className={`rounded-[10px] px-4 py-3 text-[13px] ${
                  sellerResult.ok
                    ? 'border border-[#c3e6cb] bg-[#edfaf2] text-[#1a6035]'
                    : 'border border-[#f5c6cb] bg-[#fff0f0] text-[#c24141]'
                }`}
              >
                {sellerResult.text}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => void handleSendSelectedSellers()}
              disabled={sellerSending || !sellerIsValid}
              className="flex h-[44px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#ff9715] px-5 text-[14px] font-semibold text-white transition hover:bg-[#e6880f] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {sellerSending ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Sending…
                </>
              ) : (
                <>Send to selected sellers</>
              )}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
