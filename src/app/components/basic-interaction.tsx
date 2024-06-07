import { NewSletterSubscription } from "./new-sletter-subscription"

export const BasicInteraction = (props: any) => {
  return <>
    <div className="bg-indigo-900 rounded-2xl w-full py-14 px-10 flex flex-col h-full items-center">
      <div className="w-[70vw] min-w-[250px] max-w-[1000px]">
        <NewSletterSubscription/>
      </div>
    </div>
  </>
}
