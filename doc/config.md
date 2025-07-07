# コンフィグ設定

コンフィグを変更することによって、ユーザー独自の設定を行うことができます。

コンフィグを変更する際、先にコンフィグ用のモジュールを呼び出す必要があります。

```js
const { config } = require("./MiHoMo");
```

<br />[StarRailScore](https://github.com/Mar-7th/StarRailScore)でクローンした`score.json`のファイルパスを変更する場合は以下のように書きます。

```js
config.scorePath = "./score/score.json";
```

### コンフィグ一覧

| コンフィグ名 | 値           | 内容                            |
| ------------ | ------------ | ------------------------------- |
| scorePath    | Path(string) | `score.json`のファイルパスの指定 |
| StarRailPath | Path(string) | `StarRailRes`フォルダパスの指定 |

※今後、コンフィグ内容は増やしていく予定です。