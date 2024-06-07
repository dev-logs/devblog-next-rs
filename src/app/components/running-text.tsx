
const BlueDot = (props: any) => {
  return <div className="rounded-full w-4 h-4 bg-blue-400 mx-4"></div>
}

const GreenDot = (props: any) => {
  return <div className="rounded-full w-4 h-4 bg-green-400 mx-4"></div>
}

const RedDot = (props: any) => {
  return <div className="rounded-full w-4 h-4 bg-pink-600 mx-4"></div>
}

const DevlogStudio = (props: any) => {
  return <div className={`-mr-4 bg-opacity-0 flex flex-row items-center text-white font-roboto text-4xl font-extrabold uppercase whitespace-nowrap ${props.className}`}>
    <RedDot/> DevLogs Studio <BlueDot/> <span className="text-only-stroke">DevLogs Studio</span> <RedDot/> DevLogs Studio <GreenDot/> <span className="text-only-stroke">DevLogs Studio</span>
  </div>
}

export const RunningText = (props: any) => {
  return <div className="text-white w-full overflow-hidden z-40">
    <div className="flex w-screen infinite-scroll-text gap-4">
      <DevlogStudio className="animate-scroll1"/>
      <DevlogStudio className="animate-scroll2"/>
    </div>
  </div>
}
