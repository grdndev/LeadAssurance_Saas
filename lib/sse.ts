/**
 * Server-Sent Events broadcaster.
 *
 * Keeps a registry of active SSE connections keyed by userId.
 * Works in the Node.js runtime (not Edge) — called from API routes.
 *
 * Usage:
 *   sseClients.add(userId, controller)   — register a new connection
 *   sseClients.remove(userId, controller) — deregister on close
 *   sseClients.send(userId, event)        — push an event to all connections for a user
 */

type SSEController = ReadableStreamDefaultController<Uint8Array>;

class SSEClientRegistry {
  private clients = new Map<string, Set<SSEController>>();

  add(userId: string, controller: SSEController) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId)!.add(controller);
  }

  remove(userId: string, controller: SSEController) {
    const set = this.clients.get(userId);
    if (set) {
      set.delete(controller);
      if (set.size === 0) this.clients.delete(userId);
    }
  }

  send(userId: string, eventName: string, data: unknown) {
    const set = this.clients.get(userId);
    if (!set || set.size === 0) return;

    const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
    const encoded = new TextEncoder().encode(payload);

    for (const ctrl of set) {
      try {
        ctrl.enqueue(encoded);
      } catch {
        // Connection already closed — will be cleaned up on the 'close' event
      }
    }
  }

  /** Number of live connections across all users (for debugging) */
  get connectionCount() {
    let total = 0;
    for (const set of this.clients.values()) total += set.size;
    return total;
  }
}

// Singleton — shared across all requests in the same Node.js process
// (Turbopack / Next.js hot-reload safe via globalThis caching)
const globalKey = "__sse_clients__" as const;
declare global {
  // eslint-disable-next-line no-var
  var __sse_clients__: SSEClientRegistry | undefined;
}

export const sseClients: SSEClientRegistry =
  globalThis[globalKey] ?? (globalThis[globalKey] = new SSEClientRegistry());
