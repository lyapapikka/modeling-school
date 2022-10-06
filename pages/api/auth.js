import { VK } from "vk-io";

export default async function handler(req, res) {
  const vk = new VK({
    token: req.cookies.access_token,
  });

  try {
    await vk.api.storage.getKeys();
    res.json({ isAuthorized: true });
  } catch {
    res.json({ isAuthorized: false });
  }
}
