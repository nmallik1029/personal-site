import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const runtime = 'edge';


// Verifies GitHub's X-Hub-Signature-256 header against the request body
// using the shared secret. Constant-time comparison prevents timing attacks.
async function verifySignature(
  payload: string,
  signatureHeader: string | null,
  secret: string
): Promise<boolean> {
  if (!signatureHeader) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sigBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );

  const expected =
    "sha256=" +
    Array.from(new Uint8Array(sigBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  // Constant-time comparison
  if (expected.length !== signatureHeader.length) return false;
  let result = 0;
  for (let i = 0; i < expected.length; i++) {
    result |= expected.charCodeAt(i) ^ signatureHeader.charCodeAt(i);
  }
  return result === 0;
}

export async function POST(req: NextRequest) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  if (!(await verifySignature(body, signature, secret))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = req.headers.get("x-github-event");

  // Ping = test event GitHub fires when you save the webhook config
  if (event === "ping") {
    return NextResponse.json({ ok: true, pong: true });
  }

  if (event !== "push") {
    return NextResponse.json({ ok: true, ignored: event });
  }

  // Parse payload to figure out which repo pushed (just for logging clarity)
  let repo = "unknown";
  try {
    const json = JSON.parse(body);
    repo = json?.repository?.full_name ?? "unknown";
  } catch {
    /* ignore */
  }

  // Drop the cached pages so next fetch hits GitHub again
  revalidatePath("/projects");
  revalidatePath("/projects/[slug]", "page");

  return NextResponse.json({ ok: true, revalidated: true, repo });
}