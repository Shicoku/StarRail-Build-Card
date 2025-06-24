const fs = require("fs");
const MiHoMo = require("./MiHoMo");

async function main(uid) {
  const data = await MiHoMo.getApi(uid);
  const get = MiHoMo.getData(data, 1);
  const json = MiHoMo.getScore(get);
  MiHoMo.createImg(json)
    .then((canvas) => {
      fs.writeFileSync("output.png", canvas.toBuffer());
      console.log("Image created successfully!");
    })
    .catch((err) => {
      console.error("Error occurred:", err);
    });
}
main(""); // ここへUIDを入力してください
// 例: main("1234567890");
