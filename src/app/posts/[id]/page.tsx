import Image from "next/image";
import { getPostData, getAllPostIds } from "@/lib/posts";
import ScrollableContent from "./ScrollableContent";

export async function generateStaticParams() {
  return getAllPostIds();
}

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = await getPostData(resolvedParams.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <article className="w-full">
        {post.thumbnail && (
          <figure className="mb-8 relative">
            <div className="w-full aspect-[2/1] mb-2 flex items-center justify-center">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                priority
                className="object-contain rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl lg:text-4xl font-bold text-white drop-shadow-lg bg-black/50 px-4 py-2 lg:px-6 lg:py-3 rounded-lg whitespace-nowrap">
              {post.title}
            </h1>
          </figure>
        )}
        <ScrollableContent content={post.content} />
      </article>
    </div>
  );
} 