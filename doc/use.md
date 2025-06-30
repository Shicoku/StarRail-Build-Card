# 使い方

本プロジェクトのモジュールの使い方を説明します。

## モジュールの読み込み

本プログラムはモジュールによって動作させることが可能になっています。
<br />読み込みは以下のようにします。

```js
const MiHoMo = require("./MiHoMo");
```

また、画像ファイルとして出力したい場合、fsモジュールを使うことによって可能です。

```js
const fs = require("fs");
```

## コンフィグ設定

コンフィグを変更することによって、各ユーザーがある程度カスタマイズできるようにしています。
<br />以下については、[StarRailScore](https://github.com/Mar-7th/StarRailScore)でクローンした`score.json`のファイルパスを変更する例を示します。

```js
MiHoMo.config.scorePath = "./score/score.json";
```

### コンフィグ一覧

| コンフィグ名 | 値           | 内容                            |
| ------------ | ------------ | ------------------------------- |
| scorePath    | Path(string) | `score.json`のファイルパスの指定 |
| StarRailPath | Path(string) | `StarRailRes`フォルダパスの指定 |

※今後、コンフィグ内容は増やしていく予定です。

## 実行

各モジュールを順番に実行します。
<br />[作成例](../index.js)のように関数を作っても構いません。
<br />また、`then`を使用しても大丈夫です。以下は例として、`index.js`を書き換えたものです。

```js
const fs = require("fs");
const MiHoMo = require("./MiHoMo");

const uid = "830647229";

MiHoMo.getApi(uid)
  .then((data) => MiHoMo.getDataScore(data, 0))
  .then((json) => MiHoMo.createImg(json))
  .then((canvas) => {
    fs.writeFileSync("output.png", canvas.toBuffer());
    console.log("Image created successfully!");
  })
  .catch((err) => {
    console.error("Error occurred:", err);
  });
```

なお、各種モジュールの詳細については[モジュール一覧](./module.md)を参照してください。
