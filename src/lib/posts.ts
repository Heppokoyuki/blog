import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { remarkImagePlugin } from './markdown';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export type Post = {
  id: string;
  title: string;
  date: string;
  thumbnail: string;
  content: string;
};

export async function getPostData(id: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  
  // ファイルの存在チェック
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${id}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  console.log('Original markdown:', fileContents);  // 元のMarkdownを確認

  // gray-matterでメタデータを解析
  const matterResult = matter(fileContents);
  console.log('Matter result:', matterResult);  // メタデータ解析結果を確認

  // remarkでMarkdownをHTMLに変換
  const processedContent = await remark()
    .use(remarkImagePlugin)
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
  console.log('Processed HTML:', contentHtml);  // 変換後のHTMLを確認

  return {
    id,
    content: contentHtml,
    ...(matterResult.data as { title: string; date: string; thumbnail: string }),
  };
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.md$/, ''),
        },
      };
    });
}

export async function getAllPosts(): Promise<Post[]> {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(async (fileName) => {
        const id = fileName.replace(/\.md$/, '');
        return getPostData(id);
      })
  );

  // 日付でソート
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
} 