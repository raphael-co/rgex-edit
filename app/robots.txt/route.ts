export function GET() {
  const domain = "https://regex-edit.raphaelcomandon-portfolio.fr";
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    `Sitemap: ${domain}/sitemap.xml`,
  ].join("\n");

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
