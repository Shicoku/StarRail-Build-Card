# コンフィグ設定

コンフィグを変更することによって、ユーザー独自の設定を行うことができます。

コンフィグを変更する際、先にコンフィグ用のモジュールを呼び出す必要があります。

```js
const { config } = require("./MiHoMo");
```

<br />[StarRailScore](https://github.com/Mar-7th/StarRailScore)でクローンした`score.json`のファイルパスを変更する場合は以下のように書きます。

```js
config.scorePath = "./assets/score/";
```

### コンフィグ一覧

| コンフィグ名 | 値           | 内容                            |
| ------------ | ------------ | ------------------------------- |
| scorePath    | Path(Storing) | `score.json`のフォルダパスの指定 |
| StarRailPath | Path(Storing) | `StarRailRes`フォルダパスの指定 |

フォルダパスを指定する際は、必ず末尾に`/`を入力してください。

※今後、コンフィグ内容は増やしていく予定です。