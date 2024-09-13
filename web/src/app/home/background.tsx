'use client'
import { useEffect, useState } from "react";

export const HomeBackground = (_: any) => {
  const [bgColor, setBgColor] = useState('#F6F5F2');

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    const scrollProgress = Math.min(scrollY / windowHeight, 1); // Cap it at 1
    
    const newBgColor = interpolateColor('#F6F5F2', '#000000', scrollProgress);
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

  return (
    <div
      {...props}
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: bgColor,
        transition: 'background-color 0.2s ease',
      }}
    ></div>
  );
};
