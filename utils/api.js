export default function api(url, session, options = { count: false }) {
  return [
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${url}`,
    {
      headers: {
        authorization: `Bearer ${session.access_token}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        ...(options.count && { prefer: "count=estimated" }),
      },
      ...(options.count && { method: "HEAD" }),
    },
  ];
}
