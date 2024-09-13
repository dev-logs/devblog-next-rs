import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles/app.scss"
import { NavigationBar } from "./components/navigation-bar";
import AppStyled from "./components/styled";
import { siteMetadata } from "./utils/site-meta-data";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  ...siteMetadata,
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    template: `%s | ${siteMetadata.title}`,
    default: siteMetadata.title
  },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [siteMetadata.siteLogo],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    images: ['https://devlog.studio/images/favicon-32x32.png'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Calistoga&family=Graduate&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Arvo:ital,wght@0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap"
          rel="stylesheet"
        />
        <AppStyled> {`
          @font-face {
            font-family: 'Damn';
            src: url('${process.env.NEXT_PUBLIC_PATH_PREFIX}fonts/damn.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
       </AppStyled>
      </head>
      <body className={`${inter.className} h-screen w-screen dark overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
