import { NextResponse } from "next/server";

// Simple in-memory rate limiting
const submissions = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const MAX_SUBMISSIONS = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = submissions.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  submissions.set(ip, recent);
  return recent.length >= MAX_SUBMISSIONS;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Trop de soumissions. Veuillez r\u00E9essayer plus tard." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message, website } = body;

    // Honeypot: if "website" field is filled, silently reject
    if (website) {
      return NextResponse.json({ success: true });
    }

    // Validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent \u00EAtre remplis." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Email invalide." },
        { status: 400 }
      );
    }

    // Track submission for rate limiting
    const timestamps = submissions.get(ip) ?? [];
    timestamps.push(Date.now());
    submissions.set(ip, timestamps);

    // TODO: Send email via Resend when configured
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'Site Daguet Antique <noreply@antiquedaguet.fr>',
    //   to: 'contact@antiquedaguet.fr',
    //   subject: `[Contact] ${subject} — ${name}`,
    //   text: `Nom: ${name}\nEmail: ${email}\nSujet: ${subject}\n\nMessage:\n${message}`,
    // });

    console.log("Contact form submission:", { name, email, subject, message });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
