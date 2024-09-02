import { ElectricalEffect } from "@/app/components/electrical-effect";

export default function BlogListBackground(props: any) {
  return (
    <>
      {
          <ElectricalEffect
            position={[1, -5.9, 0]}
            scale={[0.2, 0.18, 0.2]}/>
      }
    </>
  );
}
