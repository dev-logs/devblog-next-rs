import { largerThan, Reponsive, reponsiveMatch, WidthReponsive } from "@/app/components/reponsive";
import { Fragment } from "react";
import { ElectricalEffect } from "@/app/components/electrical-effect";

export default function BlogListBackground(props: any) {
  return (
    <>
      {
        <Reponsive>
          {(matches: any) => {
            const match = reponsiveMatch(matches)
            return (
              <Fragment>
                {match.is(WidthReponsive.SMALL) && (
                  <>
                    <ElectricalEffect
                      position={[1, -5.9, 0]}
                      scale={[0.2, 0.18, 0.2]}
                    />
                  </>
                )}
                {match.from(WidthReponsive.MEDIUM) && (
                  <>
                    <ElectricalEffect position={[3.8, -9.5, 0]} scale={0.6} />
                  </>
                )}
              </Fragment>
            );
          }}
        </Reponsive>
      }
    </>
  );
}
