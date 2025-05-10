'use client';

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type ScrollableContentProps = {
  content: string;
};

const ScrollableContent: React.FC<ScrollableContentProps> = ({ content }) => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageMarkersRef = useRef<{ src: string; alt: string; element: HTMLElement; originalPosition: number }[]>([]);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastImageRef = useRef<string | null>(null);
  const isScrollingRef = useRef(false);
  const lastVisibleMarkerRef = useRef<string | null>(null);

  // 画像マーカーを検出する関数
  const detectImageMarkers = () => {
    console.log('Detecting image markers...');  // デバッグ用
    console.log('Content:', content);  // デバッグ用

    const markers: { src: string; alt: string; element: HTMLElement; originalPosition: number }[] = [];
    const contentElement = contentRef.current;
    if (!contentElement) return;

    // 既存のマーカーを削除
    const existingMarkers = contentElement.querySelectorAll('[data-image-marker]');
    existingMarkers.forEach(marker => marker.remove());

    // コンテンツ内の画像要素を検索
    const imageElements = contentElement.querySelectorAll('img');
    imageElements.forEach((imgElement) => {
      const src = imgElement.getAttribute('src') || '';
      const alt = imgElement.getAttribute('alt') || '';
      
      // 画像要素の位置を取得
      const parentElement = imgElement.parentElement;
      if (!parentElement) return;

      // 親要素の位置を基準に計算
      const parentRect = parentElement.getBoundingClientRect();
      const containerRect = contentElement.getBoundingClientRect();
      const relativeLeft = parentRect.left - containerRect.left + contentElement.scrollLeft;

      // マーカー要素を作成
      const markerElement = document.createElement('div');
      markerElement.setAttribute('data-image-marker', '');
      markerElement.setAttribute('data-image-src', src);
      markerElement.setAttribute('data-image-alt', alt);
      markerElement.style.position = 'absolute';
      markerElement.style.left = `${relativeLeft}px`;
      markerElement.style.width = '1px';
      markerElement.style.height = '100%';
      markerElement.style.pointerEvents = 'none';
      
      // マーカーを追加
      contentElement.appendChild(markerElement);
      
      markers.push({
        src,
        alt,
        element: markerElement,
        originalPosition: relativeLeft
      });

      console.log('Created marker:', {
        src,
        alt,
        position: relativeLeft,
        parentRect,
        containerRect,
        scrollLeft: contentElement.scrollLeft
      });
    });

    console.log('Found markers in content:', markers);  // デバッグ用

    // 画像マーカーを設定
    imageMarkersRef.current = markers;
    console.log('Processed image markers:', imageMarkersRef.current);  // デバッグ用

    // 初期表示時に最初の画像を表示
    if (markers.length > 0) {
      setCurrentImage(markers[0].src);
    }
  };

  // 画像切り替えの処理を修正
  const changeImage = (newImage: string) => {
    if (newImage === currentImage) return;
    
    lastImageRef.current = currentImage;
    setIsAnimating(true);
    setCurrentImage(newImage);
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  // スクロールハンドラーを修正
  const handleScroll = () => {
    if (!contentRef.current) return;

    isScrollingRef.current = true;

    // 既存のタイマーをクリア
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }

    // 新しいタイマーを設定
    scrollTimerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      const container = contentRef.current;
      if (!container) return;

      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const scrollPosition = scrollLeft + containerWidth / 2;

      let visibleMarker = null;
      let minDistance = Infinity;
      
      for (const marker of imageMarkersRef.current) {
        const markerPosition = marker.originalPosition - scrollLeft;
        const distance = Math.abs(scrollPosition - markerPosition);

        if (distance < minDistance) {
          minDistance = distance;
          visibleMarker = marker;
        }
      }

      // 現在のマーカーが前回と異なる場合のみ画像を切り替え
      if (visibleMarker && visibleMarker.src !== lastVisibleMarkerRef.current) {
        changeImage(visibleMarker.src);
        setImageError(false);
        lastVisibleMarkerRef.current = visibleMarker.src;
      }
    }, 150);
  };

  useEffect(() => {
    // コンテンツがレンダリングされた後に画像マーカーを検出
    const timer = setTimeout(() => {
      detectImageMarkers();
      // 初期表示時に最初の画像を設定
      if (imageMarkersRef.current.length > 0) {
        lastVisibleMarkerRef.current = imageMarkersRef.current[0].src;
      }
    }, 500);

    // スクロールイベントの監視を開始
    const container = contentRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // 初期表示時にも実行
      handleScroll();
    }

    return () => {
      clearTimeout(timer);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [content]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isFullscreen]);

  return (
    <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-8">
      <div className="tategaki-container overflow-x-auto h-[50vh] lg:h-[80vh] w-full lg:w-1/2">
        <div className="tategaki bg-white p-2 lg:p-8 rounded-lg shadow-lg w-full h-full">
          <div 
            ref={contentRef}
            className="prose prose-lg h-full overflow-y-auto w-full max-w-none px-1 lg:px-4"
            dangerouslySetInnerHTML={{ __html: content }}
            style={{ position: 'relative' }}
          />
          <style jsx global>{`
            .tategaki img {
              display: none;
            }
            [data-image-marker] {
              position: absolute;
              width: 1px;
              height: 100%;
              pointer-events: none;
            }
          `}</style>
        </div>
      </div>
      <div className="h-[50vh] lg:h-[80vh] w-full lg:w-1/2 flex-shrink-0">
        <div className="bg-white h-full w-full rounded-lg shadow-lg p-4">
          <div className="relative w-full h-full">
            {currentImage && !imageError && (
              <div className={`relative w-full h-full ${isAnimating ? 'animate-fade' : ''}`}>
                <Image
                  src={currentImage}
                  alt="Current section image"
                  fill
                  className={`object-contain ${isAnimating ? 'animate-fade' : ''}`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  style={{ cursor: 'pointer' }}
                  onError={() => {
                    console.error('Image load error:', currentImage);
                    setImageError(true);
                  }}
                />
              </div>
            )}
            {!currentImage && (
              <div className="flex items-center justify-center h-full text-gray-400">
                画像はありません
              </div>
            )}
          </div>
        </div>
      </div>
      {isFullscreen && currentImage && !imageError && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fade"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative w-full h-full">
            <Image
              src={currentImage}
              alt="Fullscreen image"
              fill
              className="object-contain animate-fade"
              sizes="100vw"
              priority
              unoptimized
            />
            <div className="absolute top-4 right-4 text-white text-sm">
              ESCキーまたはクリックで戻る
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrollableContent; 