export const NewSletterSubscription = (props: any) => {
  return <>
    <div className="flex flex-col w-full gap-6 bg-white rounded-xl justify-center items-center py-10 px-8">
      <div className="flex flex-col gap-4 w-full justify-center items-center">
        <div className="relative w-full h-16">
          <span className="absolute w-full text-center top-0 left-0 text-8xl font-head text-pink-500">Subscribe to our new sletter</span>
          <span className="absolute top-0 w-full text-center left-0 skew-y-3 skew-x-2 scale-[0.98] font-head text-8xl text-blue-500">Subscribe to our new sletter</span>
        </div>
        <span className="text-black text-xl font-head w-full text-center">No ads, No leak, just annouce about our new blogs</span>
      </div>
      <div className="flex flex-row w-full gap-4 h-20 justify-center items-center">
        <input className="w-full font-head text-xl p-5 h-full bg-blue-400 text-white rounded-xl"/>
        <button className="px-5 py-4 font-head rounded-xl bg-black h-full">Subscribe</button>
      </div>
    </div>
  </>
}
