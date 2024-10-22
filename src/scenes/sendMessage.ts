import { Scenes } from "telegraf";
import prisma from "../../prisma/prisma";
const scene = new Scenes.BaseScene("send_message");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
  const text = ctx.message.text;

  const users = await prisma.user.findMany();
  for (const user of users) {
    await ctx.telegram.sendMessage(user.telegram_id, text);
    await sleep(500);
  }
  ctx.reply("Xabar yuborildi");
});

const sleep = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export default scene;
