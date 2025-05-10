export default function imageLoader({ src, width, quality }) {
  // 絶対URLの場合はそのまま返す
  if (src.startsWith('http')) {
    return src;
  }
  
  // 相対パスの場合はそのまま返す
  return `${src}?w=${width}&q=${quality || 75}`;
} 