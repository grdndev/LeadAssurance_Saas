"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

const NOTIFICATION_ICONS: Record<string, string> = {
  LEAD_PURCHASED: "🛒",
  LEAD_SOLD: "💰",
  CREDIT_LOW: "⚠️",
  DISPUTE_OPENED: "⚖️",
  LEAD_APPROVED: "✅",
  LEAD_REJECTED: "❌",
  APPOINTMENT_CONFIRMED: "📅",
  APPOINTMENT_CANCELLED: "🚫",
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  const connect = useCallback(() => {
    if (esRef.current) return;

    const es = new EventSource("/api/notifications/stream");
    esRef.current = es;

    es.addEventListener("connected", () => {
      setConnected(true);
    });

    es.addEventListener("notification", (e) => {
      try {
        const notif: Notification = JSON.parse(e.data);
        setNotifications((prev) => [notif, ...prev.slice(0, 49)]);
        setUnreadCount((prev) => prev + 1);
        toast(notif.title, {
          description: notif.message,
          duration: 5000,
          action: notif.link
            ? { label: "Voir", onClick: () => { window.location.href = notif.link!; } }
            : undefined,
        });
      } catch {
        // malformed payload
      }
    });

    es.onerror = () => {
      setConnected(false);
      es.close();
      esRef.current = null;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      reconnectTimer.current = setTimeout(connect, 5_000);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchNotifications();
    connect();
    return () => {
      esRef.current?.close();
      esRef.current = null;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [mounted, fetchNotifications, connect]);

  const markAsRead = async (notificationId: string) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch { /* silent */ }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllAsRead: true }),
      });

      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch { /* silent */ }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button 
        className="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors" 
        aria-label="Notifications"
        disabled
      >
        <Bell className="h-5 w-5" />
      </button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button 
          className="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors" 
          aria-label="Notifications"
        >
          <Bell className={`h-5 w-5 ${connected ? "" : "opacity-50"}`} />
          {connected && (
            <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-green-500" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-95 max-h-150 overflow-hidden flex flex-col p-0" sideOffset={8}>
        <div className="sticky top-0 bg-background border-b px-4 py-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {connected && (
              <span className="flex items-center gap-1 text-[10px] text-green-600 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-7"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Tout lire
            </Button>
          )}
        </div>

        <div className="overflow-y-auto max-h-125">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Chargement...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Aucune notification</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="text-2xl shrink-0">
                      {NOTIFICATION_ICONS[notification.type] ?? "📢"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm leading-tight">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-primary hover:text-primary/80 shrink-0"
                            title="Marquer comme lu"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </span>
                        {notification.link && (
                          <Link
                            href={notification.link}
                            className="text-xs text-primary font-semibold hover:underline"
                            onClick={() => setOpen(false)}
                          >
                            Voir →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="sticky bottom-0 bg-background border-t px-4 py-2">
            <Link
              href="/dashboard/notifications"
              className="text-xs text-center block text-primary font-semibold hover:underline"
              onClick={() => setOpen(false)}
            >
              Voir toutes les notifications
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
