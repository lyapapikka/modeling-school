import { VK } from "vk-io";
import slugify from "slugify";

export default async function handler(req, res) {
  const vk = new VK({
    token: req.cookies.access_token,
  });

  const groupKey = "group-" + slugify(req.query.group).toLowerCase();

  const articles = JSON.parse(
    (await vk.api.storage.get({ key: groupKey }))[0].value
  );

  const filteredArticles = articles.filter((a) => a !== req.query.article);

  await vk.api.storage.set({
    key: groupKey,
    value:
      filteredArticles.length === 0 ? "" : JSON.stringify(filteredArticles),
  });

  if (filteredArticles.length === 0) {
    const groups = JSON.parse(
      (await vk.api.storage.get({ key: "names" }))[0].value
    );

    await vk.api.storage.set({
      key: "names",
      value: JSON.stringify(groups.filter((g) => g !== req.query.group)),
    });
  }

  res.end();
}
