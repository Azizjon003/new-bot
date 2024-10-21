import { Scenes } from "telegraf";
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

scene.hears("Admin", async (ctx) => {
  ctx.reply("Admin");
});
export default scene;
