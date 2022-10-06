import { VK } from "vk-io";

export default async function hanlder(req, res) {
  const vk = new VK({
    token: req.cookies.access_token,
  });

  const groupKeys = (await vk.api.storage.getKeys()).filter((g) =>
    g.startsWith("group-")
  );

  let groups = [];

  for (const k of groupKeys) {
    const group = (await vk.api.storage.get({ key: k }))[0];
    groups.push({ key: group.key, value: JSON.parse(group.value) });
  }

  res.json(groups);
}
