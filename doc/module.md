# モジュール一覧

各モジュールの仕様の前に、モジュールを呼び出す必要があります。
```js
const { MiHoMo, ApiError } = require("./MiHoMo");
```

または、一括で呼び出すことも可能です。
```js
const miho = require("./MiHoMo");
```

なお、このドキュメントでは後者の方法で記述します。

## MiHoMoクラス
API取得から画像取得までを行うクラスです。
<br />このクラスを使用する際には、以下のようにインスタンスの作成を行います。
```js
const mihomo = new miho.MiHoMo();
```

### モジュール一覧
MiHoMoクラス内のモジュールを示します。

#### `getAPI(uid)`
MiHoMo APIを実行し、JSONデータとして返します。
<br />なお、APIの取得に失敗した場合はステータスコードを返します。

| 引数 | 型     | 説明             |
| ---- | ------ | ---------------- |
| uid  | String | uidを渡します。 |

※uidの型は`String(文字列)`であることに注意してください

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

#### `getDataScore(data, character, weightData)`

取得したAPIデータとキャラクターの情報を参照し、sonデータを作成します。
<br />なお、遺物スコアも計算されます。

| 引数      | 型          | 説明                                     |
| --------- | ----------- | ---------------------------------------- |
| data      | json        | APIによって取得した元データを渡します。 |
| character | Number(int) | キャラクターの番号(0～7)を渡します。   |
| weightData | Number or String | 重要度の番号または名前を渡します。 |

```js
mihomo.getDataScore(data, 0);
```

`weightData`が空白、または`0`のときはデフォルトの重要度データを参照します。
<br />`weightData`が`1`以降であれば、そのデータを参照します
<br />`weightData`が文字列の場合、重要度データの名前から検索し参照します。
<br />なお、検索は完全一致です。

#### `createImg(data)`

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

このクラスでは、戻り値としてステータスコードとエラーメッセージを返します。
<br  />以下は実装例です。
```js
try {
  const ApiData = await mihomo.getApi(uid);

  //そのあとの処理
} catch (err) {
  if(err instanceof miho.ApiError) {
    console.error(err.status + " : " + err.message);
  } else {
    console.error(err);
  }
}
```

## その他モジュール
クラス化されていないモジュールについてです。

### モジュール一覧
#### `getCharData(name)`
キャラクター名から、キャラクターのデータを検索できます。
<br />検索は部分一致になっています。

| 引数 | 型     | 説明             |
| ---- | ------ | ---------------- |
| name  | String | キャラクターの名前を渡します。 |

```js
getCharData('三月なのか');
```

### `getCharWeight(name, num)`
キャラクターの名前から、重要度を検索できます。
<br />検索は部分一致になっています。

| 引数 | 型 | 説明 |
| - | - | - |
| name | String | キャラクターの名前を渡します。 |
| num | Number | 数値、または空白を渡します。 |

```js
miho.getCharWeight("なのか", 0);
```
`num`引数に空白を渡すと、キャラクターの重要度の数を返します。
<br />`num`引数に`0`を渡すと、デフォルトの重要度データを返します。
<br />`num`引数に`1`以降の数値を渡すと、ユーザーが作った重要度データを渡します。

### `setCharWeight(name, data)`
キャラクターの名前を指定し、重要度を作成します。
<br />名前の指定は部分一致になっています。

| 引数 | 型 | 説明 |
| - | - | - |
| name | String | キャラクターの名前を渡します。 |
| data | json | 重要度データを渡します。 |

```js
const data = {
  name: "なのかオリジナル1",
  main: {
    1: {
      HPDelta: 1,
    },
    2: {
      AttackDelta: 1,
    },
    3: {
      HPAddedRatio: 0.1,
      AttackAddedRatio: 0.1,
      DefenceAddedRatio: 1,
      CriticalChanceBase: 0.1,
      CriticalDamageBase: 0.1,
      HealRatioBase: 0,
      StatusProbabilityBase: 0.1,
    },
    4: {
      HPAddedRatio: 0.1,
      AttackAddedRatio: 0.1,
      DefenceAddedRatio: 1,
      SpeedDelta: 1,
    },
    5: {
      HPAddedRatio: 0.1,
      AttackAddedRatio: 0.1,
      DefenceAddedRatio: 1,
      PhysicalAddedRatio: 0,
      FireAddedRatio: 0,
      IceAddedRatio: 0.1,
      ThunderAddedRatio: 0,
      WindAddedRatio: 0,
      QuantumAddedRatio: 0,
      ImaginaryAddedRatio: 0,
    },
    6: {
      BreakDamageAddedRatioBase: 0.1,
      SPRatioBase: 0.8,
      HPAddedRatio: 0.1,
      AttackAddedRatio: 0.1,
      DefenceAddedRatio: 1,
    },
  },
  weight: {
    HPDelta: 0,
    AttackDelta: 0,
    DefenceDelta: 0.3,
    HPAddedRatio: 0.1,
    AttackAddedRatio: 0.1,
    DefenceAddedRatio: 1,
    SpeedDelta: 1,
    CriticalChanceBase: 0.1,
    CriticalDamageBase: 0.1,
    StatusProbabilityBase: 0.8,
    StatusResistanceBase: 0.8,
    BreakDamageAddedRatioBase: 0.1,
  },
};
console.log(miho.setCharWeight("なのか", data));
```

`name`を追加することで、重要度データに名前をつけることが可能です。
<br />スコアつきデータ取得時にこの名前で検索をすることが可能です。
<br />なお、重複した名前の場合、最初に登録したものが参照されます。

また、最終的にログメッセージを返すので、コンソールに出力できます。

重要度データの各内容の一覧は以下のとおりです。
<br />また、指定フォーマットについては、例を参照してください。

| 名前 | 説明 |
| - | - |
| HPDelta | HP(実数) |
| AttackDelta | 攻撃力(実数) |
| DefenceDelta | 防御力(実数) |
| HPAddedRatio | HP(%) |
| AttackAddedRatio | 攻撃力(%) |
| DefenceAddedRatio | 防御力(%) |
| SpeedDelta | 速度 |
| CriticalChanceBase | 会心率 |
| CriticalDamageBase | 会心ダメージ |
| StatusProbabilityBase | 効果命中 |
| StatusResistanceBase | 効果抵抗 |
| BreakDamageAddedRatioBase | 撃破特攻 |