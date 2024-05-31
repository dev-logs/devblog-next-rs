import { DeployFlutterWebBlogItem } from "./deploy-flutter-web/item"

export const BlogList = (props: any) => {
  return <>
    <div className="flex flex-col h-full w-full">
      <div className="mt-20 mx-20 bg-zinc-900 gap-5 p-10 grid grid-cols-3 rounded-2xl h-full">
        <ClassicBlogItemContainer>
          <DeployFlutterWebBlogItem/>
        </ClassicBlogItemContainer>
        <ClassicBlogItemContainer>
          <DeployFlutterWebBlogItem/>
        </ClassicBlogItemContainer>
      </div>
    </div>
  </>
}

export const ClassicBlogItemContainer = (props: any) => {
  return <>
    <div className="col-span-1 overflow-hidden">
      {props.children}
    </div>
  </>
}
