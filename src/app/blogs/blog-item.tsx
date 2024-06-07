interface BlogItemProps {
  title: string
  description: string
  minToRead: number
  imageUrl: string
  children?: any
}

export const ClassicBlogItemContainer = (props: BlogItemProps) => {
  return <div className="col-span-1 overflow-hidden">
    <div className="flex flex-col md:space-y-3 bg-black rounded-xl md:justify-between pb-5 md:min-h-[500px]">
      <div className="flex flex-col">
        <img className="aspect-auto w-full h-auto rounded-t-xl" src={props.imageUrl}/>
        <div className="flex flex-col mt-2 md:mt-5 ga-2 md:gap-5 mx-2 md:mx-5">
          <span className="font-roboto md:font-bold uppercase text-white text-xl md:text-2xl">{props.title}</span>
          <span className="font-roboto md:font-semibold text-white text-sm md:text-lg">{props.description}</span>
        </div>
      </div>
      <div className="flex flex-row justify-between md:mb-5 mx-5 pt-10 md:pt-20 items-center">
        <button className="font-roboto border-green-400 text-sm rounded-full border py-2 px-4">{"Read more ->"}</button>
        <span className="font-roboto text-pink-400 text-sm">{`${props.minToRead} minutes`}</span>
      </div>
    </div>
  </div>
}
