import Media from "react-media"

export const Reponsive = (props: any) => {
    return <Media queries={{
        short: "(max-height: 680px)",
        small: "(max-width: 800px)",
        medium: "(min-width: 800px)"
    }}>
        {props.children}
    </Media>
}
