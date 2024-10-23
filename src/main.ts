require("dotenv").config();
import console from "console";
import { Context, Middleware } from "telegraf";
import { SceneContext } from "telegraf/typings/scenes";
import prisma from "../prisma/prisma";
import bot from "./core/bot";
import session from "./core/session";
import stage from "./scenes/index";
import botStart from "./utils/startBot";

bot.use(session);

const middleware: Middleware<Context | SceneContext> = (ctx: any, next) => {
  ctx?.session ?? (ctx.session = {});
};

bot.use(stage.middleware());

bot.use((ctx: any, next) => {
  console.log("next", ctx?.session);
  return next();
});

bot.start(async (ctx: any) => {
  return await ctx.scene.enter("start");
});

bot.hears(
  ["Yangi Taqdimot", "Balans", "Do'stlarimni taklif qilish", "Bosh menyu"], //  commandlar bot o'chib qolgan vaziyatda user qayta startni  bosganda javob berish uchun
  async (ctx: any) => {
    ctx.reply("Nomalum buyruq.Qayta /start buyrug'ini bosing");
  }
);

bot.catch(async (err: any, ctx) => {
  const userId = ctx?.from?.id;
  if (userId) {
    await bot.telegram.sendMessage(
      userId,
      "Xatolik yuz berdi. Iltimos qayta urinib ko'ring\n /start buyrug'ini bosib qayta urunib ko'ring"
    );
  }

  console.log(err);
  console.log(`Ooops, encountered an error for ${ctx}`, err);
});

bot.action(/user:[a-zA-Z0-9]+/, async (ctx: any) => {
  const [_, orderId, action] = ctx.callbackQuery.data.split(":");
  const messageId = ctx.callbackQuery.message?.message_id;
  const chatId = ctx.callbackQuery.message?.chat.id;
  const inlineMessageId = ctx.callbackQuery.inline_message_id;
  console.log(orderId, action);
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      user: true,
    },
  });

  if (!order) {
    return;
  }
  try {
    if (action === "confirm") {
      ctx.telegram.deleteMessage(chatId, messageId);

      ctx.telegram.sendMessage(
        -1002292346602,
        `Kim tomonidan yuborildi <a href="tg://user?id=${order.user?.telegram_id}">${order.user?.telegram_id}\nIsmingiz: ${order.name}\nVazni: ${order.weight}\nKomir: ${order.type}\nQop: ${order.qop}\nTelefon raqamingiz: ${order.phone}\nManzil: ${order.address} \n Buyurtma #${orderId} tasdiqlandi`
      );

      await ctx.telegram.sendMessage(
        order.user?.telegram_id,
        "Buyurtmangiz tasdiqlandi"
      );

      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: "active",
        },
      });
    } else if (action === "cancel") {
      ctx.telegram.deleteMessage(chatId, messageId);

      ctx.telegram.sendMessage(
        -1002292346602,
        `Kim tomonidan yuborildi <a href="tg://user?id=${order.user?.telegram_id}">${order.user?.telegram_id}\nIsmingiz: ${order.name}\nVazni: ${order.weight}\nKomir: ${order.type}\nQop: ${order.qop}\nTelefon raqamingiz: ${order.phone}\nManzil: ${order.address} \n Buyurtma #${orderId} bekor qilindi`
      );

      await ctx.telegram.sendMessage(
        order.user?.telegram_id,
        "Buyurtmangiz bekor qilindi"
      );

      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: "cancel",
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
});

botStart(bot);

process.on("uncaughtException", (error) => {
  console.log("Ushlanmagan istisno:", error, "Sabab:", new Date());
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Ushlanmagan rad etilgan va'da:", promise, "Sabab:", new Date());
});
