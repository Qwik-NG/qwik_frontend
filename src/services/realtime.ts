import { io, type Socket } from "socket.io-client";
import { API_BASE_URL } from "./api";
import { getToken, isTokenExpired } from "./auth";
import type { Message, Notification } from "../types";

type ServerToClientEvents = {
  "message:new": (payload: { conversationId: string; message: Message }) => void;
  "notification:new": (payload: { notification: Notification }) => void;
  "conversation:updated": (payload: { conversationId: string; lastMessage?: Message; lastMessageAt?: string }) => void;
  "messages:unread-count": (payload: { count: number }) => void;
};

type ClientToServerEvents = {
  "conversation:join": (conversationId: string, ack?: (response: { success: boolean; message?: string }) => void) => void;
};

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
let socketToken: string | null = null;

export const UNREAD_MESSAGES_REFRESH_EVENT = "qwik:messages-unread-refresh";

function socketUrl() {
  return (import.meta.env.VITE_SOCKET_URL ?? API_BASE_URL.replace(/\/api\/?$/, "")).replace(/\/$/, "");
}

export function getRealtimeSocket() {
  const token = getToken();
  if (!token || isTokenExpired(token)) return null;

  if (socket && socketToken !== token) {
    socket.disconnect();
    socket = null;
  }

  if (!socket) {
    socket = io(socketUrl(), {
      auth: { token },
      autoConnect: true,
      transports: ["websocket", "polling"],
    });
    socketToken = token;
    if (import.meta.env.DEV) {
      socket.on("connect_error", (error) => {
        console.warn("Realtime connection unavailable; REST messaging remains active.", error.message);
      });
    }
  } else if (!socket.connected) {
    socket.auth = { token };
    socket.connect();
  }

  return socket;
}

export function joinConversation(conversationId: string) {
  const activeSocket = getRealtimeSocket();
  if (!activeSocket) return;
  activeSocket.emit("conversation:join", conversationId);
}

export function disconnectRealtimeSocket() {
  socket?.disconnect();
  socket = null;
  socketToken = null;
}
