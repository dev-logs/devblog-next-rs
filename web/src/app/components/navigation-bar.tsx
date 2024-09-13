'use client'
import {useEffect, useState} from "react";

const navigationItemClass = () =>
    'relative cursor-pointer font-head md:text-xl tracking-widest group';

export const NavigationBar = (props: any) => {
    const {dynamicColor = false} = props || {}

    const [bgColor, setBgColor] = useState(dynamicColor ? '#000000' : '#FFFFFF');

    const handleScroll = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        const scrollProgress = Math.min(scrollY / windowHeight, 1); // Cap it at 1

        const newBgColor = interpolateColor('#000000', '#F6F5F2', scrollProgress);
        setBgColor(newBgColor);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const interpolateColor = (color1: any, color2: any, factor: any) => {
        const c1 = hexToRgb(color1)!;
        const c2 = hexToRgb(color2)!;

        const result = {
            r: Math.round(c1.r + factor * (c2.r - c1.r)),
            g: Math.round(c1.g + factor * (c2.g - c1.g)),
            b: Math.round(c1.b + factor * (c2.b - c1.b)),
        };

        return `rgb(${result.r}, ${result.g}, ${result.b})`;
    };

    const hexToRgb = (hex: any) => {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m: number, r: number, g: number, b: number) {
            return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            }
            : null;
    };

    return <div className="w-full container fixed top-5 z-50 left-1/2 -translate-x-1/2" style={{color: dynamicColor ? bgColor : '#FFF'}}>
        <div
            className={"container bg-gray-800 items-center bg-opacity-5 py-4 backdrop-blur-lg flex flex-row w-full md:space-x-5 rounded-xl md:gap-16 gap-2 shadow-sm"}>
            <LayeredTitleEffect/>
            <div className="w-1 h-full bg-white md:ml-2 md:mr-5"></div>
            <a href={'#contacts'} className={navigationItemClass()}>
                CONTACTS
                <span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </a>
            <a href={'/#blogs'} className={navigationItemClass()}>
                BLOGS
                <span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </a>
        </div>
    </div>
}

const LayeredTitleEffect = (props: any) => {
    return (
        <div className="md:text-3xl cursor-pointer font-bold flex flex-row h-full">
            <a href={'/'}>
                <div className="w-20 overflow-visible flex flex-row">
                <span className="font-head md:text-4xl text-xl tracking-widest">
                    DEVLOGS
                </span>
                    <div className="rotate-90 scale-75 -translate-x-3 -translate-y-1">
                    <span className="font-head text-sm tracking-widest rounded-xl px-2 py-1">
                        studio
                    </span>
                    </div>
                </div>
            </a>
        </div>
    );
};
