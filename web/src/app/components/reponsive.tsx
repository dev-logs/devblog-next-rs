import Media from "react-media"

export enum HeightReponsive {
  SHORT
}

export enum WidthReponsive {
  SMALL,
  MEDIUM,
  LARGE,
  VERY_LARGE
}

export function largerThan(target: WidthReponsive, compareTo: WidthReponsive) {
  return target > compareTo;
}

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
    width: WidthReponsive.SMALL,
    height: HeightReponsive.SHORT,
    from: ((compare: WidthReponsive) => result.width >= compare),
    is: (compare: WidthReponsive | HeightReponsive) => (typeof compare === typeof result.width && compare === result.width),
  }

  if (matches.veryLarge) {
    result.width = WidthReponsive.VERY_LARGE
  }
  else if (matches.large) {
    result.width = WidthReponsive.LARGE
  }
  else if (matches.medium) {
    result.width = WidthReponsive.MEDIUM
  }
  else if (matches.small) {
    result.width = WidthReponsive.SMALL
  }

  if (matches.short) {
    result.height = HeightReponsive.SHORT
  }

  return result
}
