import Media from "react-media"

export const Reponsive = (props: any) => {
  return <Media queries={{
    short: "(max-height: 680px)",
    small: "(max-width: 1024px)",
    medium: "(min-width: 1024px)"
  }}>
    {props.children}
  </Media>
}
