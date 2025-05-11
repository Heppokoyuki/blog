import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Node } from 'unist';
import type { Element } from 'hast';
import { logger } from './logger';

export const remarkImagePlugin: Plugin = () => {
  logger.log('remarkImagePlugin initialized');  // プラグインの初期化を確認
  return (tree: Node) => {
    logger.log('Processing tree:', tree);  // ツリーの構造を確認
    visit(tree, 'img', (node: Element) => {  // 'element' から 'img' に変更
      logger.log('Found img node:', node);  // imgノードを確認
      const props = node.properties || {};
      let src = props.src as string;
      const alt = props.alt as string;

      // 画像パスを修正
      if (src.startsWith('/public/')) {
        src = src.replace('/public', '');
      }

      // 画像を空のdivタグに変換し、データ属性として情報を保持
      node.tagName = 'div';
      node.properties = {
        'data-image-src': src,
        'data-image-alt': alt,
        'data-image-marker': 'true',
        'class': 'image-marker',
        'style': 'display: none;',
      };
      node.children = [
        {
          type: 'text',
          value: `[Image: ${alt}]`  // 画像の説明をテキストとして保持
        }
      ];

      logger.log('Transformed node:', node);  // 変換後のノードを確認
    });
  };
}; 