import { VK } from "vk-io";

export default async function hanlder(req, res) {
  const vk = new VK({
    token: req.cookies.access_token,
  });

  const keys = await vk.api.storage.getKeys();

  if (keys.includes("teachers")) {
    const teachers = JSON.parse(
      (await vk.api.storage.get({ key: "teachers" }))[0].value
    );

    await vk.api.storage.set({
      key: "teachers",
      value: JSON.stringify([
        ...teachers,
        { teacher: req.query.teacher, group: req.query.group },
      ]),
    });
  } else {
    await vk.api.storage.set({
      key: "teachers",
      value: JSON.stringify([
        { teacher: req.query.teacher, group: req.query.group },
      ]),
    });
  }

  res.end();
}
