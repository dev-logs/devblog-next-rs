import Media from "react-media"

export const Reponsive = (props: any) => {
    return <Media queries={{
        short: "(max-height: 680px)",
        small: "(min-width: 0px)",
        medium: "(min-width: 800px)",
        large: "(min-width: 1200px)",
        veryLarge: "(min-width: 1500px)",
    }}>
        {props.children}
    </Media>
}

export const reponsiveMatch = (matches: any) => {
  let result = {
    small: false,
    medium: false,
    short: false,
    large: false,
    veryLarge: false,
  }

  if (matches.veryLarge) {
    result.veryLarge = true
  }
  else if (matches.large) {
    result.large = true
  }
  else if (matches.medium) {
    result.medium = true
  }
  else if (matches.small) {
    result.small = true
  }

  if (matches.short) {
    result.short = true
  }

  return result
}
