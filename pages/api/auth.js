export default async function handler(req, res) {
  res.json({ isAuthorized: !!req.cookies.access_token });
}
