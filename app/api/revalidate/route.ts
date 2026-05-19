import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

// Verifies GitHub's X-Hub-Signature-256 header against the request body
// using the shared secret. Uses timingSafeEqual to prevent timing attacks.
function verifySignature(
  payload: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader) return false;
  const expected =
    "sha256=" +
    crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(signatureHeader);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
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

  if (!verifySignature(body, signature, secret)) {
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
