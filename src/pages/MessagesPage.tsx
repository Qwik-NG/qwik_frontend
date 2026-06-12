import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { UserAvatar } from "../components/ui/UserAvatar";
import { api } from "../services/api";
import { getRealtimeSocket, joinConversation } from "../services/realtime";
import type { Conversation, Message } from "../types";

const QUICK_EMOJIS = ["😀", "😂", "❤️", "👍", "🙏", "🔥"];

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

function SendIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="m15 18-6-6 6-6" />
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
  const participantName = otherParticipant?.fullName || item.ad?.title || "Conversation";
  return (
    <button
      type="button"
      className={`flex w-full min-w-0 items-center gap-[12px] rounded-[18px] px-[14px] py-[13px] text-left transition hover:bg-white hover:shadow-[0_14px_30px_rgba(10,10,24,0.06)] focus:outline-none focus:ring-2 focus:ring-orange/30 ${
        active ? "bg-white shadow-[0_18px_38px_rgba(10,10,24,0.08)]" : "bg-transparent"
      }`}
      onClick={onSelect}
    >
      <UserAvatar
        name={participantName}
        imageUrl={otherParticipant?.profile?.avatarUrl}
        alt={participantName}
        className="h-[48px] w-[48px] shrink-0 rounded-full object-cover text-[13px]"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-ink sm:text-[16px]">{participantName}</span>
        <span className="mt-1 block truncate text-[13px] text-muted">{item.lastMessage?.text || item.ad?.title || "No messages yet"}</span>
      </span>
      <span className="shrink-0 text-[13px] text-muted">{formatConversationDate(item.lastMessageAt)}</span>
    </button>
  );
}

function ChatBubble({ message, mine, onRetry }: { message: Message; mine: boolean; onRetry?: (message: Message) => void }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] rounded-card px-[18px] py-[13px] text-[15px] leading-[1.45] ${
          mine ? "rounded-br-[6px] bg-gradient-to-r from-amber to-orange text-white" : "rounded-bl-[6px] bg-card text-ink"
        }`}
      >
        {message.text}
        {mine && message.deliveryStatus ? (
          <div className="mt-1 text-right text-[11px] text-white/80">
            {message.deliveryStatus === "pending" ? "Sending..." : null}
            {message.deliveryStatus === "failed" ? (
              <button type="button" className="font-semibold underline" onClick={() => onRetry?.(message)}>
                Failed. Retry
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function messagesMatch(existing: Message, incoming: Message) {
  if (existing.id === incoming.id) return true;
  if (existing.clientId && incoming.clientId && existing.clientId === incoming.clientId) return true;

  const isOptimisticMatch = existing.deliveryStatus === "pending" || existing.deliveryStatus === "failed";
  if (!isOptimisticMatch || existing.senderId !== incoming.senderId || existing.text !== incoming.text) return false;

  return Math.abs(new Date(existing.createdAt).getTime() - new Date(incoming.createdAt).getTime()) < 30_000;
}

function mergeMessage(messages: Message[] | undefined, incoming: Message) {
  const current = messages || [];
  const matchIndex = current.findIndex((message) => messagesMatch(message, incoming));
  const confirmed = { ...incoming, deliveryStatus: incoming.deliveryStatus ?? "sent" as const };

  if (matchIndex === -1) return [...current, confirmed];
  return current.map((message, index) => (index === matchIndex ? confirmed : message));
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
  const [emojiOpen, setEmojiOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const emojiRef = useRef<HTMLDivElement | null>(null);
  const conversationIdsRef = useRef<Set<string>>(new Set());

  const loadConversations = useCallback(async () => {
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
        null;

      setSelectedConversationId(matchingConversation?.id || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [pendingAdId, pendingRecipientId, requestedConversationId]);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

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

  useEffect(() => {
    if (!emojiOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!emojiRef.current?.contains(event.target as Node)) {
        setEmojiOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setEmojiOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [emojiOpen]);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedConversationId) || null,
    [conversations, selectedConversationId],
  );

  useEffect(() => {
    conversationIdsRef.current = new Set(conversations.map((conversation) => conversation.id));
  }, [conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [selectedConversation?.messages?.length, selectedConversationId]);

  const pendingConversation = !selectedConversation && pendingRecipientId
    ? {
        name: pendingSellerName,
        title: pendingAdTitle,
      }
    : null;
  const activeConversation = Boolean(selectedConversation || pendingConversation);
  const conversationParticipant = selectedConversation ? getOtherParticipant(selectedConversation, currentUserId) : null;
  const conversationName = selectedConversation ? conversationParticipant?.fullName || "Conversation" : pendingConversation?.name || "Conversation";
  const conversationTitle = selectedConversation?.ad?.title || pendingConversation?.title || "Conversation";

  const mergeMessageIntoConversation = useCallback((conversationId: string, message: Message) => {
    setConversations((current) =>
      current
        .map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                lastMessage: message,
                lastMessageAt: message.createdAt,
                messages: mergeMessage(conversation.messages, message),
              }
            : conversation,
        )
        .sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime()),
    );
  }, []);

  const sendExistingConversationMessage = async (text: string, clientId: string) => {
    if (!selectedConversationId || !currentUserId) return;

    const optimisticMessage: Message = {
      id: `pending-${clientId}`,
      clientId,
      conversationId: selectedConversationId,
      senderId: currentUserId,
      text,
      createdAt: new Date().toISOString(),
      readAt: null,
      deliveryStatus: "pending",
    };

    mergeMessageIntoConversation(selectedConversationId, optimisticMessage);
    try {
      setSending(true);
      setError(null);
      const response = await api.sendMessage({
        conversationId: selectedConversationId,
        text,
        clientId,
      });
      mergeMessageIntoConversation(selectedConversationId, response.data);
    } catch (err) {
      mergeMessageIntoConversation(selectedConversationId, { ...optimisticMessage, deliveryStatus: "failed" });
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleSend = async () => {
    const text = draftMessage.trim();
    if (!text || sending) return;

    const clientId = crypto.randomUUID();
    setDraftMessage("");

    if (selectedConversationId) {
      await sendExistingConversationMessage(text, clientId);
      return;
    }

    if (pendingRecipientId) {
      try {
        setSending(true);
        setError(null);
        const response = await api.createConversation({
          recipientId: pendingRecipientId,
          adId: pendingAdId || undefined,
          message: text,
          clientId,
        });

        setConversations((current) => [response.data, ...current]);
        setSelectedConversationId(response.data.id);
        navigate(`/messages?conversation=${response.data.id}`, { replace: true });
      } catch (err) {
        setDraftMessage(text);
        setError(err instanceof Error ? err.message : "Failed to send message");
      } finally {
        setSending(false);
      }
    }
  };

  const retryMessage = (message: Message) => {
    if (!message.clientId || sending) return;
    void sendExistingConversationMessage(message.text, message.clientId);
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    setError(null);
    navigate(`/messages?conversation=${id}`, { replace: true });
  };

  const handleBackToList = () => {
    setSelectedConversationId(null);
    setDraftMessage("");
    setEmojiOpen(false);
    navigate("/messages", { replace: true });
  };

  const handleLeaveMessages = () => {
    if (location.key !== "default" && window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  const addEmoji = (emoji: string) => {
    setDraftMessage((current) => `${current}${emoji}`);
    setEmojiOpen(false);
  };

  useEffect(() => {
    const socket = getRealtimeSocket();
    if (!socket) return;

    const handleNewMessage = ({ conversationId, message }: { conversationId: string; message: Message }) => {
      if (!conversationIdsRef.current.has(conversationId)) {
        void loadConversations();
        return;
      }
      mergeMessageIntoConversation(conversationId, message);
    };

    const handleConversationUpdated = ({
      conversationId,
      lastMessage,
      lastMessageAt,
    }: {
      conversationId: string;
      lastMessage?: Message;
      lastMessageAt?: string;
    }) => {
      setConversations((current) =>
        current
          .map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  lastMessage: lastMessage || conversation.lastMessage,
                  lastMessageAt: lastMessageAt || conversation.lastMessageAt,
                  messages: lastMessage ? mergeMessage(conversation.messages, lastMessage) : conversation.messages,
                }
              : conversation,
          )
          .sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime()),
      );
    };

    socket.on("message:new", handleNewMessage);
    socket.on("conversation:updated", handleConversationUpdated);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("conversation:updated", handleConversationUpdated);
    };
  }, [loadConversations, mergeMessageIntoConversation]);

  useEffect(() => {
    if (selectedConversationId) {
      joinConversation(selectedConversationId);
    }
  }, [selectedConversationId]);

  return (
    <div className="min-h-dvh bg-page font-outfit text-ink">
      <SiteHeader navigate={navigate} activeIcon="mail" />

      <main className="mx-auto h-dvh w-full max-w-[1512px] overflow-hidden md:h-auto md:px-[60px] md:pb-[120px] md:pt-[37px]">
        <div className="mb-[34px] hidden items-center gap-[10px] md:flex">
          <MessageIcon className="h-[23px] w-[23px]" />
          <h1 className="text-[30px] font-normal leading-none tracking-normal">Messages</h1>
        </div>

        <section className="mx-auto grid h-dvh min-h-0 w-full max-w-[1080px] grid-cols-1 overflow-hidden bg-white md:h-[calc(100vh-190px)] md:min-h-[560px] md:rounded-[28px] md:p-[10px] md:shadow-[0_24px_60px_rgba(10,10,24,0.04)] lg:h-[720px] lg:grid-cols-[320px_minmax(0,1fr)] lg:p-[18px]">
          <aside className={`${activeConversation ? "hidden lg:flex" : "flex"} min-h-0 min-w-0 flex-col border-card px-[4px] pb-[max(6px,env(safe-area-inset-bottom))] pt-[6px] lg:border-r lg:pb-[6px] lg:pr-[18px]`}>
            <div className="mb-[14px] flex items-center justify-between px-[12px]">
              <div className="flex min-w-0 items-center gap-2">
                <button
                  type="button"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted transition hover:bg-card focus:outline-none focus:ring-2 focus:ring-orange/30 md:hidden"
                  onClick={handleLeaveMessages}
                  aria-label="Leave messages"
                >
                  <BackIcon />
                </button>
                <h2 className="text-[20px] font-semibold text-ink">Chats</h2>
              </div>
              <span className="rounded-full bg-amber/10 px-3 py-1 text-[13px] text-orange">{conversations.length}</span>
            </div>
            {error ? (
              <div className="mx-[12px] mb-[12px] rounded-[16px] bg-[#fff2f2] p-[12px] text-[14px] text-[#b42318]">
                <p>{error}</p>
                <button type="button" className="mt-2 font-semibold text-orange" onClick={() => void loadConversations()}>
                  Retry
                </button>
              </div>
            ) : null}
            <div className="flex min-h-0 flex-1 flex-col gap-[8px] overflow-auto pr-1 lg:max-h-[620px]">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-[12px] rounded-[18px] px-[14px] py-[13px]">
                    <div className="h-[48px] w-[48px] shrink-0 animate-pulse rounded-full bg-card" />
                    <div className="min-w-0 flex-1">
                      <div className="h-4 w-2/3 animate-pulse rounded bg-card" />
                      <div className="mt-3 h-3 w-full animate-pulse rounded bg-card" />
                    </div>
                  </div>
                ))
              ) : conversations.length === 0 ? (
                <div className="px-[16px] py-[40px] text-center">
                  <p className="text-[16px] font-semibold text-ink">No chats yet</p>
                  <p className="mt-2 text-[14px] text-muted">Your conversations with sellers and buyers will appear here.</p>
                </div>
              ) : (
                conversations.map((item) => (
                  <ConversationItem
                    key={item.id}
                    item={item}
                    currentUserId={currentUserId}
                    active={item.id === selectedConversationId}
                    onSelect={() => handleSelectConversation(item.id)}
                  />
                ))
              )}
            </div>
          </aside>

          <section className={`${activeConversation ? "flex" : "hidden lg:flex"} min-h-0 min-w-0 flex-col bg-white`}>
            {selectedConversation || pendingConversation ? (
              <>
                <div className="flex min-w-0 items-center gap-[12px] border-b border-card px-[10px] py-[14px] sm:px-[14px] lg:px-[28px] lg:py-[18px]">
                  <button
                    type="button"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-muted transition hover:bg-card focus:outline-none focus:ring-2 focus:ring-orange/30 lg:hidden"
                    onClick={handleBackToList}
                    aria-label="Back to chats"
                  >
                    <BackIcon />
                  </button>
                  <UserAvatar
                    name={conversationName}
                    imageUrl={conversationParticipant?.profile?.avatarUrl}
                    alt={conversationName}
                    className="h-[46px] w-[46px] shrink-0 rounded-full object-cover text-[13px] sm:h-[54px] sm:w-[54px]"
                  />
                  <div className="min-w-0">
                    <h2 className="truncate text-[18px] font-semibold text-ink">
                      {conversationName}
                    </h2>
                    <p className="truncate text-[14px] text-muted">{conversationTitle}</p>
                  </div>
                </div>

                {error ? (
                  <div className="border-b border-card bg-[#fff8f0] px-[14px] py-[10px] text-[14px] text-[#b42318] lg:px-[28px]">
                    <span>{error}</span>
                    <button type="button" className="ml-3 font-semibold text-orange" onClick={() => void loadConversations()}>
                      Retry
                    </button>
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col gap-[14px] overflow-auto bg-[#fbfaf8] px-[12px] py-[18px] sm:px-[14px] lg:px-[34px] lg:py-[24px]">
                  {(selectedConversation?.messages || []).map((message) => (
                    <ChatBubble key={message.clientId || message.id} message={message} mine={message.senderId === currentUserId} onRetry={retryMessage} />
                  ))}
                  {!selectedConversation?.messages?.length ? (
                    <div className="m-auto max-w-[300px] rounded-[20px] bg-white px-[20px] py-[18px] text-center shadow-[0_14px_34px_rgba(10,10,24,0.05)]">
                      <p className="text-[15px] font-semibold text-ink">Send the first message...</p>
                      <p className="mt-1 text-[14px] text-muted">Start the conversation when you are ready.</p>
                    </div>
                  ) : null}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-card bg-white px-[10px] pb-[max(10px,env(safe-area-inset-bottom))] pt-[10px] sm:px-[12px] lg:px-[26px] lg:py-[18px]">
                  <div className="relative flex min-w-0 items-center gap-[8px] rounded-card bg-card px-[10px] py-[8px] sm:px-[12px] sm:py-[10px]">
                    <div ref={emojiRef} className="relative shrink-0">
                      <button
                        className="grid h-[38px] w-[38px] place-items-center rounded-full text-muted transition hover:bg-white hover:text-orange focus:outline-none focus:ring-2 focus:ring-orange/30"
                        type="button"
                        aria-label="Choose emoji"
                        aria-expanded={emojiOpen}
                        onClick={() => setEmojiOpen((current) => !current)}
                      >
                        <SmileIcon />
                      </button>
                      {emojiOpen ? (
                        <div className="absolute bottom-[48px] left-0 z-20 grid w-[164px] grid-cols-3 gap-2 rounded-[18px] bg-white p-3 shadow-[0_18px_40px_rgba(10,10,24,0.14)]">
                          {QUICK_EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              className="flex h-11 w-11 items-center justify-center rounded-full text-[26px] leading-none transition hover:bg-card focus:outline-none focus:ring-2 focus:ring-orange/30"
                              onClick={() => addEmoji(emoji)}
                            >
                              <span aria-hidden="true">{emoji}</span>
                              <span className="sr-only">Insert {emoji}</span>
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
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
                      className="grid h-[44px] w-[44px] shrink-0 place-items-center rounded-full bg-gradient-to-r from-amber to-orange text-white shadow-glow transition hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-orange/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:h-[46px] sm:w-[46px]"
                      onClick={() => void handleSend()}
                      disabled={sending || !draftMessage.trim()}
                      type="button"
                      aria-label={sending ? "Sending message" : "Send message"}
                    >
                      {sending ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <SendIcon />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center bg-[#fbfaf8] px-[24px] text-center">
                <div className="max-w-[340px] rounded-[24px] bg-white px-[28px] py-[30px] shadow-[0_18px_40px_rgba(10,10,24,0.05)]">
                  <MessageIcon className="mx-auto h-9 w-9 text-orange" />
                  <p className="mt-4 text-[18px] font-semibold text-ink">Select a conversation</p>
                  <p className="mt-2 text-[15px] text-muted">Choose a chat from the list to view messages here.</p>
                </div>
              </div>
            )}
          </section>
        </section>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
