import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link href={`/posts/${post.id}`} key={post.id} className="group">
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-lg">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
                <time className="text-sm text-white/80">{post.date}</time>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
