import { Scenes } from "telegraf";
import prisma from "../../prisma/prisma";
const scene = new Scenes.BaseScene("address");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
  const text = ctx.message.text;

  let order = await prisma.order.findFirst({
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
  order = await prisma.order.update({
    where: {
      id: order.id,
    },
    data: {
      address: text,
    },
  });
  ctx.reply(
    `Ismingiz: ${order.name}\nVazni: ${order.weight}\nKomir: ${order.type}\nQop: ${order.qop}\nTelefon raqamingiz: ${order.phone}\nManzil: ${order.address}`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Tasdiqlash",
              callback_data: "confirm",
            },
            {
              text: "Bekor qilish",
              callback_data: "cancel",
            },
          ],
        ],
      },
    }
  );
});

scene.action("confirm", async (ctx: any) => {
  const userId = String(ctx.from?.id);
  const order = await prisma.order.findFirst({
    where: {
      user: {
        telegram_id: userId,
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
      status: "confirmed",
    },
  });

  await ctx.deleteMessage();
  ctx.reply("Buyurtma qabul qilindi.Adminlarimiz sizga aloqaga chiqishadi");

  ctx.telegram.sendMessage(
    -1002292346602,
    `Ismingiz: ${order.name}\nVazni: ${order.weight}\nKomir: ${order.type}\nQop: ${order.qop}\nTelefon raqamingiz: ${order.phone}\nManzil: ${order.address}`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Tasdiqlash",
              callback_data: `user:${order.id}:confirm`,
            },
            {
              text: "Bekor qilish",
              callback_data: `user:${order.id}:cancel`,
            },
          ],
        ],
      },
    }
  );
  return ctx.scene.enter("start");
});

scene.action("cancel", async (ctx: any) => {
  await ctx.deleteMessage();

  return ctx.scene.enter("control");
});

export default scene;
