export const NewSletterSubscription = (props: any) => {
  return <>
    <div className="flex flex-col w-full gap-6 rounded-xl justify-center items-center py-10 px-8 border-8 border-pink-500">
      <div className="flex flex-col gap-4 w-full justify-center items-center">
        <div className="relative w-full h-14">
          <span className="absolute w-full text-center top-0 left-0 text-6xl font-head text-pink-500">Subscribe to our new sletter</span>
          <span className="absolute top-0 w-full text-center left-0 skew-y-1 scale-[0.98] font-head text-6xl text-white">Subscribe to our new sletter</span>
        </div>
        <span className="text-2xl tracking-wider text-gray-50 font-head w-full text-center">No ads, No leak, just annouce about our new blogs</span>
      </div>
      <div className="flex flex-row w-full gap-4 h-20 justify-center items-center">
        <input className="w-full font-head text-2xl p-5 h-full bg-white tracking-wider text-black rounded-xl"/>
        <button className="px-8 py-4 font-graduate uppercase rounded-xl text-xl tracking-wider bg-black h-full text-only-stroke">Subscribe</button>
      </div>
    </div>
  </>
}
