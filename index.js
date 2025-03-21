const { createCanvas, loadImage, registerFont } = require("canvas");
const fs = require("fs");
const data = require("./bfoData.json");
const aftData = require("./aftData.json");

// APIを叩く
async function main(uid) {
  const res = await fetch(`https://api.mihomo.me/sr_info_parsed/${uid}?lang=jp`);
  const data = await res.json();

  return data;
}

// キャラクターのデータを取得する
function getData(data, character) {
  let json = {
    uid: data["player"]["uid"], // uid
    id: data["characters"][character]["id"], // キャラID
    name: data["characters"][character]["name"], // キャラ名
    level: data["characters"][character]["level"], //キャラレベル
    icon: "StarRailRes/" + data["characters"][character]["portrait"], //キャラアイコン
    total_score: 0, // トータルスコア
    skill: [], // 軌跡
    rank_icons: [
      //凸数
      { icon: "StarRailRes/" + data["characters"][character]["rank_icons"][0], lock: true },
      { icon: "StarRailRes/" + data["characters"][character]["rank_icons"][1], lock: true },
      { icon: "StarRailRes/" + data["characters"][character]["rank_icons"][2], lock: true },
      { icon: "StarRailRes/" + data["characters"][character]["rank_icons"][3], lock: true },
      { icon: "StarRailRes/" + data["characters"][character]["rank_icons"][4], lock: true },
      { icon: "StarRailRes/" + data["characters"][character]["rank_icons"][5], lock: true },
    ],
    path: "StarRailRes/" + data["characters"][character]["path"]["icon"], //運命
    element: "StarRailRes/" + data["characters"][character]["element"]["icon"], //属性
    light_cone: [], //光円錐
    relics: [], //遺物
  };

  for (let i = 0; i < 4; i++) {
    json["skill"][i] = {
      level: data["characters"][character]["skills"][i]["level"],
      icon: "StarRailRes/" + data["characters"][character]["skills"][i]["icon"],
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
      icon: "StarRailRes/" + data["characters"][character]["light_cone"]["preview"],
      attributes: [
        {
          name: data["characters"][character]["light_cone"]["attributes"][0]["name"],
          icon: "StarRailRes/" + data["characters"][character]["light_cone"]["attributes"][0]["icon"],
          val: data["characters"][character]["light_cone"]["attributes"][0]["display"],
        },
        {
          name: data["characters"][character]["light_cone"]["attributes"][1]["name"],
          icon: "StarRailRes/" + data["characters"][character]["light_cone"]["attributes"][1]["icon"],
          val: data["characters"][character]["light_cone"]["attributes"][1]["display"],
        },
        {
          name: data["characters"][character]["light_cone"]["attributes"][2]["name"],
          icon: "StarRailRes/" + data["characters"][character]["light_cone"]["attributes"][2]["icon"],
          val: data["characters"][character]["light_cone"]["attributes"][2]["display"],
        },
      ],
    };
  } else {
    json.light_cone = null;
  }

  if (data["characters"][character]["relics"].length != 0) {
    for (let i = 0; i < data["characters"][character]["relics"].length; i++) {
      json["relics"][i] = {
        name: data["characters"][character]["relics"][i]["name"],
        rarity: data["characters"][character]["relics"][i]["rarity"],
        level: data["characters"][character]["relics"][i]["level"],
        icon: "StarRailRes/" + data["characters"][character]["relics"][i]["icon"],
        score: 0,
        part: data["characters"][character]["relics"][i]["type"],
        main_affix: {
          type: data["characters"][character]["relics"][i]["main_affix"]["type"],
          name: data["characters"][character]["relics"][i]["main_affix"]["name"]
            .replace(/.属性ダメージ/, "属性ダメ")
            .replace("会心ダメージ", "会心ダメ")
            .replace("EP回復効率", "EP回復"),
          icon: "StarRailRes/" + data["characters"][character]["relics"][i]["main_affix"]["icon"],
          val: data["characters"][character]["relics"][i]["main_affix"]["value"],
          dis: data["characters"][character]["relics"][i]["main_affix"]["display"],
        },
        sub_affix: [],
      };

      if (data["characters"][character]["relics"][i]["sub_affix"].length != 0) {
        for (let j = 0; j < data["characters"][character]["relics"][i]["sub_affix"].length; j++) {
          json["relics"][i]["sub_affix"][j] = {
            type: data["characters"][character]["relics"][i]["sub_affix"][j]["type"],
            name: data["characters"][character]["relics"][i]["sub_affix"][j]["name"].replace("会心ダメージ", "会心ダメ"),
            icon: "StarRailRes/" + data["characters"][character]["relics"][i]["sub_affix"][j]["icon"],
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
      name: data["characters"][character]["additions"][i]["name"].replace(/.属性ダメージ/, "属性ダメ").replace("会心ダメージ", "会心ダメ"),
      icon: "StarRailRes/" + data["characters"][character]["additions"][i]["icon"],
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

  const order = ["HP", "攻撃力", "防御力", "速度", "会心率", "会心ダメ", "撃破特効", "効果命中", "効果抵抗", "属性ダメ"];

  obj.sort((a, b) => {
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

  json.status = obj;

  return json;
}

// 遺物スコアの計算
function getScore(data) {
  let json = data;
  let mainScore = 0;
  let subScore = 0;
  let totalScore = 0;
  let weight = JSON.parse(fs.readFileSync("score.json", "utf-8"));
  let weight_none = JSON.parse(fs.readFileSync("none.json", "utf-8"));
  let maxVal = JSON.parse(fs.readFileSync("max_value.json", "utf-8"));
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

// 画像を生成
function createImg(data, char) {
  // let json = aftData;
  let get = getData(data, char);
  let json = getScore(get);

  const canvas = createCanvas(1920, 1080);
  const ctx = canvas.getContext("2d");

  registerFont("./font/kt.ttf", { family: "kt" });

  loadImage("./img/back.jpg").then((img) => {
    ctx.drawImage(img, 0, 0, 1920, 1080);
  });

  loadImage(json["icon"]).then((img) => {
    ctx.drawImage(img, 200, -80, img.width / 1.5, img.height / 1.5);
  });

  loadImage(json["element"]).then((img) => {
    ctx.drawImage(img, 150, 75, img.width / 5, img.height / 5);
  });
  loadImage(json["path"]).then((img) => {
    ctx.drawImage(img, 200, 79, img.width / 5.2, img.height / 5.2);
  });

  for (let i = 0; i < json["status"].length; i++) {
    loadImage(json["status"][i]["icon"]).then((img) => {
      if (i == 0) {
        fillRoundRect(ctx, 20, 150, 480, 630, 30, "rgba(0, 0, 0, 0.5)");
      }
      ctx.drawImage(img, 40, 165 + i * 60, img.width / 2.3, img.height / 2.3);

      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.font = '38px "kt"';
      ctx.fillText(json["status"][i]["name"], 95, 210 + i * 60);
      ctx.textAlign = "right";
      ctx.fillText(json["status"][i]["val"], 470, 210 + i * 60);
      ctx.textAlign = "start";
    });
  }

  if (json["light_cone"] != null) {
    loadImage(json["light_cone"]["icon"]).then((img) => {
      fillRoundRect(ctx, 20, 800, 480, 260, 30, "rgba(0,0,0,0.5)");

      ctx.font = '35px "kt"';
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.fillText(json["light_cone"]["name"], 250, 860);
      ctx.fillText("Lv. " + json["light_cone"]["level"] + " R" + json["light_cone"]["rank"], 250, 900);

      ctx.drawImage(img, 50, 820, 160.5, 199);
    });
    loadImage("StarRailRes/icon/deco/Rarity" + json["light_cone"]["rarity"] + ".png").then((img) => {
      if (json["light_cone"]["rarity"] == 3) ctx.drawImage(img, -25, 970, img.width / 1.5, img.height / 1.5);
      else if (json["light_cone"]["rarity"] == 4) ctx.drawImage(img, -45, 970, img.width / 1.5, img.height / 1.5);
      else ctx.drawImage(img, -55, 970, img.width / 1.5, img.height / 1.5);
    });
    for (let i = 0; i < json["light_cone"]["attributes"].length; i++) {
      loadImage(json["light_cone"]["attributes"][i]["icon"]).then((img) => {
        ctx.drawImage(img, 240, 900 + i * 40, img.width / 2.5, img.height / 2.5);

        ctx.font = "30px 'kt'";
        ctx.fillText(json["light_cone"]["attributes"][i]["name"], 300, 940 + i * 40);
        ctx.textAlign = "right";
        ctx.fillText(json["light_cone"]["attributes"][i]["val"], 470, 940 + i * 40);
        ctx.textAlign = "start";
      });
    }
  }

  for (let i = 0; i < json["skill"].length; i++) {
    loadImage("./img/back_icon.png").then((img) => {
      ctx.drawImage(img, 540, 220 + i * 150, img.width / 1.3, img.height / 1.3);
    });
    loadImage(json["skill"][i]["icon"]).then((img) => {
      ctx.drawImage(img, 540, 220 + i * 150, img.width / 1.3, img.height / 1.3);
      ctx.font = '40px "kt"';
      ctx.fillStyle = "rgb(255, 255, 255)";
      if (json["skill"][i]["level"].toString().length == 1) {
        ctx.fillText(json["skill"][i]["level"], 575, 355 + i * 150);
      } else if (json["skill"][i]["level"].toString().length == 2) {
        ctx.fillText(json["skill"][i]["level"], 560, 355 + i * 150);
      }
    });
  }

  for (let i = 0; i < json["rank_icons"].length; i++) {
    loadImage("./img/back_icon.png").then((img) => {
      ctx.drawImage(img, 1100, 130 + i * 150, img.width / 1.3, img.height / 1.3);
    });
    loadImage(json["rank_icons"][i]["icon"]).then((img) => {
      ctx.drawImage(img, 1100, 130 + i * 150, img.width / 1.3, img.height / 1.3);
    });
    if (json["rank_icons"][i]["lock"] == true) {
      loadImage("./img/back_icon.png").then((img) => {
        ctx.drawImage(img, 1100, 130 + i * 150, img.width / 1.3, img.height / 1.3);
      });
    }
  }

  if (json["relics"].length != 0) {
    for (let i = 0; i < json["relics"].length; i++) {
      loadImage(json["relics"][i]["icon"]).then((img) => {
        fillRoundRect(ctx, 1230, 50 + i * 170, 670, 150, 30, "rgba(0,0,0,0.6)");
        ctx.drawImage(img, 1240, 55 + i * 170, img.width / 2, img.height / 2);
      });
      loadImage(json["relics"][i]["main_affix"]["icon"]).then((img) => {
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
      loadImage("StarRailRes/icon/deco/Rarity" + json["light_cone"]["rarity"] + ".png").then((img) => {
        ctx.drawImage(img, 1180, 140 + i * 170, img.width / 2, img.height / 2);
        ctx.font = "25px 'kt'";
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillText("Lv. " + json["relics"][i]["level"], 1430, 185 + i * 170);
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.strokeText("Lv. " + json["relics"][i]["level"], 1430, 185 + i * 170);
      });

      for (let j = 0; j < json["relics"][i]["sub_affix"].length; j++) {
        loadImage(json["relics"][i]["sub_affix"][j]["icon"]).then((img) => {
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

  setTimeout(() => {
    ctx.font = '60px "kt"';
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillText(json["name"], 40, 70);

    ctx.font = '35px "kt"';
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillText("Lv. " + json["level"], 45, 120);
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.strokeText("Lv. " + json["level"], 45, 120);

    fillRoundRect(ctx, 630, 800, 460, 180, 30, "rgba(0,0,0,0.6)");
    ctx.font = '40px "kt"';
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillText("Total Score", 670, 850);
    ctx.font = '80px "kt"';
    ctx.fillText(json["total_score"], 680, 930);
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.strokeText(json["total_score"], 680, 930);

    scoreRank = "D";
    if (json["total_score"] >= 600) scoreRank = "SS";
    else if (json["total_score"] >= 540) scoreRank = "S";
    else if (json["total_score"] >= 360) scoreRank = "A";
    else if (json["total_score"] >= 240) scoreRank = "B";
    else if (json["total_score"] >= 60) scoreRank = "C";
    ctx.font = '130px "kt"';
    ctx.fillText(scoreRank, 940, 930);
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.strokeText(scoreRank, 940, 930);

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
    fs.writeFileSync("output.png", canvas.toBuffer());
  }, 100);

  // 角丸の四角形を作成する
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

main(/* ここにuidを入力 */)
  .then((data) => createImg(data, 0))
  .catch(console.error);
