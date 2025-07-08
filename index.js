const fs = require("fs");
const miho = require("./MiHoMo");

async function main(uid, char, wight) {
  const mihomo = new miho.MiHoMo();
  try {
    const data = await mihomo.getApi(uid);
    const json = mihomo.getDataScore(data, char, wight);
    mihomo.createImg(json).then((canvas) => {
      fs.writeFileSync("output.png", canvas.toBuffer());
      console.log("Image created successfully!");
    });
  } catch (err) {
    if (err instanceof miho.ApiError) {
      console.error(`${err.status} : ${err.message})`);
    } else {
      console.error("何らかのエラーが発生しました:", err);
    }
  }
}
main("", 0); // ここへUIDとキャラ番号を入れてください。
// 例: main("830647229", 0);
