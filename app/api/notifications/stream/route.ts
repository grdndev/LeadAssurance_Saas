import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sseClients } from "@/lib/sse";

/**
 * GET /api/notifications/stream
 *
 * Server-Sent Events endpoint. Keeps an open HTTP connection and pushes
 * `notification` events whenever a new notification is written for this user.
 *
 * The client receives:
 *   event: notification
 *   data: { id, type, title, message, link, read, createdAt }
 *
 * A `ping` event is sent every 25 seconds to keep proxies/load-balancers alive.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userId = user.id;
  const encoder = new TextEncoder();

  let controller: ReadableStreamDefaultController<Uint8Array>;
  let pingInterval: ReturnType<typeof setInterval>;

  const stream = new ReadableStream<Uint8Array>({
    start(ctrl) {
      controller = ctrl;

      // Register with the global broadcaster
      sseClients.add(userId, controller);

      // Send an initial `connected` event so the client knows it's live
      ctrl.enqueue(encoder.encode(`event: connected\ndata: {"userId":"${userId}"}\n\n`));

      // Keep-alive ping every 25 seconds
      pingInterval = setInterval(() => {
        try {
          ctrl.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          clearInterval(pingInterval);
        }
      }, 25_000);
    },
    cancel() {
      clearInterval(pingInterval);
      sseClients.remove(userId, controller);
    },
  });

  // Abort if the client disconnects
  req.signal.addEventListener("abort", () => {
    clearInterval(pingInterval);
    sseClients.remove(userId, controller);
    try { controller.close(); } catch { /* already closed */ }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable Nginx buffering
    },
  });
}
