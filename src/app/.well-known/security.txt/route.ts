// /.well-known/security.txt (RFC 9116) — where to report a security problem: the address on the
// contact page. Built on every deploy, so its expiry (just under a year) moves along.
export const dynamic = 'force-static';

export function GET() {
  const expires = new Date(Date.now() + 360 * 86_400_000).toISOString().replace(/\.\d{3}Z$/, '.000Z');
  const text = [
    'Contact: mailto:hello@axto.dev',
    'Contact: https://axto.dev/contact',
    `Expires: ${expires}`,
    'Preferred-Languages: en',
    'Canonical: https://axto.dev/.well-known/security.txt',
    '',
  ].join('\n');
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
}
