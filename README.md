# OpenAI 画像生成ツール

OpenAI の Image API を使って、テキストプロンプトから画像を生成するシンプルなツールです。

## セットアップ方法

1. 必要なパッケージをインストールします：

```bash
npm install openai dotenv
```

2. `.env`ファイルを作成し、OpenAI の API キーを設定します：

```
OPENAI_API_KEY=あなたのAPIキーをここに入力
```

API キーは[OpenAI のダッシュボード](https://platform.openai.com/api-keys)から取得できます。

## 使い方

```bash
node generate-image.js
```

デフォルトでは、赤ちゃんカワウソと獣医さんの画像が生成されます。

## カスタマイズ

`generate-image.js`ファイルを編集して、以下の項目をカスタマイズできます：

-   `prompt`: 生成したい画像の説明
-   `options`:
    -   `model`: 使用するモデル（"gpt-image-1", "dall-e-3"など）
    -   `size`: 画像サイズ（"1024x1024", "1024x1536"など）
    -   `quality`: 画質（"low", "medium", "high"）
    -   `filename`: 保存するファイル名

## 制限事項

-   API キーには課金が必要です
-   複雑なプロンプトの処理には最大 2 分かかることがあります
-   生成される画像は OpenAI のコンテンツポリシーに従ってフィルタリングされます
