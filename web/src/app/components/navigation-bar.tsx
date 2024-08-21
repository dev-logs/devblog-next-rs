const navigationItemClass = () =>
    'relative cursor-pointer font-head md:text-xl tracking-widest text-white group';

export const NavigationBar = (props: any) => {
    return (
        <>
            <div className="fixed md:space-x-5 flex flex-row px-2 md:rounded-full md:gap-16 gap-2 top-5 md:left-10 left-2 md:right-10 right-2 bg-gray-500 bg-opacity-5 backdrop-blur-lg items-center md:px-10 py-4 z-50">
                <LayeredTitleEffect />
                <div className="w-1 h-full bg-white md:ml-2 md:mr-5"></div>
                <a href={'#footer'} className={navigationItemClass()}>
                    CONTACTS
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </a>
                <a href={'/#blogs'} className={navigationItemClass()}>
                    BLOGS
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </a>
            </div>
        </>
    );
};

const LayeredTitleEffect = (props: any) => {
    return (
        <div className="md:text-3xl cursor-pointer font-bold text-black flex flex-row h-full">
            <a href={'/'}>
            <div className="w-20 overflow-visible flex flex-row">
                <span className="text-white font-head md:text-4xl text-xl tracking-widest">
                    DEVLOGS
                </span>
                <div className="rotate-90 scale-75 -translate-x-3 -translate-y-1">
                    <span className="text-white font-head text-sm tracking-widest md:rounded-full px-2 py-1">
                        studio
                    </span>
                </div>
            </div>
            </a>
        </div>
    );
};
