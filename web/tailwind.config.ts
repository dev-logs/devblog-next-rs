import type {Config} from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./content/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            scrollbar: ['rounded'],
            colors: {
                'scrollbar-bg': '#000000',
                'scrollbar-thumb': '#2d3748',
                'scrollbar-thumb-hover': '#4a5568',
                'beigie': '#A0937D',
                'foreground': '#A0937D',
                'background':'#0C0C0C',
                'highlight': '#E55604'
            },
            fontFamily: {
                chakra: 'Chakra Petch',
                roboto: ['Roboto', 'sans-serif'],
                graduate: ['Graduate', 'Calistoga', 'Roboto', 'sans-serif'],
                Alfa: ['Alfa Slab One', 'sans-serif'],
                head: ['"Damn"', 'sans-serif'],
            },
            fontWeight: {
                thin: '100',
                light: '300',
                normal: '400',
                medium: '500',
                bold: '700',
                black: '900',
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            transform: {
                'skew1': 'skewY(-2deg) scale(0.98)',
            },
        },
        variants: {
            scrollbar: ['dark'],
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('tailwind-scrollbar')
    ],
};
export default config;
