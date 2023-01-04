/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["avatars.dicebear.com", "jckuimtwmmndvjzlkleg.supabase.co"],
  },
};

module.exports = nextConfig;
