const { Scenes } = require("telegraf");
import address from "./address";
import buyurtma from "./buyurtma";
import control from "./control";
import phone from "./phone";
import start from "./start";
import weight from "./weight";

const stage = new Scenes.Stage([
  start,
  control,
  buyurtma,
  weight,
  phone,
  address,
]);

export default stage;
