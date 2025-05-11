import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateOGPImage(text, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // ページのサイズを設定（OGPの推奨サイズ）
  await page.setViewport({
    width: 1200,
    height: 630,
  });

  // HTMLコンテンツを作成
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&display=swap');
          
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 1200px;
            height: 630px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          }
          .container {
            writing-mode: vertical-rl;
            text-orientation: upright;
            font-family: "Noto Serif JP", "Hiragino Mincho Pro", "Yu Mincho", serif;
            font-size: 48px;
            line-height: 1.8;
            color: #2c3e50;
            padding: 60px;
            text-align: center;
            background-color: rgba(255, 255, 255, 0.9);
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            max-width: 80%;
            max-height: 80%;
          }
          .title {
            font-weight: 700;
            margin-bottom: 20px;
            font-size: 56px;
          }
          .description {
            font-size: 36px;
            color: #34495e;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="title">へっぽこ山行記</div>
          <div class="description">${text}</div>
        </div>
      </body>
    </html>
  `;

  await page.setContent(html);

  // 画像を生成
  await page.screenshot({
    path: outputPath,
    type: 'png',
    fullPage: false,
  });

  await browser.close();
}

// 使用例
const text = '山のブログ';
const outputPath = path.join(__dirname, '../public/ogp.png');

generateOGPImage(text, outputPath)
  .then(() => console.log('OGP画像が生成されました:', outputPath))
  .catch((error) => console.error('エラーが発生しました:', error)); 