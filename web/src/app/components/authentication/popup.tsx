import React, { useState, FormEvent, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import {useService} from '@/app/hooks/service'
import {toast, Toaster} from 'react-hot-toast'
import {User} from '@devlog/schema-ts'

interface PopupProps {
  onClose: () => void
  onResult: (result: User) => void
}

const AuthenticationPopup: React.FC<PopupProps> = ({ onClose, onResult }) => {
  const [isSignup, setIsSignup] = useState(false)
  const elementRef = useRef<any>(null)
  const signinByEmail = useService().auth().signinByEmail()
  const fullSignup = useService().auth().fullySignup()

  const main = isSignup ? fullSignup : signinByEmail

  useEffect(() => {
    if (main.error) {
      toast(main.error.toString())
      main.updateError(null)
    }
  }, [main, main.error])

  const handleSwitchMode = () => {
    setIsSignup(!isSignup)
  }

  useEffect(() => {
    const element = elementRef.current
    if (element) {
      gsap.fromTo(element, {y: window.innerHeight}, {y: 0, duration: 1, ease: 'back.inOut'})
    }
  }, [elementRef.current])

  useEffect(() => {
    if (main.data && onClose) {
      onResult(main.data!)
      onClose()
    }
  }, [main.data, onClose])

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault()
    main.trigger()
  }, [main])

  const onEmailChange = useCallback((e: any) => {
    main.setEmailState(e.target.value.trim())
  }, [main, main.setEmailState])

  const onDisplayNameChange = useCallback((e: any) => {
    main.setDisplayNameState(e.target.value.trim())
  }, [main, main.setDisplayNameState])

  const onPasswordChage = useCallback((e: any) => {
    main.setPasswordState(e.target.value.trim())
  }, [main, main.setPasswordState])

  return (
    <div className="font-mono font-thin text-sm fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-lg z-10 flex justify-center items-center">
      <Toaster position='bottom-right'/>
      <div ref={elementRef} className="flex flex-col bg-gray-900 border border-gray-800 bg-opacity-95 rounded-xl py-5 pb-8">
        <header className="relative">
          <button onClick={onClose} className="absolute right-0 pt-1 pr-5">
            <span className='text-gray-400 text-xl'>&#x2716;</span>
          </button>
          <img className="w-10 mx-auto mb-5" src={`${process.env.NEXT_PUBLIC_PATH_PREFIX}images/devlogs-ic.png`} alt="Logo" crossOrigin='anonymous'/>
        </header>
        <form autoComplete='off' onSubmit={handleSubmit} className="pt-5 px-10">
          {isSignup && (
            <div>
              <label className="block mb-2 text-white text-sm" htmlFor="displayname">
                Display name
              </label>
              <input
                className="w-full rounded-sm overflow-clip p-2 mb-4 text-indigo-700 focus:border-b-2 focus:border-indigo-500 outline-none focus:bg-gray-300"
                type="text"
                autoComplete='off'
                placeholder='required'
                name="displayname"
                value={main.displayNameState || ''}
                onChange={onDisplayNameChange}
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
              autoComplete='off'
              placeholder='required'
              name="email"
              onLoad={onEmailChange}
              value={main.emailState}
              onChange={onEmailChange}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-white text-sm" htmlFor="password">
              Password
            </label>
            <input
              className="w-full p-2 mb-4 text-indigo-700 rounded-sm focus:border-b-2 focus:border-indigo-500 focus:bg-gray-300"
              autoComplete='off'
              type="password"
              placeholder='required'
              name="password"
              value={main.passwordState}
              onChange={onPasswordChage}
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
