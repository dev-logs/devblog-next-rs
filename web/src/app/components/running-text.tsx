const BlueDot = (props: any) => {
    return <div className="rounded-full md:w-4 md:h-4 w-2 h-2 bg-blue-400 mx-4"></div>
}

const GreenDot = (props: any) => {
    return <div className="rounded-full md:w-4 md:h-4 w-2 h-2 bg-green-400 mx-4"></div>
}

const RedDot = (props: any) => {
    return <div className="rounded-full md:w-4 md:h-4 w-2 h-2 bg-pink-600 mx-4"></div>
}

const DevlogStudio = (props: any) => {
    return <div
        className={`-mr-4 bg-opacity-0 flex flex-row items-center text-white font-roboto md:text-4xl text-xl font-extrabold uppercase whitespace-nowrap ${props.className}`}>
        <RedDot/> DevLogs Studio <BlueDot/> <span className="text-only-stroke">DevLogs Studio</span> <RedDot/> DevLogs
        Studio <GreenDot/> <span className="text-only-stroke">DevLogs Studio</span>
        <RedDot/> DevLogs Studio <BlueDot/> <span className="text-only-stroke">DevLogs Studio</span> <RedDot/> DevLogs
        Studio <GreenDot/> <span className="text-only-stroke">DevLogs Studio</span>
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
