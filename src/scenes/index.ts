const { Scenes } = require("telegraf");
import address from "./address";
import admin from "./admin";
import buyurtma from "./buyurtma";
import control from "./control";
import phone from "./phone";
import sendMessage from "./sendMessage";
import start from "./start";
import weight from "./weight";
const stage = new Scenes.Stage([
  start,
  control,
  buyurtma,
  weight,
  phone,
  address,
  admin,
  sendMessage,
]);

export default stage;
