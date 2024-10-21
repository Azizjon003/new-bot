import prisma from "../../prisma/prisma";

const quessions = [
  ["Ismingnizni kiriting"],
  ["Manzilinginzi kiriting"],
  ["Ko'mir turini tanlang", ["АРЕШКА", "СЕМЕЧКА", "ОТБОР", "Хока"]],
  ["Nechchi tonna kerak sizga", ["1", "2", "3", "4", "5"]],
  ["Qop turini tanlang", ["Mayda Qop", "Naval"]],
  ["Telefon raqamingizni kiriting"],
];

const createQuession = async () => {
  try {
    for (let i = 0; i < quessions.length; i++) {
      await prisma.question.create({
        data: {
          question: quessions[i],
          number: i,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// createQuession();
