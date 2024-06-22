import {Reponsive} from "@/app/components/reponsive";
import {Fragment} from "react";
import {ElectricalEffect} from "@/app/components/electrical-effect";

export default function BlogListBackground(props: any) {
    return <>
        {
            <Reponsive>
                {
                    (matches: any) => <Fragment>
                        {matches.small && <>
                            <pointLight position={[1, -5, 0]} args={['white', 50, 1]} intensity={8}/>
                            <ElectricalEffect position={[1, -5.9, 0]} scale={[0.2, 0.18, 0.2]}/>
                        </>}
                        {matches.medium && <>
                            <pointLight position={[2.2, -7, 2]} args={['white', 50, 1]} intensity={100}/>
                            <ElectricalEffect position={[2.5, -9.5, 0]} scale={0.7}/>
                        </>}
                    </Fragment>
                }
            </Reponsive>
        }
    </>
}
