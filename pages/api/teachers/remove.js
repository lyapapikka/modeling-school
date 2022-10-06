import { VK } from "vk-io";

export default async function handler(req, res) {
  const vk = new VK({
    token: req.cookies.access_token,
  });

  const teachers = JSON.parse(
    (await vk.api.storage.get({ key: "teachers" }))[0].value
  );

  await vk.api.storage.set({
    key: "teachers",
    value: JSON.stringify(
      teachers.filter((t) => t.teacher !== req.query.teacher)
    ),
  });

  res.end();
}
