import { NextRequest, NextResponse } from 'next/server';

const TARGET_EMAIL = 'aghna1011@gmail.com';
const LIMITS = { name: 80, email: 200, message: 5000 };

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  const email = typeof raw.email === 'string' ? raw.email.trim() : '';
  const message = typeof raw.message === 'string' ? raw.message.trim() : '';

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Name, email, and message are required.' },
      { status: 400 }
    );
  }

  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    message.length > LIMITS.message
  ) {
    return NextResponse.json({ error: 'Input is too long.' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://formsubmit.co/ajax/${TARGET_EMAIL}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `New Portfolio Message from ${name}`,
          _template: 'table',
          _captcha: 'false',
        }),
        signal: AbortSignal.timeout(7000),
      }
    );

    const result = await response.json().catch(() => null);
    const rejected =
      !response.ok ||
      (result && (result.success === false || result.success === 'false'));

    if (rejected) {
      console.error('Contact form forwarding failed:', response.status, result);
      return NextResponse.json(
        {
          error: `Pesan gagal diteruskan. Silakan kirim langsung ke ${TARGET_EMAIL}.`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Pesan Anda berhasil dikirim ke inbox ${TARGET_EMAIL}.`,
    });
  } catch (error) {
    console.error('Contact form request failed:', error);
    return NextResponse.json(
      {
        error: `Pesan gagal diteruskan. Silakan kirim langsung ke ${TARGET_EMAIL}.`,
      },
      { status: 502 }
    );
  }
}
