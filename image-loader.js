export default function imageLoader({ src, width, quality }) {
  // 絶対URLの場合はそのまま返す
  if (src.startsWith('http')) {
    return src;
  }
  
  // Twitterカード用の画像サイズを最適化
  if (width >= 1200) {
    return `${src}?w=1200&h=630&fit=crop&q=${quality || 75}`;
  }
  
  // その他の画像サイズ
  return `${src}?w=${width}&q=${quality || 75}`;
} 