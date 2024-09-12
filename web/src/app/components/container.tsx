export function MainContainer(props: any) {
  return <div className={props.className}>
    {props.children}
  </div>
}

export function Container(props: any) {
  return <div className={"px-3 " + props.className}>
    {props.children}
  </div>
}
