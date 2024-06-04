
const navigationItemClass = () => 'font-roboto text-white'

export const NavigationBar = (props: any) => {
  return <>
    <div className="fixed space-x-5 flex flex-row rounded-full gap-16 top-5 left-10 right-10 bg-white bg-opacity-0 backdrop-blur-lg items-center px-10 py-4 z-50">
        <LayeredTitleEffect/>
        <div className="w-1 h-full bg-white ml-2 mr-5"></div>
        <span className={navigationItemClass()}>WORKS</span>
        <span className={navigationItemClass()}>CONTACTS</span>
        <span className={navigationItemClass()}>BLOGS</span>
    </div>
  </>
}

const LayeredTitleEffect = (props: any) => {
  return <div className="text-3xl font-bold text-black flex flex-row h-full">
      <div className="w-20 overflow-visible flex flex-row">
        <span className="text-white font-graduate">DEVLOGS</span>
        <div className="rotate-90 scale-75 -translate-x-3">
          <span className="text-white font-graduate text-sm rounded-full px-2 py-1">studio</span>
        </div>
      </div>
      {/* <span className="font-graduate absolute top-[0px] left-[0px] text-black" style={{transform: "skewY(-3deg) scale(0.95);"}}>DEVLOGS</span> */}
      {/* <img className="absolute right-[2px] bottom-[5px] w-5 h-auto aspect-square" src="/images/devlogs-ic.png"/> */}
  </div>
}
