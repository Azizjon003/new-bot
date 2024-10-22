import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import { keyboards } from "../utils/keyboards";
const scene = new Scenes.BaseScene("start");

export let keyboard = [["Buyurtma berish", "Buyurtmalarim"]];
export let admin_keyboard = [["Userlarni ko'rish", "Xabar yuborish"]];

scene.enter(async (ctx: any) => {
  const user_id = ctx.from?.id;

  const user_name = ctx.from?.first_name || ctx.from?.username;

  const enable = await enabled(String(user_id), String(user_name));

  if (enable === "one" || enable === "four") {
    ctx.telegram.sendMessage(
      user_id,
      `Assalomu alaykum !
    🤗 Sizni "QORA OLTIN VODIYSI"ga ishga taklif qilamiz!
   
   📲Onlayn tarzda anketani to'ldiring, suhbatdan o'ting va safimizga qo'shiling!
   
    🔘Qulayliklar
   
   ▫️Qadriyatli va tajribali jamoa;
   ▫️Shaxsiy rivojlanish uchun imkoniyat;
   ▫️Yaxshi oylik daromad;
   ▫️Turli rag'batlantirish va bonuslar;
   ▫️O'qish va tajriba olish imkoniyati;
   ⚡️ SIZ UCHUN 12 OYLIK DOIMIY ISH❗️
   
   🙂 Talab etiladi:
   
   ▫️ Ishga mas'uliyatli bo'lish;
   ▫️ Xushmuomalalik;
   ▫️Natijaviylik va intizom.`,
      keyboards(keyboard)
    );

    console.log("start scene");
    return await ctx.scene.enter("control");
  } else if (enable === "two") {
    const text = "Assalomu alaykum Admin xush kelibsiz";

    ctx.telegram.sendMessage(user_id, text, keyboards(admin_keyboard));
    return await ctx.scene.enter("admin");
  } else if (enable === "three") {
    ctx.telegram.sendMessage(
      user_id,
      "Assalomu alaykum.Kechirasiz siz admin tomonidan bloklangansiz"
    );
    return;
  }
});

export default scene;
