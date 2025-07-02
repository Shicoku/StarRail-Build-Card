const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs");

const config = {
  scorePath: "./score.json",
  StarRailPath: "./StarRailRes/",
};

// APIを叩く
async function getApi(uid) {
  const res = await fetch(`https://api.mihomo.me/sr_info_parsed/${uid}?lang=jp`);
  const data = await res.json();

  return data;
}

// キャラデータを取得する
function getCharData(name) {
  const charData = JSON.parse(fs.readFileSync("./StarRailRes/index_min/jp/characters.json"));
  for (const id in charData) {
    const char = charData[id];
    if (char.name.includes(name)) {
      return char;
    }
  }
  return null;
}

//データを取得する
function getDataBase(data, character) {
  let json = {
    uid: data["player"]["uid"], // uid
    id: data["characters"][character]["id"], // キャラID
    name: data["characters"][character]["name"], // キャラ名
    level: data["characters"][character]["level"], //キャラレベル
    icon: config.StarRailPath + data["characters"][character]["portrait"], //キャラアイコン
    total_score: 0, // トータルスコア
    skill: [], // 軌跡
    rank_icons: [
      //凸数
      { icon: config.StarRailPath + data["characters"][character]["rank_icons"][0], lock: true },
      { icon: config.StarRailPath + data["characters"][character]["rank_icons"][1], lock: true },
      { icon: config.StarRailPath + data["characters"][character]["rank_icons"][2], lock: true },
      { icon: config.StarRailPath + data["characters"][character]["rank_icons"][3], lock: true },
      { icon: config.StarRailPath + data["characters"][character]["rank_icons"][4], lock: true },
      { icon: config.StarRailPath + data["characters"][character]["rank_icons"][5], lock: true },
    ],
    path: config.StarRailPath + data["characters"][character]["path"]["icon"], //運命
    element: config.StarRailPath + data["characters"][character]["element"]["icon"], //属性
    light_cone: [], //光円錐
    relics: [], //遺物
    relic_sets: [], //遺物セット
  };

  for (let i = 0; i < 4; i++) {
    json["skill"][i] = {
      level: data["characters"][character]["skills"][i]["level"],
      icon: config.StarRailPath + data["characters"][character]["skills"][i]["icon"],
    };
  }

  for (let i = 0; i < data["characters"][character]["rank"]; i++) {
    json["rank_icons"][i]["lock"] = false;
  }

  if (data["characters"][character]["light_cone"] != null) {
    json.light_cone = {
      name: data["characters"][character]["light_cone"]["name"],
      rarity: data["characters"][character]["light_cone"]["rarity"],
      rank: data["characters"][character]["light_cone"]["rank"],
      level: data["characters"][character]["light_cone"]["level"],
      icon: config.StarRailPath + data["characters"][character]["light_cone"]["preview"],
      attributes: [
        {
          name: data["characters"][character]["light_cone"]["attributes"][0]["name"],
          icon: config.StarRailPath + data["characters"][character]["light_cone"]["attributes"][0]["icon"],
          val: data["characters"][character]["light_cone"]["attributes"][0]["display"],
        },
        {
          name: data["characters"][character]["light_cone"]["attributes"][1]["name"],
          icon: config.StarRailPath + data["characters"][character]["light_cone"]["attributes"][1]["icon"],
          val: data["characters"][character]["light_cone"]["attributes"][1]["display"],
        },
        {
          name: data["characters"][character]["light_cone"]["attributes"][2]["name"],
          icon: config.StarRailPath + data["characters"][character]["light_cone"]["attributes"][2]["icon"],
          val: data["characters"][character]["light_cone"]["attributes"][2]["display"],
        },
      ],
    };
  }

  if (data["characters"][character]["relics"].length != 0) {
    for (let i = 0; i < data["characters"][character]["relics"].length; i++) {
      json["relics"][i] = {
        name: data["characters"][character]["relics"][i]["name"],
        rarity: data["characters"][character]["relics"][i]["rarity"],
        level: data["characters"][character]["relics"][i]["level"],
        icon: config.StarRailPath + data["characters"][character]["relics"][i]["icon"],
        score: 0,
        part: data["characters"][character]["relics"][i]["type"],
        main_affix: {
          type: data["characters"][character]["relics"][i]["main_affix"]["type"],
          name: data["characters"][character]["relics"][i]["main_affix"]["name"]
            .replace(/..?属性ダメージ/, "属性ダメ")
            .replace("会心ダメージ", "会心ダメ")
            .replace("EP回復効率", "EP回復"),
          icon: config.StarRailPath + data["characters"][character]["relics"][i]["main_affix"]["icon"],
          val: data["characters"][character]["relics"][i]["main_affix"]["value"],
          dis: data["characters"][character]["relics"][i]["main_affix"]["display"],
        },
        sub_affix: [],
      };

      if (data["characters"][character]["relic_sets"] != 0) {
        for (let i = 0; i < data["characters"][character]["relic_sets"].length; i++) {
          json["relic_sets"][i] = {
            name: data["characters"][character]["relic_sets"][i]["name"],
            icon: config.StarRailPath + data["characters"][character]["relic_sets"][i]["icon"],
            num: data["characters"][character]["relic_sets"][i]["num"],
          };
        }
      }

      if (data["characters"][character]["relics"][i]["sub_affix"].length != 0) {
        for (let j = 0; j < data["characters"][character]["relics"][i]["sub_affix"].length; j++) {
          json["relics"][i]["sub_affix"][j] = {
            type: data["characters"][character]["relics"][i]["sub_affix"][j]["type"],
            name: data["characters"][character]["relics"][i]["sub_affix"][j]["name"].replace("会心ダメージ", "会心ダメ"),
            icon: config.StarRailPath + data["characters"][character]["relics"][i]["sub_affix"][j]["icon"],
            val: data["characters"][character]["relics"][i]["sub_affix"][j]["value"],
            dis: data["characters"][character]["relics"][i]["sub_affix"][j]["display"],
          };
        }
      }
    }
  }

  let obj = [];
  for (let i = 0; i < data["characters"][character]["additions"].length; i++) {
    obj.push({
      name: data["characters"][character]["additions"][i]["name"].replace(/..?属性ダメージ/, "属性ダメ").replace("会心ダメージ", "会心ダメ"),
      icon: config.StarRailPath + data["characters"][character]["additions"][i]["icon"],
      val: data["characters"][character]["additions"][i]["display"],
    });

    for (let j = 0; j < data["characters"][character]["attributes"].length; j++) {
      if (data["characters"][character]["additions"][i]["name"] == data["characters"][character]["attributes"][j]["name"]) {
        if (data["characters"][character]["additions"][i]["percent"] == false) {
          obj[i]["val"] = (data["characters"][character]["additions"][i]["value"] + data["characters"][character]["attributes"][j]["value"]).toFixed(0);
        } else {
          obj[i]["val"] = ((data["characters"][character]["additions"][i]["value"] + data["characters"][character]["attributes"][j]["value"]) * 100).toFixed(1) + "%";
        }
      }
    }
  }

  const order = ["HP", "攻撃力", "防御力", "速度", "会心率", "会心ダメ", "撃破特効", "EP回復効率", "効果命中", "効果抵抗", "治癒量", "属性ダメ"];

  obj.sort((a, b) => {
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  json.status = obj;

  return json;
}

// 遺物スコアの計算
function getDataScore(data, char) {
  let json = getDataBase(data, char);
  let mainScore = 0;
  let subScore = 0;
  let totalScore = 0;
  const weight = JSON.parse(fs.readFileSync(config.scorePath, "utf-8"));
  const weight_none = JSON.parse(fs.readFileSync("./assets/score/none.json", "utf-8"));
  const maxVal = JSON.parse(fs.readFileSync("./assets/score/max_value.json", "utf-8"));
  let main_weight;
  let sub_weight;

  for (let i = 0; i < json["relics"].length; i++) {
    if (json["id"] in weight) {
      main_weight = weight[json["id"]]["main"][json["relics"][i]["part"]][json["relics"][i]["main_affix"]["type"]];
    } else {
      main_weight = weight_none["main"][json["relics"][i]["part"]][json["relics"][i]["main_affix"]["type"]];
    }

    mainScore = Number((((json["relics"][i]["level"] + 1) / 16) * main_weight * 100).toFixed(1));
    subScore = 0;

    for (let j = 0; j < json["relics"][i]["sub_affix"].length; j++) {
      if (json["id"] in weight) {
        sub_weight = weight[json["id"]]["weight"][json["relics"][i]["sub_affix"][j]["type"]];
      } else {
        sub_weight = weight_none["weight"][json["relics"][i]["sub_affix"][j]["type"]];
      }

      subScore += Number((json["relics"][i]["sub_affix"][j]["val"] / maxVal[json["relics"][i]["sub_affix"][j]["type"]]) * sub_weight * 100);
    }
    json["relics"][i]["score"] = (mainScore * 0.5 + subScore * 0.5).toFixed(1);

    totalScore += Number((mainScore * 0.5 + subScore * 0.5).toFixed(1));
  }

  json["total_score"] = totalScore.toFixed(1);

  return json;
}

// 画像を生成する
async function createImg(json) {
  // キャンバスの設定
  const canvas = createCanvas(1920, 1080);
  const ctx = canvas.getContext("2d");

  registerFont("assets/font/kt.ttf", { family: "kt" }); // フォントの指定

  //背景画像の指定
  await loadImage("./assets/img/back.jpg").then((img) => {
    ctx.drawImage(img, 0, 0, 1920, 1080);
  });

  // キャラ描画
  await loadImage(json["icon"]).then((img) => {
    ctx.drawImage(img, 200, -90, img.width / 1.5, img.height / 1.5);
  });

  // 属性と運命アイコン描画
  await loadImage(json["element"]).then((img) => {
    ctx.drawImage(img, 150, 75, img.width / 5, img.height / 5);
  });
  await loadImage(json["path"]).then((img) => {
    ctx.drawImage(img, 200, 79, img.width / 10, img.height / 10);
  });

  // ステータス描画
  let inter = 0;
  if (json["status"].length == 11) inter = 55;
  if (json["status"].length == 10) inter = 60;
  if (json["status"].length == 9) inter = 65;
  for (let i = 0; i < json["status"].length; i++) {
    await loadImage(json["status"][i]["icon"]).then((img) => {
      if (i == 0) {
        fillRoundRect(ctx, 20, 140, 480, 630, 30, "rgba(0, 0, 0, 0.5)");
      }
      ctx.drawImage(img, 40, 155 + i * inter, img.width / 2.3, img.height / 2.3);

      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.font = '38px "kt"';
      ctx.fillText(json["status"][i]["name"], 95, 200 + i * inter);
      ctx.textAlign = "right";
      ctx.fillText(json["status"][i]["val"], 470, 200 + i * inter);
      ctx.textAlign = "start";
    });
  }

  // 光円錐描画
  if (json["light_cone"] != null) {
    await loadImage(json["light_cone"]["icon"]).then((img) => {
      fillRoundRect(ctx, 20, 780, 480, 260, 30, "rgba(0,0,0,0.5)");

      ctx.font = '20px "kt"';
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText(json["light_cone"]["name"], 250, 830);
      ctx.font = '35px "kt"';
      ctx.fillText("Lv. " + json["light_cone"]["level"] + " R" + json["light_cone"]["rank"], 250, 880);

      ctx.drawImage(img, 50, 810, 160.5, 199);
    });
    await loadImage("StarRailRes/icon/deco/Rarity" + json["light_cone"]["rarity"] + ".png").then((img) => {
      if (json["light_cone"]["rarity"] == 3) ctx.drawImage(img, -25, 950, img.width / 1.5, img.height / 1.5);
      else if (json["light_cone"]["rarity"] == 4) ctx.drawImage(img, -45, 950, img.width / 1.5, img.height / 1.5);
      else ctx.drawImage(img, -55, 950, img.width / 1.5, img.height / 1.5);
    });
    for (let i = 0; i < json["light_cone"]["attributes"].length; i++) {
      await loadImage(json["light_cone"]["attributes"][i]["icon"]).then((img) => {
        ctx.drawImage(img, 240, 880 + i * 40, img.width / 2.5, img.height / 2.5);

        ctx.font = "30px 'kt'";
        ctx.fillText(json["light_cone"]["attributes"][i]["name"], 300, 920 + i * 40);
        ctx.textAlign = "right";
        ctx.fillText(json["light_cone"]["attributes"][i]["val"], 470, 920 + i * 40);
        ctx.textAlign = "start";
      });
    }
  }

  // 軌跡描画
  for (let i = 0; i < json["skill"].length; i++) {
    await loadImage("./assets/img/back_icon.png").then((img) => {
      ctx.drawImage(img, 540, 220 + i * 150, img.width / 1.3, img.height / 1.3);
    });
    await loadImage(json["skill"][i]["icon"]).then((img) => {
      ctx.drawImage(img, 540, 220 + i * 150, img.width / 1.3, img.height / 1.3);
      fillRoundRect(ctx, 540, 320 + i * 150, 90, 40, 10, "rgba(0,0,0,0.5)");
      ctx.font = '40px "kt"';
      ctx.fillStyle = "rgb(255, 255, 255)";
      if (json["skill"][i]["level"].toString().length == 1) {
        ctx.fillText(json["skill"][i]["level"], 575, 355 + i * 150);
      } else if (json["skill"][i]["level"].toString().length == 2) {
        ctx.fillText(json["skill"][i]["level"], 560, 355 + i * 150);
      }
    });
  }

  // 凸数描画
  for (let i = 0; i < json["rank_icons"].length; i++) {
    await loadImage("./assets/img/back_icon.png").then((img) => {
      ctx.drawImage(img, 1100, 130 + i * 150, img.width / 1.3, img.height / 1.3);
    });
    await loadImage(json["rank_icons"][i]["icon"]).then((img) => {
      ctx.drawImage(img, 1100, 130 + i * 150, img.width / 1.3, img.height / 1.3);
    });
    if (json["rank_icons"][i]["lock"] == true) {
      await loadImage("./assets/img/back_icon.png").then((img) => {
        ctx.drawImage(img, 1100, 130 + i * 150, img.width / 1.3, img.height / 1.3);
      });
    }
  }

  // 遺物描画
  if (json["relics"]) {
    for (let i = 0; i < json["relics"].length; i++) {
      await loadImage(json["relics"][i]["icon"]).then((img) => {
        fillRoundRect(ctx, 1230, 50 + i * 170, 670, 150, 30, "rgba(0,0,0,0.6)");
        ctx.drawImage(img, 1240, 55 + i * 170, img.width, img.height);
      });
      await loadImage(json["relics"][i]["main_affix"]["icon"]).then((img) => {
        ctx.drawImage(img, 1350, 70 + i * 170, img.width / 2.6, img.height / 2.6);
        ctx.font = "30px 'kt'";
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillText(json["relics"][i]["main_affix"]["name"], 1400, 105 + i * 170);
        ctx.textAlign = "right";
        ctx.font = "40px 'kt'";
        ctx.fillText(json["relics"][i]["main_affix"]["dis"], 1480, 155 + i * 170);
        ctx.fillRect(1530, 50 + i * 170, 5, 150);
        ctx.textAlign = "start";
      });
      await loadImage("StarRailRes/icon/deco/Rarity" + json["relics"][i]["rarity"] + ".png").then((img) => {
        ctx.drawImage(img, 1180, 140 + i * 170, img.width / 2, img.height / 2);
        ctx.font = "25px 'kt'";
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillText("Lv. " + json["relics"][i]["level"], 1430, 185 + i * 170);
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.strokeText("Lv. " + json["relics"][i]["level"], 1430, 185 + i * 170);
      });

      for (let j = 0; j < json["relics"][i]["sub_affix"].length; j++) {
        await loadImage(json["relics"][i]["sub_affix"][j]["icon"]).then((img) => {
          ctx.drawImage(img, 1540, 50 + (i * 170 + j * 34), img.width / 2.7, img.height / 2.7);
          ctx.font = "25px 'kt'";
          ctx.fillStyle = "rgb(255, 255, 255)";
          ctx.fillText(json["relics"][i]["sub_affix"][j]["name"], 1590, 80 + (i * 170 + j * 34));
          ctx.font = '25px "kt"';
          ctx.fillStyle = "rgba(255, 255, 255)";
          ctx.textAlign = "right";
          ctx.fillText(json["relics"][i]["sub_affix"][j]["dis"], 1765, 80 + (i * 170 + j * 34));
          ctx.strokeStyle = "rgb(255, 255, 255)";
          ctx.strokeText(json["relics"][i]["sub_affix"][j]["dis"], 1765, 80 + (i * 170 + j * 34));
          ctx.textAlign = "start";
        });
      }
    }
  }

  // 遺物セット描画
  if (json["relic_sets"]) {
    fillRoundRect(ctx, 660, 805, 400, 90, 30, "rgba(0,0,0,0.6)");
    let i = 0;
    let point = 0;
    if (json["relic_sets"][0]["name"] == json["relic_sets"][1]["name"]) i = 1;
    for (i; i < json["relic_sets"].length; i++) {
      await loadImage(json["relic_sets"][i]["icon"]).then((img) => {
        ctx.drawImage(img, 680 + point * 130, 820, 70, 70);

        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.textAlign = "left";
        ctx.font = '30px "kt"';
        ctx.fillText("x" + json["relic_sets"][i]["num"], 750 + point * 130, 870);
      });
      point++;
    }
  }

  // キャラ名描画
  ctx.font = '60px "kt"';
  ctx.textAlign = "start";
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText(json["name"], 40, 70);

  // キャラレベル描画
  ctx.font = '35px "kt"';
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText("Lv. " + json["level"], 45, 120);
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.strokeText("Lv. " + json["level"], 45, 120);

  // スコア描画
  fillRoundRect(ctx, 660, 900, 400, 170, 30, "rgba(0,0,0,0.6)");
  ctx.font = '40px "kt"';
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText("Total Score", 690, 950);
  ctx.font = '80px "kt"';
  ctx.fillText(json["total_score"], 700, 1030);
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.strokeText(json["total_score"], 700, 1030);

  scoreRank = "D";
  if (json["total_score"] >= 600) scoreRank = "SS";
  else if (json["total_score"] >= 540) scoreRank = "S";
  else if (json["total_score"] >= 360) scoreRank = "A";
  else if (json["total_score"] >= 240) scoreRank = "B";
  else if (json["total_score"] >= 60) scoreRank = "C";
  ctx.font = '130px "kt"';
  ctx.fillText(scoreRank, 920, 1030);
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.strokeText(scoreRank, 920, 1030);

  // 遺物スコア描画
  if (json["relics"]) {
    for (let i = 0; i < json["relics"].length; i++) {
      ctx.fillRect(1780, 50 + i * 170, 5, 150);

      ctx.font = '30px "kt"';
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText("Score", 1795, 90 + i * 170);
      ctx.strokeStyle = "rgb(255, 255, 255)";
      ctx.strokeText("Score", 1795, 90 + i * 170);
      ctx.font = '35px "kt"';
      ctx.fillText(json["relics"][i]["score"], 1800, 130 + i * 170);
      ctx.strokeText(json["relics"][i]["score"], 1800, 130 + i * 170);

      let scoreRank = "D";
      if (json["relics"][i]["score"] >= 100) scoreRank = "SS";
      else if (json["relics"][i]["score"] >= 90) scoreRank = "S";
      else if (json["relics"][i]["score"] >= 60) scoreRank = "A";
      else if (json["relics"][i]["score"] >= 40) scoreRank = "B";
      else if (json["relics"][i]["score"] >= 10) scoreRank = "C";
      ctx.fillText(scoreRank, 1830, 180 + i * 170);
      ctx.strokeText(scoreRank, 1830, 180 + i * 170);
    }
  }

  // クレジット描画
  ctx.font = '25px "kt"';
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.fillText("Powered by MiHoMo API & Made by Shicoku", 22, 1065);

  return canvas;

  function fillRoundRect(ctx, x, y, w, h, r, c) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arc(x + w - r, y + r, r, Math.PI * (3 / 2), 0, false);
    ctx.lineTo(x + w, y + h - r);
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * (1 / 2), false);
    ctx.lineTo(x + r, y + h);
    ctx.arc(x + r, y + h - r, r, Math.PI * (1 / 2), Math.PI, false);
    ctx.lineTo(x, y + r);
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * (3 / 2), false);
    ctx.closePath();
    ctx.fill();
  }
}

module.exports = {
  config,
  getApi,
  getCharData,
  getDataBase,
  getDataScore,
  createImg,
};
