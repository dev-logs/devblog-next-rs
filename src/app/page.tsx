import Image from 'next/image'
import { BlogList } from './blog-list'
import {Home as Homee} from './home'

export default function Home() {
  return (
    <main className="flex h-full w-full flex-col items-center justify-between">
      <Homee/>
    </main>
  )
}
