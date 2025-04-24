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
A clean vector-style collage on white background.
Center a circular layout containing five evenly spaced icons:
• a friendly blue-green snake coiled into a “P” shape (Python),
• a bright yellow hexagon with subtle “JS” letters (JavaScript),
• a steaming red coffee cup silhouette (Java),
• a silver pair of angle brackets with two plus signs (C++),
• a shiny crimson gemstone with a light sparkle (Ruby).
Flat colors, soft shadows, minimalistic, high resolution, 4K.

Negative prompt:
realistic photo, text blocks, watermark, blur, noise.

  `

    // オプション設定
    const options = {
        model: 'gpt-image-1',
        size: '1024x1024',
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
