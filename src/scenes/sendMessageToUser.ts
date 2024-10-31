import { Scenes } from "telegraf";
import prisma from "../../prisma/prisma";
const scene = new Scenes.BaseScene("send_message_to_user");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
  const text = ctx.message.text;
  const states = ctx.scene.session.state;

  if (states === "message") {
    const user = await prisma.user.findFirst({
      where: {
        id: String(ctx.scene.session.userId),
      },
    });
    if (!user) {
      return ctx.reply("Foydalanuvchi topilmadi");
    }
    await ctx.telegram.sendMessage(user.telegram_id, text);
    return ctx.reply("Xabar yuborildi");
  } else {
    const userId = Number(text);
    const user = await prisma.user.findFirst({
      where: {
        telegram_id: String(userId),
      },
    });
    if (!user) {
      return ctx.reply("Foydalanuvchi topilmadi");
    }

    // Bu qismni o'zgartirdik
    ctx.scene.session.state = "message";
    ctx.scene.session.userId = userId;

    return ctx.reply("Xabar matnini kiriting");
  }
});
const sleep = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export default scene;
