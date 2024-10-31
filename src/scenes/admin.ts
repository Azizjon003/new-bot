import { Scenes } from "telegraf";
import prisma from "../../prisma/prisma";
const scene = new Scenes.BaseScene("admin");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.hears("Userlarni ko'rish", async (ctx: any) => {
  const users = await prisma.user.findMany();
  let text = "Foydalanuvchilar ro'yhati";
  users.forEach((user, index) => {
    text += `${index + 1} ${user.telegram_id}\n`;
    if (index % 5 == 0) {
      ctx.reply(text);

      text = "";
    }
  });

  ctx.reply(text);
});

scene.hears("Xabar yuborish", async (ctx: any) => {
  ctx.reply("Xabar matnini kiriting");
  return await ctx.scene.enter("send_message");
});

scene.hears("Userga xabar yuborish", async (ctx: any) => {
  ctx.reply("User id ni kiriting");
  ctx.scene.session = {
    state: "user_id",
  };
  return await ctx.scene.enter("send_message_to_user");
});

export default scene;
