import slugify from "slugify";
import { VK } from "vk-io";

export default async function hanlder(req, res) {
  const vk = new VK({
    token: req.cookies.access_token,
  });

  const teachers = JSON.parse(
    (await vk.api.storage.get({ key: "teachers" }))[0].value
  );

  let response = [];

  for (const t of teachers) {
    const user = await vk.api.users.get({ user_ids: [t.teacher] });
    const { first_name, last_name } = user[0];
    const name = first_name + " " + last_name;

    const articles = JSON.parse(
      (
        await new VK({ token: process.env.VK_SERVICE_TOKEN }).api.storage.get({
          user_id: t.teacher,
          key: "group-" + slugify(t.group).toLowerCase(),
        })
      )[0].value
    );

    response.push({ name, articles });
  }

  res.json(response);
}
