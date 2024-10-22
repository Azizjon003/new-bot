import { Scenes } from "telegraf";
import prisma from "../../prisma/prisma";
const scene = new Scenes.BaseScene("control");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.hears("Buyurtma berish", async (ctx: any) => {
  const user_id = ctx.from?.id;
  const text = `Ismingizni kiriting: `;
  ctx.reply(text);
  return await ctx.scene.enter("buyurtma");
});
scene.hears("Buyurtmalarim", async (ctx: any) => {
  const user_id = ctx.from?.id;
  const orders = await prisma.order.findMany({
    where: {
      user: {
        telegram_id: String(user_id),
      },
    },
  });

  let text = "";

  orders.forEach((order, index) => {
    text += `${index + 1} /${order.id} ${order.status}\n`;
  });

  ctx.reply(text);
});

scene.hears(/^\/[a-zA-Z0-9]{25}$/, async (ctx: any) => {
  const orderId = ctx.message.text.slice(1);
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    return ctx.reply("Buyurtma topilmadi");
  }

  let text = `Ismingiz: ${order.name}\nVazni: ${order.weight}\nKomir: ${order.type}\nQop: ${order.qop}\nTelefon raqamingiz: ${order.phone}\nManzil: ${order.address}`;

  if (order.status === "active") {
    text += `\nBuyurtma tasdiqlandi`;
  } else if (order.status === "canceled") {
    text += `\nBuyurtma bekor qilindi`;
  }

  ctx.reply(text);
});

export default scene;
