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
        className={`app-footer z-20 flex flex-col h-full w-screen items-center pt-14 overflow-hidden`}
      >
        <span className="font-head md:scale-y-[2] scale-y-[3.55] align-bottom md:pt-14 pt-8 text-[24vw] h-fit text-white uppercase">
          DEVLOG STUDIO
        </span>
        <div className="flex lg:flex-row flex-col lg:gap-5 w-full lg:justify-between justify-center items-center h-fit mt-[8vh] lg:px-16 bg-white z-20 py-5 gap-2">
          <div className="flex flex-row items-center md:gap-5 gap-1 md:text-xl justify-between h-5">
            <a
              href="devlogstudio@gmail.com"
              className="font-mono md:text-xl text-gray-900 text-sm">
              devlogstudio@gmail.com
            </a>
            <span className="text-gray-900 font-roboto flex-1">or</span>
            <a
              href={"https://www.instagram.com/dev_logs/?hl=en"}
              className="font-mono flex md:text-xl text-sm text-gray-900 flex-row gap-1 justify-between items-center">
              <InstagramIcon width={18} fill="gray-900"/>
              Instagram
            </a>
          </div>
          <span className="font-mono text-gray-900 md:text-lg text-sm">
            Devlog Studio - All rights reserved - ©2024
          </span>
        </div>
      </div>
    </>
  );
};
