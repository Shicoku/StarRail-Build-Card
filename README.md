# StarRail-Build-Card

本プロジェクトは、[崩壊スターレイル](https://hsr.hoyoverse.com/ja-jp/home)のビルドカードを作るためのプログラムです。

![build-card](./public/build-card.png "生成サンプル")

# 環境

- Node.js v22.14.0

# 準備
[Releases](https://github.com/Shicoku/StarRail-Build-Card/releases)より、最新バージョンをダウンロード、展開してください。
<br />なお、このプロジェクトをクローンしても構いません。


以下のリポジトリをクローンしてください。

1. [StarRailScore](https://github.com/Mar-7th/StarRailScore) にて、`score.json`
2. [StarRailRes](https://github.com/Mar-7th/StarRailRes)にて、`iconフォルダ`・ `imageフォルダ`

続いて以下のコマンド実行し、必要なパッケージをインストールします。

```
$ npm install
```

# 使い方(簡易版)

`index.js`にて、`main`関数内に各自の`uid`を入力し、実行してください。
<br />詳しい使い方については[使い方](./doc/use.md)を参照してください

# ご使用にあたって

このプロジェクトは、[MITライセンス](https://ja.wikipedia.org/wiki/MIT%E3%83%A9%E3%82%A4%E3%82%BB%E3%83%B3%E3%82%B9)に準じています。
<br />改造・組み込み等、ご自由に行って構いません。
<br />また、[崩壊スターレイル](https://hsr.hoyoverse.com/ja-jp/home)の規約に準じてください。
<br />崩壊スターレイルの規約に違反するものは、原則、本プロジェクトでも違反とします。

# クレジット

## 素敵なゲーム様

[崩壊スターレイル](https://hsr.hoyoverse.com/ja-jp/home)

## モジュール

- fs
- [node canvas](https://github.com/Automattic/node-canvas)

## リポジトリ

- [StarRailScore](https://github.com/Mar-7th/StarRailScore)
- [StarRailRes](https://github.com/Mar-7th/StarRailRes)

# ライセンス

[MIT License](LICENSE)

Copyright (c) 2025 Shicoku / Syu

# お問い合わせ

ご質問等ございましたら、気軽にお声がけください。
<br />[XのDM](https://x.com/H2DH8K)、またはメールアドレス shicoku07@gmail.com 等でお願いします。
<br />また、本プロジェクトに関する内容でしたら、Issueを建ててもらっても構いません。
<br />ぜひご活用ください。

# 更新

[Change Log](./doc/changelog.md)