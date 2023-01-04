export default function api(
  url,
  session,
  options = { count: false, user: false }
) {
  return [
    options.user
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/${url}`
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${url}`,
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
