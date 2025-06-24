# 使い方

本プロジェクトのモジュールの使い方を説明します。

## モジュールの読み込み

本プログラムはモジュールによって動作させることが可能になっています。
<br />読み込みは以下のようにします。

```js
const MiHoMo = require("./MiHoMo");
```

また、画像ファイルとして出力したい場合、fs モジュールを使うことによって可能です。

```js
const fs = require("fs");
```

## コンフィグ設定

コンフィグを変更することによって、各ユーザーがある程度カスタマイズできるようにしています。
<br />以下については、[StarRailScore](https://github.com/Mar-7th/StarRailScore) でクローンした score.json のファイルパスを変更する例を示します。

```js
MiHoMo.config.scorePath = "./score/score.json";
```

### コンフィグ一覧

| コンフィグ名 | 値           | 内容                            |
| ------------ | ------------ | ------------------------------- |
| scorePath    | Path(string) | score.json のファイルパスの指定 |

※今後、コンフィグ内容は増やしていく予定です。

## モジュール一覧

| モジュール名 | パラメータ                    | 動作                                                                 |
| ------------ | ----------------------------- | -------------------------------------------------------------------- |
| getApi       | uid(string)                   | MiHoMo API を実行します。                                            |
| getData      | data(json), character(Number) | API のデータとキャラクターから、生成に必要な元データを生成します。   |
| getScore     | data(json)                    | 生成した元データを使用し、スコア計算をし、新たなデータを生成します。 |
| createImg    | data(json)                    | 生成したデータから画像を生成します。                                 |

本プログラムでは、node-canvas によって画像を作成しています。
<br />createImg では、最終的に canvas を返す形になっています。

## 実行

各モジュールを順番に実行します。
<br />[作成例](../index.js)のように関数を作っても構いません。
<br />また、then を使用しても大丈夫です。以下は例として、index.js を書き換えたものです。

```js
const fs = require("fs");
const MiHoMo = require("./MiHoMo");

const uid = "830647229";

MiHoMo.getApi(uid)
  .then((data) => MiHoMo.getData(data, 0))
  .then((get) => MiHoMo.getScore(get))
  .then((json) => MiHoMo.createImg(json))
  .then((canvas) => {
    fs.writeFileSync("output.png", canvas.toBuffer());
    console.log("Image created successfully!");
  })
  .catch((err) => {
    console.error("Error occurred:", err);
  });
```
