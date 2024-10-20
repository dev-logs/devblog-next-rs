'use client'
import { useCallback, useEffect, useMemo } from "react"
import { useService } from "../hooks/service"

export const NewSletterSubscription = (props: any) => {
    const signupByEmail = useService().auth().signupByEmail()
    const signout = useService().auth().signout()
    const getCurrentUser = useService().auth().getCurrentUser()

    useEffect(() => {
      getCurrentUser.trigger()
      signout.data = false
    }, [signout.data])

    const appriciateMessage = useMemo(() => {
      if (getCurrentUser.data) {
        return `Subscribed as ${getCurrentUser.data.email}`
      }
    }, [getCurrentUser.data])

    const onSubscribedClicked = useCallback(() => {
      signupByEmail.trigger()
    }, [signupByEmail.trigger])

    useEffect(() => {
      if (signupByEmail.data) {
        getCurrentUser.trigger()
      }
    }, [signupByEmail.data, getCurrentUser.trigger])

    console.log(getCurrentUser.data)
    return <>
        <div
            className="flex flex-col w-full md:gap-6 gap-2 rounded-xl justify-center items-center sm:py-2 md:py-10 md:px-8 py-1 px-2">
            <div className="flex flex-col md:gap-4 gap-2 w-full justify-center items-center">
                <div className="relative w-full md:h-14 h-[20px] my-2">
                    <span
                        className="absolute w-full text-center top-0 left-0 xl:text-6xl sm:text-4xl text-3xl font-head text-pink-500">Subscribe to our newsletter</span>
                    <span
                        className="absolute top-0 w-full text-center left-0 skew-y-1 scale-[0.98] font-head xl:text-6xl sm:text-4xl text-3xl text-white">Subscribe to our new sletter</span>
                </div>
                {
                  !getCurrentUser.data &&
                    <span className="md:text-2xl text-lg mb-2 tracking-wider text-gray-50 font-head w-full text-center">We invite you to join our great adventure</span>
                }
            </div>
            {getCurrentUser.data && <span className='font-graduate md:text-md text-xs text-gray-300 text-center'>We really appriciate your subscription, you will receive new updates from us.</span> }
            <div className="relative flex md:flex-row flex-col w-full gap-4 h-16 justify-center items-center">
                <div className="flex flex-row w-full">
                {!getCurrentUser.data ? <input
                    disabled={!!getCurrentUser.data}
                    onChange={(e) => signupByEmail.setEmail(e.target.value)}
                    className="w-full disabled:bg-gray-900 disabled:bg-opacity-20 disabled:border-none disabled:text-gray-300 font-head text-2xl md:py-3 text-center h-full bg-white tracking-wider text-black rounded-xl">
                  </input> : <span className="w-full text-md font-roboto text-center bg-gray-100 bg-opacity-20 text-gray-200 container rounded-sm">{getCurrentUser.data.name || getCurrentUser.data.email}</span>
                }
                </div>
                {!getCurrentUser.data && <button
                    onClick={onSubscribedClicked}
                    className="md:px-4 md:py-4 font-graduate md:uppercase rounded-xl md:text-lg text-sm px-2 py-2 bg-black h-full text-white">Subscribe
                </button>}
            </div>
        </div>
    </>
}
