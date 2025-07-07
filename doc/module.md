# モジュール一覧

## MiHoMoクラス
API取得から画像取得までを行うクラスです。
<br />このクラスを使用する際には、以下のようにモジュールの読み込み、またインスタンスの作成を行います。
```js
const { MiHoMo } = require("./MiHoMo");
const mihomo = new MiHoMo();
```

### モジュール一覧
MiHoMoクラス内のモジュールを示します。

#### `getAPI(uid)`
MiHoMo APIを実行し、JSONデータとして返します。
<br />なお、APIの取得に失敗した場合はステータスコードを返します。

| 引数 | 型     | 説明             |
| ---- | ------ | ---------------- |
| uid  | string | uidを渡します。 |

※uidの型は`string(文字列)`であることに注意してください

```js
mihomo.getApi("830647229");
```

#### `getDataBase(data, character)`

取得したAPIデータとキャラクターの情報を参照し、jsonデータを作成します。
<br />なお、遺物スコアは計算されません。

| 引数      | 型          | 説明                                     |
| --------- | ----------- | ---------------------------------------- |
| data      | json        | APIによって取得した元データを渡します。 |
| character | Number(int) | キャラクターの番号(0～7)を渡します。   |

```js
mihomo.getDataBase(data, 0);
```

#### `getDataScore`

取得したAPIデータとキャラクターの情報を参照し、sonデータを作成します。
<br />なお、遺物スコアも計算されます。

| 引数      | 型          | 説明                                     |
| --------- | ----------- | ---------------------------------------- |
| data      | json        | APIによって取得した元データを渡します。 |
| character | Number(int) | キャラクターの番号(0～7)を渡します。   |

```js
mihomo.getDataScore(data, 0);
```

#### createImg(data)

生成したjsonデータから画像を生成します。
<br />なお、`getDataScore`で生成したデータのみ対応です。

画像生成には`node canvas`を使用しています。
<br />最終的には`canvas`を返しますので、必要に応じて`png`などの形式に変換する必要があります。
| 引数 | 型 | 説明 |
| - | - | - |
| data | json | `getDataScore`によって生成されたデータを渡します。 |

```js
mihomo.createImg(data).then((canvas) => {
  fs.writeFileSync("output.png", canvas.toBuffer());
});
```

## ApiErrorクラス
API取得時のエラー判断に関するクラスです。
<br />APIを実行する際に発生するエラーについて、判断しステータスコードとエラーメッセージを返します。

使用する場合は、以下の用にモジュールを読み込んでください。
```js
const { ApiError } = require("./MiHoMo");
```

このクラスでは、戻り値としてステータスコードとエラーメッセージを返します。
<br  />以下は実装例です。
```js
try {
  const ApiData = await mihomo.getApi(uid);

  //そのあとの処理
} catch (err) {
  if(err instanceof ApiError) {
    console.error(`${err.status} : ${err.message}`);
  } else {
    console.error(err);
  }
}
```

## その他モジュール
クラス化されていないモジュールについてです。

各モジュールを使用する場合は、モジュール事に呼び出しが必要になります。
<br />以下は`getCharData`モジュールを使用する場合の例を示します。
```js
const { getCharData } = require("./MiHoMo");
```
### モジュール一覧
#### `getCharData(name)`
キャラクター名から、キャラクターのデータを検索できます。
<br />検索は部分一致になっています。

| 引数 | 型     | 説明             |
| ---- | ------ | ---------------- |
| name  | string | キャラクターの名前を渡します。 |

```js
getCharData('三月なのか');
```