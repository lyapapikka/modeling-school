import { VK } from "vk-io";

export default async function handler(req, res) {
  const vk = new VK({
    token: req.cookies.access_token,
  });

  const keys = await vk.api.storage.getKeys();
  if (!keys.includes(req.query.group)) {
    await vk.api.storage.set({
      key: req.query.group,
      value: JSON.stringify([req.query.article]),
    });
  } else {
    const articles = JSON.parse(
      (await vk.api.storage.get({ key: req.query.group }))[0].value
    );

    await vk.api.storage.set({
      key: req.query.group,
      value: JSON.stringify([...articles, req.query.article]),
    });
  }

  res.end();
}
