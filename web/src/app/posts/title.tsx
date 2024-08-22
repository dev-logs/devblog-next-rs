import { Post } from "contentlayer/generated"

export default function PostTitle(props: any) {
  const { post }: { post: Post } = props || {};
  return (
    <div className="relative w-screen lg:h-screen h-[50vh] overflow-hidden">
      <div className="absolute top-0 left-0 w-screen h-full z-40">
        <div className="absolute left-0 opacity-60 bottom-0 bg-gradient-to-t z-40 w-screen h-[60vh]" />
        <div className="absolute left-0 opacity-70 bg-gradient-to-r z-20 from-black h-full w-[60vw]" />
        <div className="absolute right-0 opacity-70 bg-gradient-to-l z-10 from-black h-full w-[60vw]" />
        <div className="absolute left-0 z-20 bg-gradient-to-b top-[30vh] opacity-60 w-screen h-[30vh]" />
        <div className="absolute left-0 top-0 sm:h-screen overflow-hidden h-[60vh] w-screen z-0 flex flex-col md:gap-5 gap-1 justify-between items-center">
          <img
            className="object-cover w-screen h-full opacity-30"
            src={post.publicImage}
          />
        </div>
        <div className="relative h-full overflow-hidden w-full flex flex-col items-center z-10 pt-20 xl:px-20 md:px-10 px-5 justify-end bg-black bg-opacity-10 backdrop-blur-sm">
          <div className="flex-1 lg:mb-20 mb-10 flex flex-col items-center w-full sm:gap-10 gap-2 justify-center absolute top-20 md:top-28">
            <span className="xl:text-6xl md:text-5xl text-xl xl:max-w-[40vw] max-w-[70vw] text-center font-Alfa">
              {post.title}
            </span>
            <span className="text-sm lg:text-xl font-mono capitalize text-pink-700 underline underline-offset-1 font-bold">
              #{post.keywords}
            </span>
            <img
              className="object-cover max-h-[50vh] h-auto w-[90vw]"
              src={post.publicImage}
           />
          </div>
        </div>
      </div>
    </div>
  );
}

