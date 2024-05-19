import Image from 'next/image'
import { BlogList } from './blog-list'

export default function Home() {
  return (
    <main className="flex h-full w-full flex-col items-center justify-between p-24">
      <BlogList/>
    </main>
  )
}
