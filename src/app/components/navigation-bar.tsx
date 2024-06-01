
const navigationItemClass = () => 'font-roboto text-white'

export const NavigationBar = (props: any) => {
  return <>
    <div className="grid fixed grid-cols-5 rounded-full gap-16 mx-20 top-5 left-20 right-20 bg-gray-50 bg-opacity-10 backdrop-blur-lg items-center justify-between px-4 py-4 z-50">
      <div className="flex flex-row space-x-10 col-span-2 justify-end">
        <span className={navigationItemClass()}>WORKS</span>
        <span className={navigationItemClass()}>CONTACTS</span>
      </div>
      <div className="col-span-1 justify-center items-center flex flex-row">
        <LayeredTitleEffect/>
      </div>
      <div className="col-span-2 flex flex-row justify-start">
        <span className={navigationItemClass()}>BLOGS</span>
      </div>
    </div>
  </>
}

const LayeredTitleEffect = (props: any) => {
  return <div className="relative text-5xl font-bold">
      <span className="text-pink-500 font-graduate">DEVLOGS</span>
      <span className="font-graduate absolute top-[0px] left-[0px] text-lime-400" style={{transform: "skewY(-3deg) scale(0.95);"}}>DEVLOGS</span>
      {/* <img className="absolute right-[2px] bottom-[5px] w-5 h-auto aspect-square" src="/images/devlogs-ic.png"/> */}
  </div>
}
