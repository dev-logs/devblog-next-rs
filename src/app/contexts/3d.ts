import MousePosition from '../models/MousePosition'

export class ThreeD {
  mousePosition: MousePosition

  constructor(props: {mousePosition?: MousePosition}) {
    this.mousePosition = props.mousePosition ?? new MousePosition(0, 0)
  }
}

export const ThreeDContext: ThreeD = new ThreeD({})
