import { Scenes } from "telegraf";
import prisma from "../../prisma/prisma";
const scene = new Scenes.BaseScene("phone");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
  const text = ctx.message.text;

  const order = await prisma.order.findFirst({
    where: {
      user: {
        telegram_id: String(ctx.from?.id),
      },
    },

    orderBy: {
      created_at: "desc",
    },
  });

  if (!order) {
    return ctx.reply("Qayta start bosing");
  }
  await prisma.order.update({
    where: {
      id: order.id,
    },
    data: {
      phone: text,
    },
  });
  ctx.reply("Manzilni kiriting");
  return await ctx.scene.enter("address");
});

export default scene;
