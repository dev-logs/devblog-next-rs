import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import Stats from 'stats.js'
const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
  title: 'Devblog',
  description: 'Studio'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Calistoga&family=Graduate&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Arvo:ital,wght@0,700;1,400;1,700&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap" rel="stylesheet"/>
      </head>
      <body className={`${inter.className} h-screen w-screen`}>{children}</body>
    </html>
  )
}
