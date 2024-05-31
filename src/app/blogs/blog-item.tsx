interface BlogItemProps {
  title: string
  description: string
  minToRead: number
  imageUrl: string
  children?: any
}

export const ClassicBlogItemContainer = (props: BlogItemProps) => {
  return <div className="col-span-1 overflow-hidden">
    <div className="flex flex-col space-y-3 bg-black rounded-xl justify-between pb-5 min-h-[500px]">
      <div className="flex flex-col">
        <img className="aspect-auto w-full h-auto rounded-t-xl" src={props.imageUrl}/>
        <div className="flex flex-col mt-5 mx-5">
          <span className="font-graduate uppercase text-white text-2xl">{props.title}</span>
          <span className="font-graduate text-white text-lg font-thin">{props.description}</span>
        </div>
      </div>
      <div className="flex flex-row justify-between mb-5 mx-5 mt-10 items-center">
        <button className="font-roboto border-green-400 text-sm rounded-full border py-2 px-4">{"Read more ->"}</button>
        <span className="font-roboto text-pink-400 text-sm">{`${props.minToRead} minutes`}</span>
      </div>
    </div>
  </div>
}
