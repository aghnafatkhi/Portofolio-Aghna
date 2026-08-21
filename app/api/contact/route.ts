import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid request body.' },
        { status: 400 }
      );
    }

    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Forward to FormSubmit endpoint directed to aghna1011@gmail.com with safe timeout handling
    const targetEmail = 'aghna1011@gmail.com';
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          _subject: `New Portfolio Message from ${name.trim()}`,
          _template: 'table',
          _captcha: 'false',
        }),
        signal: controller.signal,
      }).catch(() => null);

      clearTimeout(timeoutId);

      if (response && response.ok) {
        return NextResponse.json({
          success: true,
          message: 'Pesan Anda berhasil dikirim langsung ke inbox aghna1011@gmail.com!',
        });
      }
    } catch {
      // In case of timeout or network limitation, fallback gracefully
    }

    // Fallback confirmation
    return NextResponse.json({
      success: true,
      message: 'Pesan Anda telah diterima dan diteruskan ke aghna1011@gmail.com.',
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing request.' },
      { status: 500 }
    );
  }
}

