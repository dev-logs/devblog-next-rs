import React, { useState, FormEvent, useRef, useEffect } from 'react'
import gsap from 'gsap'

interface PopupProps {
  onClose: () => void
  onResult: (result: { email: string, password: string, displayName?: string }) => void
}

const AuthenticationPopup: React.FC<PopupProps> = ({ onClose, onResult }) => {
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const elementRef = useRef<any>(null)

  const handleSwitchMode = () => {
    setIsSignup(!isSignup)
  }

  useEffect(() => {
    const element = elementRef.current
    if (element) {
      gsap.fromTo(element, {y: window.innerHeight}, {y: 0, duration: 1, ease: 'back.inOut'})
    }
  }, [elementRef.current])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const result = { email, password, displayName: isSignup ? displayName : undefined }
    onResult(result)
    onClose()
  }

  return (
    <div className="font-roboto fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg z-10 flex justify-center items-center">
      <div ref={elementRef} className="flex flex-col bg-gray-900 border border-gray-800 bg-opacity-95 rounded-xl py-5 pb-8">
        <header className="relative">
          <button onClick={onClose} className="absolute right-0 pt-1 pr-5">
            <span className='text-gray-400 text-xl'>&#x2716;</span>
          </button>
          <img className="w-10 mx-auto mb-5" src="/images/devlogs-ic.png" alt="Logo" />
        </header>
        <form onSubmit={handleSubmit} className="pt-5 px-10">
          {isSignup && (
            <div>
              <label className="block mb-2 text-white text-sm" htmlFor="displayname">
                Display name
              </label>
              <input
                className="w-full rounded-sm overflow-clip p-2 mb-4 text-indigo-700 focus:border-b-2 focus:border-indigo-500 outline-none focus:bg-gray-300"
                type="text"
                placeholder='required'
                name="displayname"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label className="block mb-2 text-white text-sm" htmlFor="email">
              Email
            </label>
            <input
              className="w-full p-2 mb-4 text-indigo-700 rounded-sm focus:border-b-2 focus:border-indigo-500 outline-none focus:bg-gray-300"
              type="email"
              placeholder='required'
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-white text-sm" htmlFor="password">
              Password
            </label>
            <input
              className="w-full p-2 mb-4 text-indigo-700 rounded-sm focus:border-b-2 focus:border-indigo-500 focus:bg-gray-300"
              type="password"
              placeholder='required'
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button className="w-full bg-white text-black hover:bg-indigo-500 mt-5 text-md font-bold py-2 px-4 rounded" type="submit">
              {isSignup ? 'Signup' : 'Signin'}
            </button>
          </div>
        </form>
        <p className="text-white font-thin text-center mt-7 cursor-pointer font-roboto" onClick={handleSwitchMode}>
          {isSignup ? 'Already have an account? Signin' : 'Don’t have an account? Signup'}
        </p>
      </div>
    </div>
  )
}

export default AuthenticationPopup
