import { Center, Text } from '@react-three/drei'
import { forwardRef } from 'react'
import { ThreeDCanvas } from './canvas'
import { InstagramIcon } from '../icons/instagram'

export const Footer3d = forwardRef((props: any, ref) => {
  return <>
    <Text ref={ref} color="#FFFFFF" anchorX="center" font='/fonts/damn.ttf' anchorY="middle" fontSize={7} rotation-x={Math.PI * -0.13} scale={[1, 1.4, 1]}>
      {"  BE CREATIVE"}
    </Text>
  </>
})

export const FooterHtml = (props: any) => {
  return <>
    <div className={`flex flex-col h-screen w-screen items-center xl:pt-56 md:scroll-pt-28 pt-14`}>
      <span className='font-head md:scale-y-[2] scale-y-[3.55] text-[24vw] text-white uppercase'>DEVLOGS STUDIO</span>
      <div className='flex md:flex-row flex-col md:gap-5 w-full justify-between items-center md:px-16'>
        <div className='flex flex-row items-center md:gap-5 gap-1 md:text-xl justify-between'>
          <a href="devlogstudio@gmail.com" className='font-roboto md:text-xl text-sm font-bold underline'>devlogstudio@gmail.com</a>
          <a href={"https://www.instagram.com/dev_logs/?hl=en"} className='font-roboto flex flex-row gap-1 justify-between items-center'>
            <InstagramIcon width={20} fill="white"/>
            Instagram
          </a>
        </div>
        <span className='font-roboto text-white md:text-xl'>Devlog Studio - All rights reserved - ©2024</span>
      </div>
    </div>
  </>
}
