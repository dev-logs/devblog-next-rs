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
    <div className={`flex flex-col h-screen w-screen items-center pt-36`}>
      <span className='font-head scale-y-[2.5] text-[24vw] text-white uppercase'>DEVLOGS STUDIO</span>
      <div className='flex flex-row justify-between gap-5 w-full items-center px-10 md:px-16'>
        <div className='flex flex-row items-center gap-5'>
          <a href="devlogstudio@gmail.com" className='font-roboto font-bold underline'>devlogstudio@gmail.com</a>
          <a href={"https://www.instagram.com/dev_logs/?hl=en"} className='font-roboto flex flex-row gap-1 justify-center items-center'>
            <InstagramIcon width={20} fill="white"/>
            Instagram
          </a>
        </div>
        <span className='font-roboto'>Devlog Studio - All rights reserved - ©2024</span>
      </div>
    </div>
  </>
}
