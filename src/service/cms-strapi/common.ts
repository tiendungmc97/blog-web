/** Server-only helper for fetching draft content with the Strapi API token. */
export async function fetchNewsDraft(path: string): Promise<{ data: any[]; meta: unknown }> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:1337/api";
  const token = process.env.STRAPI_API_TOKEN;

  const response = await fetch(`${base}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "strapi-encode-source-maps": "true",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Strapi draft fetch failed: ${response.status}`);
  }

  return response.json() as Promise<{ data: any[]; meta: unknown }>;
}
