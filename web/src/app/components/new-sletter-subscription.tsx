import { useService } from "../hooks/service"

export const NewSletterSubscription = (props: any) => {
    const signupByEmail = useService().auth().signupByEmail()

    return <>
        <div
            className="flex flex-col w-full md:gap-6 gap-2 rounded-xl justify-center items-center md:py-10 md:px-8 py-1 px-2">
            <div className="flex flex-col md:gap-4 gap-2 w-full justify-center items-center">
                <div className="relative w-full md:h-14 h-[20px] my-2">
                    <span
                        className="absolute w-full text-center top-0 left-0 xl:text-6xl sm:text-4xl text-3xl font-head text-pink-500">Subscribe to our newsletter</span>
                    <span
                        className="absolute top-0 w-full text-center left-0 skew-y-1 scale-[0.98] font-head xl:text-6xl sm:text-4xl text-3xl text-white">Subscribe to our new sletter</span>
                </div>
                <span className="md:text-2xl text-lg mb-2 tracking-wider text-gray-50 font-head w-full text-center">We invite you to join our great adventure</span>
            </div>
            <div className="relative flex md:flex-row flex-col w-full gap-4 h-16 justify-center items-center">
                <div className="flex flex-col w-full">
                <input
                  onChange={(e) => signupByEmail.setEmail(e.target.value)}
                  className="w-full max-w-96 font-head text-2xl md:p-5 p-1 h-full bg-white tracking-wider text-black rounded-xl"/>
                  {<span className="text-pink-400 p-2 font-bold text-sm absolute -bottom-10">{signupByEmail.error}</span>}
                </div>
                <button
                    onClick={signupByEmail.trigger}
                    className="md:px-4 md:py-4 font-graduate md:uppercase rounded-xl md:text-lg text-sm px-2 py-2 bg-black h-full">Subscribe
                </button>
            </div >
        </div>
    </>
}
