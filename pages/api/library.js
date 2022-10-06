import { VK } from "vk-io";

export default async function handler(req, res) {
  const vk = new VK({
    token: req.cookies.access_token,
  });

  const user = await vk.api.users.get({ user_ids: [req.cookies.user_id], fields: ["photo_50"] });

  res.json(user);
}
