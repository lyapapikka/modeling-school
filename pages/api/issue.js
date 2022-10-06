import { VK } from "vk-io";
import slugify from "slugify";

export default async function handler(req, res) {
  const vk = new VK({
    token: req.cookies.access_token,
  });

  const groupKey = "group-" + slugify(req.query.group).toLowerCase();

  const keys = await vk.api.storage.getKeys();
  if (!keys.includes(groupKey)) {
    await vk.api.storage.set({
      key: groupKey,
      value: JSON.stringify([req.query.article]),
    });
  } else {
    const articles = JSON.parse(
      (await vk.api.storage.get({ key: groupKey }))[0].value
    );

    await vk.api.storage.set({
      key: groupKey,
      value: JSON.stringify([...articles, req.query.article]),
    });
  }

  if (!keys.includes("names")) {
    await vk.api.storage.set({
      key: "names",
      value: JSON.stringify([req.query.group]),
    });
  } else {
    const names = JSON.parse(
      (await vk.api.storage.get({ key: "names" }))[0].value
    );

    if (names.includes(req.query.group)) {
      res.end();
      return;
    }

    await vk.api.storage.set({
      key: "names",
      value: JSON.stringify([...names, req.query.group]),
    });
  }

  res.end();
}
