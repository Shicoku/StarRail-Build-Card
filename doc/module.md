# モジュール一覧

## `getAPI(uid)`

MiHoMo APIを実行します。

| 引数 | 型     | 説明             |
| ---- | ------ | ---------------- |
| uid  | string | uidを渡します。 |

※uidの型は`string(文字列)`であることに注意してください

```js
MiHoMo.getApi("830647229");
```

## `getCharData(name)`
キャラクター名から、キャラクターのデータを検索できます。
<br />検索は部分一致になっています。

| 引数 | 型     | 説明             |
| ---- | ------ | ---------------- |
| name  | string | キャラクターの名前を渡します。 |

```js
MiHoMo.getCharData('三月なのか');
```

## `getDataBase(data, character)`

取得したAPIデータとキャラクターの情報を参照し、jsonデータを作成します。
<br />なお、遺物スコアは計算されません。

| 引数      | 型          | 説明                                     |
| --------- | ----------- | ---------------------------------------- |
| data      | json        | APIによって取得した元データを渡します。 |
| character | Number(int) | キャラクターの番号(0～7)を渡します。   |

```js
MiHoMo.getDataBase(data, 0);
```

## `getDataScore`

取得したAPIデータとキャラクターの情報を参照し、sonデータを作成します。
<br />なお、遺物スコアも計算されます。

| 引数      | 型          | 説明                                     |
| --------- | ----------- | ---------------------------------------- |
| data      | json        | APIによって取得した元データを渡します。 |
| character | Number(int) | キャラクターの番号(0～7)を渡します。   |

```js
MiHoMo.getDataScore(data, 0);
```

## createImg(data)

生成したjsonデータから画像を生成します。
<br />なお、`getDataScore`で生成したデータのみ対応です。

画像生成には`node canvas`を使用しています。
<br />最終的には`canvas`を返しますので、必要に応じて`png`などの形式に変換する必要があります。
| 引数 | 型 | 説明 |
| - | - | - |
| data | json | `getDataScore`によって生成されたデータを渡します。 |

```js
MiHoMo.createImg(data).then((canvas) => {
  fs.writeFileSync("output.png", canvas.toBuffer());
});
```
