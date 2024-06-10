import { Post } from "contentlayer/generated"
import Image from "next/image"

export const PostTitle = (props: any) => {
  const {post}: {post: Post} = props || {}
  return <>
    <div className="relative w-full h-full">
      <div className="absolute inset-x-0 top-0 w-[100vw] xl:h-[80vh] max-h-[1100px] h-[50vh] bg-gradient-to-t from-black" />
      <Image
        src={post.image.filePath.replace("../public", "")}
        placeholder="blur"
        blurDataURL={post.image.blurhashDataUrl}
        alt={post.title}
        width={post.image.width}
        height={post.image.height}
        className="aspect-square xl:h-[80vh] h-[50vh] w-screen max-h-[1100px] object-cover object-center"
        priority
      />
      <div className="absolute top-0 left-0 flex flex-col w-full h-full justify-center items-center">
        <span className="lg:text-7xl md:text-4xl text-3xl text-center font-bold font-graduate text-gray-200">{post.title}</span>
      </div>
    </div>
  </>
}
