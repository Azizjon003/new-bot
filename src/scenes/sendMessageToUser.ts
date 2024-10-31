import prisma from "../../prisma/prisma";
import scene from "./address";

scene.on("message", async (ctx: any) => {
  const text = ctx.message.text;
  const states = ctx.scene.session.state;

  if (states === "message") {
    // Xabar yuborish logikasi
    const user = await prisma.user.findFirst({
      where: {
        id: ctx.scene.session.userId,
      },
    });
    if (!user) {
      return ctx.reply("Foydalanuvchi topilmadi");
    }
    await ctx.telegram.sendMessage(user.telegram_id, text);
    return ctx.reply("Xabar yuborildi");
  } else {
    // User ID ni tekshirish va saqlash logikasi
    const userId = Number(text);
    const user = await prisma.user.findFirst({
      where: {
        telegram_id: String(userId),
      },
    });
    if (!user) {
      return ctx.reply("Foydalanuvchi topilmadi");
    }
    ctx.scene.session = {
      state: "message",
      userId,
    };
    return ctx.reply("Xabar matnini kiriting");
  }
});
