import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";

type Conversation = {
  name: string;
  date: string;
  preview: string;
  avatar: string;
  active?: boolean;
};

type ChatMessage = {
  text: string;
  mine?: boolean;
};

const conversations: Conversation[] = [
  {
    name: "Olivia Rhye",
    date: "Jun 14,2022",
    preview: "Sure, I can come check it...",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop",
    active: true
  },
  {
    name: "Phoenix Baker",
    date: "Jun 14,2022",
    preview: "Is the MacBook still available?",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop"
  },
  {
    name: "Lana Steiner",
    date: "Jun 14,2022",
    preview: "Please send the location.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop"
  },
  {
    name: "Demi Wilkinson",
    date: "Jun 14,2022",
    preview: "The price works for me.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop"
  },
  {
    name: "Candice Wu",
    date: "Jun 14,2022",
    preview: "Can you deliver tomorrow?",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120&auto=format&fit=crop"
  }
];

const chatMessages: ChatMessage[] = [
  { text: "Hi, is the Mercedes-Benz GLA 250 still available?" },
  { text: "Yes, it is available. You can come for inspection today.", mine: true },
  { text: "Great. Is the custom duty fully paid?" },
  { text: "Yes, custom duty is fully paid and all documents are complete.", mine: true },
  { text: "Perfect. Please share the pickup location." }
];

function QwikLogo() {
  return (
    <button className="relative h-[92px] w-[92px] shrink-0 rounded-full bg-white" aria-label="Qwik home">
      <span className="absolute left-[33px] top-[12px] h-[17px] w-[29px] rounded-t-full border-x-[5px] border-t-[5px] border-amber" />
      <span className="absolute left-[14px] top-[35px] grid h-[20px] w-[51px] place-items-center rounded-[8px] bg-orange text-[10px] font-semibold text-white">
        Qwik
      </span>
      <span className="absolute right-[19px] top-[52px] grid h-[31px] w-[31px] rotate-[-22deg] place-items-center rounded-[8px] bg-[#0b6a48] text-[9px] text-white">
        .ng
      </span>
      <span className="absolute bottom-[13px] left-[28px] h-2.5 w-2.5 rounded-full bg-orange" />
      <span className="absolute bottom-[13px] left-[54px] h-2.5 w-2.5 rounded-full bg-orange" />
    </button>
  );
}

function IconButton({ children, active = false }: { children: ReactNode; active?: boolean }) {
  return (
    <button className={`grid h-[50px] w-[50px] place-items-center rounded-lg ${active ? "bg-deep text-white" : "bg-card text-ink"}`}>
      {children}
    </button>
  );
}

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

function ConversationItem({ item }: { item: Conversation }) {
  return (
    <button
      className={`flex w-full min-w-0 items-center gap-[14px] rounded-[18px] px-[16px] py-[14px] text-left ${
        item.active ? "bg-white shadow-[0_18px_38px_rgba(10,10,24,0.08)]" : "bg-transparent"
      }`}
    >
      <img src={item.avatar} alt={item.name} className="h-[52px] w-[52px] shrink-0 rounded-full object-cover" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[16px] font-semibold text-ink">{item.name}</span>
        <span className="mt-1 block text-[13px] text-muted">{item.date}</span>
      </span>
    </button>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  return (
    <div className={`flex ${message.mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] rounded-[20px] px-[18px] py-[13px] text-[15px] leading-[1.45] ${
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

  return (
    <div className="min-h-screen bg-page font-outfit text-ink">
      <SiteHeader navigate={navigate} activeIcon="mail" />

      <main className="mx-auto w-full max-w-[1512px] px-[24px] pb-[120px] pt-[37px] sm:px-[60px]">
        <div className="mb-[34px] flex items-center gap-[10px]">
          <MessageIcon className="h-[23px] w-[23px]" />
          <h1 className="text-[30px] font-normal leading-none tracking-normal">Messages</h1>
        </div>

        <section className="grid w-full max-w-[1120px] grid-cols-1 overflow-hidden rounded-[28px] bg-white p-[14px] shadow-[0_24px_60px_rgba(10,10,24,0.04)] lg:grid-cols-[340px_1fr] lg:p-[18px]">
          <aside className="min-w-0 border-b border-card px-[4px] py-[6px] lg:border-b-0 lg:border-r lg:pr-[18px]">
            <div className="mb-[14px] flex items-center justify-between px-[12px]">
              <h2 className="text-[20px] font-semibold text-ink">Chats</h2>
              <span className="rounded-full bg-amber/10 px-3 py-1 text-[13px] text-orange">5</span>
            </div>
            <div className="flex max-h-[350px] flex-col gap-[8px] overflow-auto pr-1 lg:max-h-[590px]">
              {conversations.map((item) => (
                <ConversationItem key={item.name} item={item} />
              ))}
            </div>
          </aside>

          <section className="flex min-h-[560px] min-w-0 flex-col bg-white lg:min-h-[650px]">
            <div className="flex items-center gap-[14px] border-b border-card px-[14px] py-[18px] lg:px-[28px]">
              <img src={conversations[0].avatar} alt={conversations[0].name} className="h-[54px] w-[54px] rounded-full object-cover" />
              <div className="min-w-0">
                <h2 className="truncate text-[18px] font-semibold text-ink">{conversations[0].name}</h2>
                <p className="text-[14px] text-muted">Online</p>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-[16px] overflow-auto px-[14px] py-[24px] lg:px-[34px]">
              {chatMessages.map((message, index) => (
                <ChatBubble key={`${message.text}-${index}`} message={message} />
              ))}
            </div>

            <div className="px-[12px] pb-[12px] lg:px-[26px] lg:pb-[24px]">
              <div className="flex min-w-0 items-center gap-[8px] rounded-[20px] bg-card px-[12px] py-[10px]">
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
