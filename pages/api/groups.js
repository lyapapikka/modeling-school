import { VK } from "vk-io";
import slugify from "slugify";

export default async function handler(req, res) {
  const vk = new VK({
    token: req.cookies.access_token,
  });

  const groupKeys = (await vk.api.storage.getKeys()).filter((g) =>
    g.startsWith("group-")
  );

  const names = JSON.parse(
    (await vk.api.storage.get({ key: "names" }))[0].value
  );

  let groups = [];

  for (const k of groupKeys) {
    const name = names.find((n) => "group-" + slugify(n).toLowerCase() === k);

    const group = (await vk.api.storage.get({ key: k }))[0];
    groups.push({ name, value: JSON.parse(group.value) });
  }

  res.json(groups);
}
