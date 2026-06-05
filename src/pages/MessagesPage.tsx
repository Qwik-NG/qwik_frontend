import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { api } from "../services/api";
import type { Conversation, Message } from "../types";

function MessageIcon({ className = "h-[21px] w-[21px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <rect x="4" y="6" width="16" height="12" rx="3" />
      <path d="m7.5 9.5 4.5 3.3 4.5-3.3" />
    </svg>
  );
}

function SmileIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14.5A4.6 4.6 0 0 0 12 16a4.6 4.6 0 0 0 3.5-1.5" />
      <path d="M9 9.5h.01M15 9.5h.01" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}

function formatConversationDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getOtherParticipant(conversation: Conversation, currentUserId?: string) {
  return conversation.participants.find((participant) => participant.id !== currentUserId) || conversation.participants[0];
}

function ConversationItem({
  item,
  currentUserId,
  active,
  onSelect,
}: {
  item: Conversation;
  currentUserId?: string;
  active: boolean;
  onSelect: () => void;
}) {
  const otherParticipant = getOtherParticipant(item, currentUserId);
  return (
    <button
      type="button"
      className={`flex w-full min-w-0 items-center gap-[14px] rounded-[18px] px-[16px] py-[14px] text-left ${
        active ? "bg-white shadow-[0_18px_38px_rgba(10,10,24,0.08)]" : "bg-transparent"
      }`}
      onClick={onSelect}
    >
      <img
        src={otherParticipant?.profile?.avatarUrl || "https://via.placeholder.com/120"}
        alt={otherParticipant?.fullName || "Conversation"}
        className="h-[52px] w-[52px] shrink-0 rounded-full object-cover"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[16px] font-semibold text-ink">{otherParticipant?.fullName || item.ad?.title || "Conversation"}</span>
        <span className="mt-1 block truncate text-[13px] text-muted">{item.lastMessage?.text || item.ad?.title || "No messages yet"}</span>
      </span>
      <span className="shrink-0 text-[13px] text-muted">{formatConversationDate(item.lastMessageAt)}</span>
    </button>
  );
}

function ChatBubble({ message, mine }: { message: Message; mine: boolean }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] rounded-card px-[18px] py-[13px] text-[15px] leading-[1.45] ${
          mine ? "rounded-br-[6px] bg-gradient-to-r from-amber to-orange text-white" : "rounded-bl-[6px] bg-card text-ink"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const requestedConversationId = searchParams.get("conversation");
  const pendingRecipientId = searchParams.get("recipient");
  const pendingAdId = searchParams.get("ad");
  const pendingSellerName = searchParams.get("seller") || "Seller";
  const pendingAdTitle = searchParams.get("title") || "Product";
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        setError(null);

        const [meResponse, conversationsResponse] = await Promise.all([api.me(), api.getConversations()]);
        setCurrentUserId(meResponse.data.id);
        setConversations(conversationsResponse.data);

        const matchingConversation =
          conversationsResponse.data.find((conversation) => conversation.id === requestedConversationId) ||
          conversationsResponse.data.find(
            (conversation) =>
              pendingRecipientId &&
              conversation.participants.some((participant) => participant.id === pendingRecipientId) &&
              (!pendingAdId || conversation.ad?.id === pendingAdId),
          ) ||
          conversationsResponse.data[0] ||
          null;

        setSelectedConversationId(matchingConversation?.id || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    void loadConversations();
  }, [pendingAdId, pendingRecipientId, requestedConversationId]);

  useEffect(() => {
    if (!selectedConversationId) return;

    const loadConversation = async () => {
      try {
        const response = await api.getConversation(selectedConversationId);
        setConversations((current) =>
          current.map((conversation) => (conversation.id === selectedConversationId ? response.data : conversation)),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load conversation");
      }
    };

    void loadConversation();
  }, [selectedConversationId]);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) || null,
    [conversations, selectedConversationId],
  );

  const pendingConversation = !selectedConversation && pendingRecipientId
    ? {
        name: pendingSellerName,
        title: pendingAdTitle,
      }
    : null;

  const handleSend = async () => {
    if (!draftMessage.trim()) return;

    try {
      setSending(true);
      setError(null);

      if (selectedConversationId) {
        const response = await api.sendMessage({
          conversationId: selectedConversationId,
          text: draftMessage.trim(),
        });

        setConversations((current) =>
          current
            .map((conversation) =>
              conversation.id === selectedConversationId
                ? {
                    ...conversation,
                    lastMessage: response.data,
                    lastMessageAt: response.data.createdAt,
                    messages: [...(conversation.messages || []), response.data],
                  }
                : conversation,
            )
            .sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime()),
        );
      } else if (pendingRecipientId) {
        const response = await api.createConversation({
          recipientId: pendingRecipientId,
          adId: pendingAdId || undefined,
          message: draftMessage.trim(),
        });

        setConversations((current) => [response.data, ...current]);
        setSelectedConversationId(response.data.id);
        navigate(`/messages?conversation=${response.data.id}`, { replace: true });
      }

      setDraftMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-page font-outfit text-ink">
      <SiteHeader navigate={navigate} activeIcon="mail" />

      <main className="mx-auto w-full max-w-[1512px] px-[24px] pb-[120px] pt-[37px] sm:px-[60px]">
        <div className="mb-[34px] flex items-center gap-[10px]">
          <MessageIcon className="h-[23px] w-[23px]" />
          <h1 className="text-[30px] font-normal leading-none tracking-normal">Messages</h1>
        </div>

        <section className="mx-auto grid w-full max-w-[980px] grid-cols-1 overflow-hidden rounded-[28px] bg-white p-[14px] shadow-[0_24px_60px_rgba(10,10,24,0.04)] lg:grid-cols-[300px_minmax(0,1fr)] lg:p-[18px] xl:max-w-[1040px]">
          <aside className="min-w-0 border-card px-[4px] py-[6px] border-b lg:border-b-0 lg:border-r lg:pr-[18px]">
            <div className="mb-[14px] flex items-center justify-between px-[12px]">
              <h2 className="text-[20px] font-semibold text-ink">Chats</h2>
              <span className="rounded-full bg-amber/10 px-3 py-1 text-[13px] text-orange">{conversations.length}</span>
            </div>
            <div className="flex max-h-[350px] flex-col gap-[8px] overflow-auto pr-1 lg:max-h-[590px]">
              {loading ? (
                <p className="px-[16px] py-[14px] text-[15px] text-muted">Loading conversations...</p>
              ) : conversations.length === 0 ? (
                <p className="px-[16px] py-[14px] text-[15px] text-muted">No messages yet.</p>
              ) : (
                conversations.map((item) => (
                  <ConversationItem
                    key={item.id}
                    item={item}
                    currentUserId={currentUserId}
                    active={item.id === selectedConversationId}
                    onSelect={() => setSelectedConversationId(item.id)}
                  />
                ))
              )}
            </div>
          </aside>

          <section className="flex min-h-[560px] min-w-0 flex-col bg-white lg:min-h-[650px]">
            {selectedConversation || pendingConversation ? (
              <>
                <div className="flex items-center gap-[14px] border-b border-card px-[14px] py-[18px] lg:px-[28px]">
                  <img
                    src={selectedConversation ? getOtherParticipant(selectedConversation, currentUserId)?.profile?.avatarUrl || "https://via.placeholder.com/120" : "https://via.placeholder.com/120"}
                    alt={selectedConversation ? getOtherParticipant(selectedConversation, currentUserId)?.fullName || "Conversation" : pendingConversation?.name || "Conversation"}
                    className="h-[54px] w-[54px] rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <h2 className="truncate text-[18px] font-semibold text-ink">
                      {selectedConversation ? getOtherParticipant(selectedConversation, currentUserId)?.fullName || "Conversation" : pendingConversation?.name}
                    </h2>
                    <p className="truncate text-[14px] text-muted">{selectedConversation?.ad?.title || pendingConversation?.title || "Conversation"}</p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-[16px] overflow-auto px-[14px] py-[24px] lg:px-[34px]">
                  {(selectedConversation?.messages || []).map((message) => (
                    <ChatBubble key={message.id} message={message} mine={message.senderId === currentUserId} />
                  ))}
                  {!selectedConversation?.messages?.length && pendingConversation ? (
                    <p className="text-[15px] text-muted">Send the first message to start this conversation.</p>
                  ) : null}
                </div>

                <div className="px-[12px] pb-[12px] lg:px-[26px] lg:pb-[24px]">
                  <div className="flex min-w-0 items-center gap-[8px] rounded-card bg-card px-[12px] py-[10px]">
                    <button className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full text-muted" type="button">
                      <SmileIcon />
                    </button>
                    <input
                      className="h-[44px] min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
                      placeholder="Type a message"
                      value={draftMessage}
                      onChange={(event) => setDraftMessage(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          void handleSend();
                        }
                      }}
                    />
                    <button
                      className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full bg-gradient-to-r from-amber to-orange text-white shadow-glow disabled:opacity-50"
                      onClick={() => void handleSend()}
                      disabled={sending || !draftMessage.trim()}
                      type="button"
                    >
                      <MicIcon />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center px-[24px] text-center text-[16px] text-muted">
                Select a conversation to start messaging.
              </div>
            )}
          </section>
        </section>

        {error ? <p className="mt-[20px] text-[15px] text-[#d14343]">{error}</p> : null}
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
