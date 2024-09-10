'use client'
 
import React from 'react'

export default function AppStyled({
  children,
}: {
  children: React.ReactNode
}) {

  return <style jsx>
    {children}
  </style>
}
