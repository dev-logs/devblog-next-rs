import { Post } from "contentlayer/generated"

export default function PostTitle(props: any) {
  const { post }: { post: Post } = props || {};
  return (
    <div className="container w-screen h-[50vh] flex justify-center items-center gap-2 overflow-hidden">
          <div className="flex flex-col lg:gap-4 gap-2">
            <span className="xl:text-6xl md:text-5xl text-xl text-center font-chakra text-foreground">
              {post.title}
            </span>
            <span className="text-sm lg:text-xl font-chakra text-highlight capitalize underline underline-offset-1 font-bold text-center mx-4 sm:mx-2">
              #{post.keywords}
            </span>
      </div>
    </div>
  );
}

