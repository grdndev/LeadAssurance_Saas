"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Filter,
  Inbox,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Scale,
  CircleCheck,
  CircleX,
  Calendar,
  CalendarX,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

const TYPE_META: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  LEAD_PURCHASED: {
    label: "Lead acheté",
    icon: ShoppingCart,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/40",
  },
  LEAD_SOLD: {
    label: "Lead vendu",
    icon: DollarSign,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/40",
  },
  CREDIT_LOW: {
    label: "Crédits bas",
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/40",
  },
  DISPUTE_OPENED: {
    label: "Litige",
    icon: Scale,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950/40",
  },
  LEAD_APPROVED: {
    label: "Lead approuvé",
    icon: CircleCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  LEAD_REJECTED: {
    label: "Lead refusé",
    icon: CircleX,
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-950/40",
  },
  APPOINTMENT_CONFIRMED: {
    label: "RDV confirmé",
    icon: Calendar,
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/40",
  },
  APPOINTMENT_CANCELLED: {
    label: "RDV annulé",
    icon: CalendarX,
    color: "text-slate-600",
    bg: "bg-slate-50 dark:bg-slate-950/40",
  },
};

const FILTER_OPTIONS = [
  { label: "Toutes", value: "ALL" },
  { label: "Non lues", value: "UNREAD" },
  { label: "Lues", value: "READ" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch {
      toast.error("Impossible de charger les notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllAsRead: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("Toutes les notifications marquées comme lues");
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  // Derived filtered list
  const typeOptions = Array.from(new Set(notifications.map((n) => n.type)));
  const filtered = notifications.filter((n) => {
    const passStatus =
      statusFilter === "ALL" ||
      (statusFilter === "UNREAD" && !n.read) ||
      (statusFilter === "READ" && n.read);
    const passType = typeFilter === "ALL" || n.type === typeFilter;
    return passStatus && passType;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0
              ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`
              : "Tout est lu"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Type filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-3.5 w-3.5" />
                {typeFilter === "ALL"
                  ? "Tous les types"
                  : (TYPE_META[typeFilter]?.label ?? typeFilter)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTypeFilter("ALL")}>
                Tous les types
              </DropdownMenuItem>
              {typeOptions.length > 0 && <DropdownMenuSeparator />}
              {typeOptions.map((t) => {
                const meta = TYPE_META[t];
                const Icon = meta?.icon ?? Megaphone;
                return (
                  <DropdownMenuItem
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className="gap-2"
                  >
                    <Icon className={`h-3.5 w-3.5 ${meta?.color ?? ""}`} />
                    {meta?.label ?? t}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status filter tabs */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="gap-1.5">
              <CheckCheck className="h-3.5 w-3.5" />
              Tout lire
            </Button>
          )}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
          <Inbox className="h-16 w-16 mb-4 opacity-20" />
          <p className="font-semibold">Aucune notification</p>
          <p className="text-sm mt-1">
            {statusFilter !== "ALL" || typeFilter !== "ALL"
              ? "Essayez de modifier les filtres"
              : "Vous êtes à jour !"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => {
            const meta = TYPE_META[n.type];
            const Icon = meta?.icon ?? Bell;
            return (
              <Card
                key={n.id}
                className={`border transition-all hover:shadow-sm ${
                  !n.read
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/50 bg-background"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div
                      className={`shrink-0 mt-0.5 h-9 w-9 rounded-full flex items-center justify-center ${
                        meta?.bg ?? "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${meta?.color ?? "text-muted-foreground"}`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm leading-snug">
                            {n.title}
                          </span>
                          {meta && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0"
                            >
                              {meta.label}
                            </Badge>
                          )}
                          {!n.read && (
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        {!n.read && (
                          <button
                            onClick={() => markAsRead(n.id)}
                            title="Marquer comme lu"
                            className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      {/* Full message — no line-clamp here unlike the widget */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {n.message}
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>
                            {formatDistanceToNow(new Date(n.createdAt), {
                              addSuffix: true,
                              locale: fr,
                            })}
                          </span>
                          <span className="text-border">·</span>
                          <span>
                            {format(new Date(n.createdAt), "d MMM yyyy à HH:mm", {
                              locale: fr,
                            })}
                          </span>
                        </div>
                        {n.link && (
                          <Link
                            href={n.link}
                            className="text-xs font-semibold text-primary hover:underline"
                          >
                            Voir le détail →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {notifications.length >= 50 && (
        <p className="text-center text-xs text-muted-foreground pb-4">
          Affichage des 50 notifications les plus récentes
        </p>
      )}
    </div>
  );
}
