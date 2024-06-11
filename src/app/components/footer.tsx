import {InstagramIcon} from '../icons/instagram'

export const FooterHtml = (props: any) => {
    return <>
        <div className={`flex flex-col h-full w-screen items-center pt-14`}>
            <span
                className='font-head md:scale-y-[2] scale-y-[3.55] align-bottom md:py-14 py-8 text-[24vw] text-white uppercase'>DEVLOGS STUDIO</span>
            <div className='flex md:flex-row flex-col md:gap-5 w-full justify-between items-center md:px-16'>
                <div className='flex flex-row items-center md:gap-5 gap-1 md:text-xl justify-between'>
                    <a href="devlogstudio@gmail.com"
                       className='font-roboto md:text-xl text-gray-100 text-sm underline'>devlogstudio@gmail.com</a>
                    <a href={"https://www.instagram.com/dev_logs/?hl=en"}
                       className='font-roboto text-gray-100 flex flex-row gap-1 justify-between items-center'>
                        <InstagramIcon width={20} fill="white"/>
                        Instagram
                    </a>
                </div>
                <span
                    className='font-roboto text-gray-100 md:text-xl'>Devlog Studio - All rights reserved - ©2024</span>
            </div>
        </div>
    </>
}
