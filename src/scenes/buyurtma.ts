import { Scenes } from "telegraf";
import prisma from "../../prisma/prisma";
const scene = new Scenes.BaseScene("buyurtma");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

const komirKeyboard = [
  {
    text: "Areshka",
    callback_data: "Areshka",
  },
  {
    text: "Semechka",
    callback_data: "Semechka",
  },
  {
    text: "Otbor",
    callback_data: "Otbor",
  },
  {
    text: "Xoka",
    callback_data: "Xoka",
  },
];
scene.on("message", async (ctx: any) => {
  const text = ctx.message.text;

  ctx.scene.session.name = text;

  const user_id = String(ctx.from?.id);

  const user = await prisma.user.findFirst({
    where: {
      telegram_id: user_id,
    },
  });

  if (!user) {
    return ctx.reply("Qayta start bosing");
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      name: text,
    },
  });

  console.log(ctx.scene.session, "buyurtma", ctx.scene.state);
  ctx.reply("Ko'mir turini tanlang", {
    reply_markup: {
      inline_keyboard: [komirKeyboard],
    },
  });
});

scene.action(["Areshka", "Semechka", "Otbor", "Xoka"], async (ctx: any) => {
  const text = ctx.callbackQuery.data;
  ctx.scene.session.komir = text;
  let link;
  switch (text) {
    case "Otbor":
      link = "https://t.me/mobi_center_baza/17";
    case "Areshka":
      link = "https://t.me/mobi_center_baza/18";
    case "Semechka":
      link = "https://t.me/mobi_center_baza/19";
    case "Xoka":
      link = "https://t.me/mobi_center_baza/20";
  }

  ctx.replyWithVideo(link, {
    caption: "Tasdiqlash uchun bosing 👇",
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
  });
});

scene.action("confirm", async (ctx: any) => {
  const { name, komir } = ctx.scene.session;

  const text = `Necci tonna olasiz ?`;

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
      type: komir,
    },
  });

  ctx.reply(text);
  return await ctx.scene.enter("weight");
});

scene.action("cancel", async (ctx) => {
  await ctx.deleteMessage();
  await ctx.reply("Ko'mir turini tanlang", {
    reply_markup: {
      inline_keyboard: [komirKeyboard],
    },
  });
});

export default scene;
