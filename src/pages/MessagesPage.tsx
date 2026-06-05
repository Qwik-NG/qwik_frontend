import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { UserAvatar } from "../components/ui/UserAvatar";
import { QwikLogo } from "../components/ui/QwikLogo";
import { IconButton } from "../components/ui/IconButton";

type Conversation = {
  id: string;
  name: string;
  date: string;
  preview: string;
  avatarUrl?: string;
  active?: boolean;
};

type ChatMessage = {
  text: string;
  mine?: boolean;
};

// TODO: replace mock conversation data with API conversation records when messaging endpoints are ready.
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "olivia-rhye",
    name: "Olivia Rhye",
    date: "Jun 14,2022",
    preview: "Sure, I can come check it...",
    active: true
  },
  {
    id: "phoenix-baker",
    name: "Phoenix Baker",
    date: "Jun 14,2022",
    preview: "Is the MacBook still available?"
  },
  {
    id: "lana-steiner",
    name: "Lana Steiner",
    date: "Jun 14,2022",
    preview: "Please send the location."
  },
  {
    id: "demi-wilkinson",
    name: "Demi Wilkinson",
    date: "Jun 14,2022",
    preview: "The price works for me."
  },
  {
    id: "candice-wu",
    name: "Candice Wu",
    date: "Jun 14,2022",
    preview: "Can you deliver tomorrow?"
  }
];

// TODO: replace mock message history with API conversation messages when messaging endpoints are ready.
const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { text: "Hi, is the Mercedes-Benz GLA 250 still available?" },
  { text: "Yes, it is available. You can come for inspection today.", mine: true },
  { text: "Great. Is the custom duty fully paid?" },
  { text: "Yes, custom duty is fully paid and all documents are complete.", mine: true },
  { text: "Perfect. Please share the pickup location." }
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

function BookmarkIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M6.5 4.8c0-1 .8-1.8 1.8-1.8h7.4c1 0 1.8.8 1.8 1.8v16.1L12 17.5l-5.5 3.4V4.8Z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M18 9.5a6 6 0 0 0-12 0c0 7-2.6 7.5-2.6 7.5h17.2S18 16.5 18 9.5" />
      <path d="M14.2 20a2.4 2.4 0 0 1-4.4 0" />
    </svg>
  );
}

function MessageIcon({ className = "h-[21px] w-[21px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <rect x="4" y="6" width="16" height="12" rx="3" />
      <path d="m7.5 9.5 4.5 3.3 4.5-3.3" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M19 10c0 5.3-7 10-7 10s-7-4.7-7-10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.4" />
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

function PaperclipIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="m21 11.5-8.9 8.9a5.1 5.1 0 0 1-7.2-7.2l9.1-9.1a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 1 1-2.8-2.8l8.2-8.2" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M7 7h2l1.4-2h3.2L15 7h2a3 3 0 0 1 3 3v6.5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3Z" />
      <circle cx="12" cy="13" r="3.2" />
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

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M16.5 12.8c0-2 1.7-3 1.8-3.1-1-.1-2-.6-2.6-1.3-1.1-1.1-2.7-1-3.4-.7-.7.3-1.3.7-2 .7-.8 0-1.5-.4-2.3-.7-1-.4-2.3-.1-3.2.8-1.7 1.8-1.4 5.2.3 7.9.8 1.3 1.8 2.7 3.1 2.7 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8 2.2-1.2 3-2.5c.5-.7.8-1.5 1-2.1-.1-.1-2.1-.8-2.1-3.7ZM14.9 6.5c.7-.8 1.1-1.8 1-2.8-1 .1-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1.1.1 2.1-.5 2.7-1.4Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M5.5 3.6v16.8L14 12 5.5 3.6Zm1.4-.9 9.8 5.6-2 2L6.9 2.7Zm0 18.6 7.8-7.6 2 2-9.8 5.6Zm10.8-12.4 2.4 1.4c1.2.7 1.2 2.1 0 2.8l-2.4 1.4-2.2-2.8 2.2-2.8Z" />
    </svg>
  );
}

function ConversationItem({ item, selected, onClick }: { item: Conversation; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full min-w-0 items-center gap-[14px] rounded-[18px] px-[16px] py-[14px] text-left ${
        selected ? "bg-white shadow-[0_18px_38px_rgba(10,10,24,0.08)]" : "bg-transparent"
      }`}
    >
      <UserAvatar name={item.name} imageUrl={item.avatarUrl} alt={item.name} className="h-[52px] w-[52px] shrink-0 rounded-full object-cover" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[16px] font-semibold text-ink">{item.name}</span>
        <span className="mt-1 block text-[13px] text-muted">{item.date}</span>
        <span className="mt-1 block truncate text-[13px] text-[#8c8996]">{item.preview}</span>
      </span>
    </button>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  return (
    <div className={`flex ${message.mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] break-words rounded-card px-[18px] py-[13px] text-[15px] leading-[1.45] sm:max-w-[78%] ${
          message.mine ? "rounded-br-[6px] bg-gradient-to-r from-amber to-orange text-white" : "rounded-bl-[6px] bg-card text-ink"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const defaultConversation = MOCK_CONVERSATIONS.find((conversation) => conversation.active) ?? MOCK_CONVERSATIONS[0];
  const [selectedChatId, setSelectedChatId] = useState(defaultConversation.id);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const activeConversation = MOCK_CONVERSATIONS.find((conversation) => conversation.id === selectedChatId) ?? defaultConversation;

  const handleConversationSelect = (conversationId: string) => {
    setSelectedChatId(conversationId);
    setIsMobileChatOpen(true);
  };

  // TODO: INTEGRATION READY
  // When backend is connected:
  // 1. Call: const { data: conversations } = await api.getConversations()
  // 2. Call: const { data: messages } = await api.getConversation(selectedConversationId) on select
  // 3. For sending: await api.sendMessage({ conversationId, text })
  // 4. Implement real-time updates (WebSocket or polling for new messages)
  // 5. Use RequestStateWrapper for loading/error states
  // 6. Show EmptyState when no conversations: title="No Messages", description="Start a conversation to begin"
  // Types ready: Conversation[], Message[], ConversationCreatePayload from src/types/index.ts
  // For now, keep MOCK_CONVERSATIONS and MOCK_CHAT_MESSAGES local to this page.

  return (
    <div className="min-h-screen bg-page font-outfit text-ink">
      <SiteHeader navigate={navigate} activeIcon="mail" />

      <main className="mx-auto w-full max-w-[1512px] px-[24px] pb-[120px] pt-[37px] sm:px-[60px]">
        <div className="mb-[34px] flex items-center gap-[10px]">
          <MessageIcon className="h-[23px] w-[23px]" />
          <h1 className="text-[30px] font-normal leading-none tracking-normal">Messages</h1>
        </div>

        <section className="mx-auto grid w-full max-w-[980px] grid-cols-1 overflow-hidden rounded-[28px] bg-white p-[14px] shadow-[0_24px_60px_rgba(10,10,24,0.04)] lg:grid-cols-[300px_minmax(0,1fr)] lg:p-[18px] xl:max-w-[1040px]">
          <aside className={`min-w-0 border-card px-[4px] py-[6px] ${isMobileChatOpen ? "hidden" : "block border-b"} lg:block lg:border-b-0 lg:border-r lg:pr-[18px]`}>
            <div className="mb-[14px] flex items-center justify-between px-[12px]">
              <h2 className="text-[20px] font-semibold text-ink">Chats</h2>
              <span className="rounded-full bg-amber/10 px-3 py-1 text-[13px] text-orange">{MOCK_CONVERSATIONS.length}</span>
            </div>
            <div className="flex max-h-[350px] flex-col gap-[8px] overflow-auto pr-1 lg:max-h-[590px]">
              {MOCK_CONVERSATIONS.map((item) => (
                <ConversationItem
                  key={item.id}
                  item={item}
                  selected={item.id === activeConversation.id}
                  onClick={() => handleConversationSelect(item.id)}
                />
              ))}
            </div>
          </aside>

          <section className={`${isMobileChatOpen ? "flex" : "hidden"} min-h-[560px] min-w-0 flex-col bg-white lg:flex lg:min-h-[650px]`}>
            <div className="border-b border-card px-[14px] py-[12px] lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileChatOpen(false)}
                className="inline-flex items-center gap-2 text-[14px] font-medium text-[#6c6a74]"
              >
                <BackIcon />
                <span>Back</span>
              </button>
            </div>
            <div className="flex items-center gap-[14px] border-b border-card px-[14px] py-[18px] lg:px-[28px]">
              <UserAvatar name={activeConversation.name} imageUrl={activeConversation.avatarUrl} alt={activeConversation.name} className="h-[54px] w-[54px] rounded-full object-cover" />
              <div className="min-w-0">
                <h2 className="truncate text-[18px] font-semibold text-ink">{activeConversation.name}</h2>
                <p className="text-[14px] text-muted">Online</p>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-[16px] overflow-auto px-[12px] py-[20px] sm:px-[14px] lg:px-[34px]">
              {MOCK_CHAT_MESSAGES.map((message, index) => (
                <ChatBubble key={`${message.text}-${index}`} message={message} />
              ))}
            </div>

            <div className="px-[12px] pb-[12px] lg:px-[26px] lg:pb-[24px]">
              <div className="flex min-w-0 items-center gap-[8px] rounded-card bg-card px-[12px] py-[10px]">
                <button className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full text-muted">
                  <SmileIcon />
                </button>
                <input className="h-[44px] min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted" placeholder="Type a message" />
                <button className="hidden h-[38px] w-[38px] shrink-0 place-items-center rounded-full text-muted sm:grid">
                  <PaperclipIcon />
                </button>
                <button className="hidden h-[38px] w-[38px] shrink-0 place-items-center rounded-full text-muted sm:grid">
                  <CameraIcon />
                </button>
                <button className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full bg-gradient-to-r from-amber to-orange text-white shadow-glow">
                  <MicIcon />
                </button>
              </div>
            </div>
          </section>
        </section>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
