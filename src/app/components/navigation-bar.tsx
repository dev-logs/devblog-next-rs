
const navigationItemClass = () => 'font-head md:text-xl tracking-widest text-white'

export const NavigationBar = (props: any) => {
  return <>
    <div className="fixed md:space-x-5 flex flex-row rounded-fullsmd:gap-16 gap-2 top-5 md:left-10 left-2 md:right-10 right-2 bg-gray-500 bg-opacity-5 backdrop-blur-lg items-center md:px-10 py-4 z-50">
        <LayeredTitleEffect/>
        <div className="w-1 h-full bg-white md:ml-2 md:mr-5"></div>
        <span className={navigationItemClass()}>WORKS</span>
        <span className={navigationItemClass()}>CONTACTS</span>
        <span className={navigationItemClass()}>BLOGS</span>
    </div>
  </>
}

const LayeredTitleEffect = (props: any) => {
  return <div className="md:text-3xl font-bold text-black flex flex-row h-full">
      <div className="w-20 overflow-visible flex flex-row">
        <span className="text-white font-head md:text-4xl text-xl tracking-widest">DEVLOGS</span>
        <div className="rotate-90 scale-75 -translate-x-3 -translate-y-1">
          <span className="text-white font-head text-sm tracking-widest rounded-full px-2 py-1">studio</span>
        </div>
      </div>
      {/* <span className="font-head absolute top-[0px] left-[0px] text-black" style={{transform: "skewY(-3deg) scale(0.95);"}}>DEVLOGS</span> */}
      {/* <img className="absolute right-[2px] bottom-[5px] w-5 h-auto aspect-square" src="/images/devlogs-ic.png"/> */}
  </div>
}
