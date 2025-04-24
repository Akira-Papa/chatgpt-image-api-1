#!/usr/bin/env node

import OpenAI from 'openai'
import fs from 'fs'
import dotenv from 'dotenv'

// 環境変数を読み込み
dotenv.config()

// APIキーが設定されているか確認
if (!process.env.OPENAI_API_KEY) {
    console.error('エラー: OPENAI_API_KEYが設定されていません。')
    console.error(
        '.envファイルを作成し、OPENAI_API_KEY=your-api-keyを設定してください。'
    )
    process.exit(1)
}

// OpenAIクライアントの初期化
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

// 画像を生成する関数
async function generateImage(prompt, options = {}) {
    try {
        // デフォルト設定
        const defaultOptions = {
            model: 'gpt-image-1',
            size: '1024x1024',
            quality: 'medium',
        }

        // filenameを取り出して、APIに送信しないようにする
        const { filename, ...apiOptions } = options

        // 設定をマージ（filenameを除く）
        const settings = { ...defaultOptions, ...apiOptions, prompt }

        console.log('画像生成中...')
        const result = await openai.images.generate(settings)

        // 画像データを取得
        const image_base64 = result.data[0].b64_json
        const image_bytes = Buffer.from(image_base64, 'base64')

        // ファイル名を設定
        const outputFilename = filename || 'generated-image.png'

        // ファイルに保存
        fs.writeFileSync(outputFilename, image_bytes)
        console.log(`画像が正常に生成され、${outputFilename}に保存されました。`)

        return { success: true, filename: outputFilename }
    } catch (error) {
        console.error('画像生成中にエラーが発生しました:', error.message)
        return { success: false, error: error.message }
    }
}

// メイン実行関数
async function main() {
    // プロンプトを設定（日本語でも英語でもOK）
    const prompt = `Prompt:
【図解】要件定義からリリースまでのソフトウェア開発フロー  
白背景に、横長タイムライン形式のインフォグラフィックを作成してください。  
左から右へ順に 5 つの大きなステップを配置し、各ステップに日本語タイトルと簡潔な説明文 (15 文字以内) を添える。  
ステップは以下の通り：

1️⃣ 要件定義 – 利用者ニーズを整理  
2️⃣ 設計 – システム構造を設計  
3️⃣ 実装 – コードを開発  
4️⃣ テスト – 品質を検証  
5️⃣ リリース – 本番環境へ公開  

◾️デザイン要件  
– フラットベクターアイコンを各ステップ上に置く（例：書類、設計図、PC、虫眼鏡、ロケット）  
– 吹き出しや矢印で流れを強調  
– 見出しフォントは太ゴシック、本文は細ゴシック  
– カラーパレット：#1D4ED8, #22C55E, #FACC15, #F97316, #EF4444（左→右の順で適用）  
– 余白を広く取り、情報を詰め込みすぎない  
– 解像度 4K、アスペクト比 16:9  

Negative prompt: 写実的写真, 透かし, ノイズ, 低解像度, 過度な装飾
  `

    // オプション設定
    const options = {
        model: 'gpt-image-1',
        // size: '1024x1024', // 正方形
        size: '1536x1024', // 横長
        // size: '1024x1536', // 縦長
        quality: 'medium',
        filename: 'generated-image.png',
    }

    // 画像生成実行
    await generateImage(prompt, options)
}

// プログラム実行
main().catch((error) => {
    console.error('プログラム実行中にエラーが発生しました:', error)
})
