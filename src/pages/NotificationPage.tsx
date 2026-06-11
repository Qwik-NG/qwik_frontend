import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { api } from "../services/api";
import { getRealtimeSocket } from "../services/realtime";
import type { Notification } from "../types";

function BellIcon({ small = false }: { small?: boolean }) {
  return (
    <svg width={small ? 22 : 20} height={small ? 22 : 20} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 17H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 15V11C18 7.69 15.31 5 12 5C8.69 5 6 7.69 6 11V15L4 17H20L18 15Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function NotificationShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />
      {children}
      <SiteFooter navigate={navigate} />
    </div>
  );
}

function formatTime(value: string) {
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function NotificationPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getNotifications();
      setNotifications(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, []);

  useEffect(() => {
    const socket = getRealtimeSocket();
    if (!socket) return;

    const handleNotification = ({ notification }: { notification: Notification }) => {
      setNotifications((current) => {
        if (current.some((item) => item.id === notification.id)) return current;
        return [notification, ...current];
      });
    };

    socket.on("notification:new", handleNotification);
    return () => {
      socket.off("notification:new", handleNotification);
    };
  }, []);

  const markRead = async (notification: Notification) => {
    if (notification.read) {
      if (notification.actionUrl) navigate(notification.actionUrl);
      return;
    }

    try {
      setPendingId(notification.id);
      const response = await api.markNotificationAsRead(notification.id);
      setNotifications((current) => current.map((item) => (item.id === notification.id ? response.data : item)));
      if (notification.actionUrl) navigate(notification.actionUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark notification as read");
    } finally {
      setPendingId(null);
    }
  };

  const markAllRead = async () => {
    try {
      setMarkingAll(true);
      setError(null);
      await api.markAllNotificationsAsRead();
      setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark notifications as read");
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <NotificationShell>
      <main className="mx-auto min-h-[620px] w-full max-w-[1728px] px-4 pb-20 pt-6 sm:px-6 lg:px-12 lg:pb-24">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#1f1d27]">
              <BellIcon small />
            </span>
            <h1 className="text-[28px] font-medium">Notification</h1>
            {unreadCount > 0 ? (
              <span className="rounded-full bg-[#ff8f00]/10 px-3 py-1 text-[13px] font-medium text-[#ff8f00]">{unreadCount} unread</span>
            ) : null}
          </div>

          <button
            className="h-[42px] rounded-[12px] bg-gradient-to-r from-amber to-orange px-4 text-[14px] text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={() => void markAllRead()}
            disabled={markingAll || unreadCount === 0}
          >
            {markingAll ? "Marking..." : "Mark all read"}
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-[98px] animate-pulse rounded-[16px] bg-white" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[18px] border border-[#f0d1d1] bg-white px-6 py-8 text-center">
            <p className="text-[16px] text-[#d14343]">{error}</p>
            <button className="mt-4 rounded-[8px] bg-gradient-to-r from-amber to-orange px-4 py-2 text-[15px] text-white" type="button" onClick={() => void loadNotifications()}>
              Retry
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-[18px] bg-white px-6 py-12 text-center">
            <h2 className="text-[22px] font-semibold">No notifications</h2>
            <p className="mt-2 text-[15px] text-muted">Message updates and account notices will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <article key={notification.id} className={`flex flex-col gap-4 rounded-[16px] bg-white p-4 shadow-[0_16px_40px_rgba(10,10,24,0.04)] sm:flex-row sm:items-start sm:justify-between ${notification.read ? "opacity-75" : ""}`}>
                <button className="flex min-w-0 flex-1 items-start gap-4 text-left" type="button" onClick={() => void markRead(notification)}>
                  <span className={`grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full ${notification.read ? "bg-[#ececf1] text-[#5f5d6c]" : "bg-[#1877eb] text-white"}`}>
                    <BellIcon />
                  </span>
                  <span className="min-w-0">
                    <span className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-[18px] font-semibold leading-tight sm:text-[20px]">{notification.title}</span>
                      <span className="text-[13px] text-[#57535f]">{formatTime(notification.createdAt)}</span>
                    </span>
                    <span className="block text-[15px] leading-[1.45] text-[#4b4a54]">{notification.body}</span>
                  </span>
                </button>

                {!notification.read ? (
                  <button
                    className="self-start rounded-[10px] border border-[#e2e1e8] px-3 py-2 text-[13px] text-[#4b4a54] disabled:opacity-50"
                    type="button"
                    onClick={() => void markRead(notification)}
                    disabled={pendingId === notification.id}
                  >
                    {pendingId === notification.id ? "Saving..." : "Mark read"}
                  </button>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </main>
    </NotificationShell>
  );
}
