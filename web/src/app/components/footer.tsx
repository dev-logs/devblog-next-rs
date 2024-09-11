'use client'
import { useEffect, useRef } from "react";
import { InstagramIcon } from "../icons/instagram";

export const FooterHtml = (props: any) => {
  const ref = useRef<any>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.getBoundingClientRect();
    }
  }, [ref, ref.current]);

  return (
    <>
      <div
        ref={ref}
        className={`app-footer font-roboto z-20 flex flex-col  w-screen items-center justify-center md:pt-14 pt-2 overflow-hidden`}>
        <span className="font-head xl:scale-y-[1.8] xl:translate-y-16 translate-y-10 scale-y-[3.4] align-bottom md:pt-14 pt-1 text-[23vw] lg:leading-[1] leading-[2] h-fit text-white uppercase">
          DEVLOG STUDIO
        </span>
        <div className="flex lg:flex-row flex-col lg:gap-5 w-full lg:justify-between justify-center items-center h-fit mt-[8vh] lg:px-16 bg-white z-20 py-5 gap-2">
          <div className="flex flex-row items-center md:gap-5 gap-1 md:text-xl justify-between md:h-5 h-2">
            <a
              href="team@devlog.studio"
              className="font-roboto md:text-xl text-gray-900 text-sm">
              team@devlog.studio
            </a>
            <span className="text-gray-600 font-roboto flex-1">or</span>
            <a
              href={"https://www.instagram.com/dev_logs/?hl=en"}
              className="font-roboto flex md:text-xl text-sm text-gray-900 flex-row gap-1 justify-between items-center">
              <InstagramIcon width={18} fill="gray-900"/>
              Instagram
            </a>
          </div>
          <span className="font-roboto text-gray-900 md:text-lg text-sm text-center">
            Devlog Studio - All rights reserved - ©2024
          </span>
        </div>
      </div>
    </>
  );
};
