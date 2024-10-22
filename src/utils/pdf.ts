const pdfMake = require("pdfmake");
const Printer = new pdfMake({});
const fs = require("fs");
const path = require("path");
const ishla = async (arr: any[], id: string) => {
  let doc = {
    content: [...arr],
    defaultStyle: {
      fontSize: 8,
    },
  };
  const time = new Date().getTime();
  const pdf = path.join(__dirname, "../src", `${time}.pdf`);
  let pdfDoc = Printer.createPdfKitDocument(doc);
  pdfDoc.pipe(fs.createWriteStream(pdf));
  pdfDoc.end();

  await sleep(500);

  return pdf;
};
async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = ishla;
