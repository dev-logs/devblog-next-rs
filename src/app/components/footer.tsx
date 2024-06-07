import { Center, Html, Text, useScroll } from '@react-three/drei'

export const Footer = (props: any) => {
  const {meshProps = {}, htmlProps = {}} = props || {}
  const scrollData = useScroll();

  return <>
    <Center disableY>
      <Text color="white" anchorX="center" font='/fonts/damn.ttf' anchorY="middle" {...meshProps} fontSize={3.5} rotation-x={Math.PI * -0.2}>
        {"  BE CREATIVE"}
      </Text>
      <Html
        portal={scrollData.fixed}
        transform
        {...htmlProps}>
        <div className={`flex flex-col h-screen w-screen ${htmlProps.className}`}>
        hello
        </div>
      </Html>
    </Center>
  </>
}
