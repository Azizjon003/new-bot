import { Scenes } from "telegraf";
import prisma from "../../prisma/prisma";
const scene = new Scenes.BaseScene("weight");
export let qopKeyboard = [
  [
    {
      text: "Mayda Qop",
      callback_data: "Mayda Qop",
    },
    {
      text: "Naval",
      callback_data: "Naval",
    },
  ],
];
scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
  const text = ctx.message.text;

  ctx.scene.session.weight = text;

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
      weight: text,
    },
  });
  ctx.reply("Qop turini tanlang", {
    reply_markup: {
      inline_keyboard: qopKeyboard,
    },
  });
});

scene.action(["Mayda Qop", "Naval"], async (ctx: any) => {
  const text = ctx.callbackQuery.data;
  ctx.scene.session.qop = text;
  const order = await prisma.order.findFirst({
    where: {
      user: { telegram_id: String(ctx.from?.id) },
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
      qop: text,
    },
  });
  ctx.reply("Telefon raqamingizni kiriting");

  return ctx.scene.enter("phone");
});
export default scene;
