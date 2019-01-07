// @flow

import * as React from "react"
import { pipe, reduce } from "@asd14/m"

import { baseStyle } from "./menu.style"

type PropsType = {|
  name: string,
  version: string,
  isDebugVisible?: boolean,
|}

type StateType = {
  memory: number,
}

class UIMenu extends React.PureComponent<PropsType, StateType> {
  static defaultProps = {
    isDebugVisible: false,
  }

  state = {
    memory: process.memoryUsage().rss,
  }

  /**
   * Use this function to "clean up" after the component if it takes advantage
   * of timers (setTimeout, setInterval), opens sockets or performs any
   * operations we need to close/remove when no longer needed.
   *
   * DO
   *  - remove any timers or listeners created in lifespan of the component
   *
   * DON'T
   *  - call this.setState, start new listeners or timers
   *
   * @return {undefined}
   */
  componentWillUnmount = () => {
    clearInterval(this.memoryTimer)
  }

  /**
   * Examine this.props and this.state and return a single React element. This
   * element can be either a representation of a native DOM component, such as
   * <div />, or another composite component that you've defined yourself.
   *
   * @return {React.Node}
   */
  render = (): React.Node => {
    const { name, version, isDebugVisible } = this.props
    const { memory } = this.state

    const actions = pipe(
      Object.entries,
      reduce(
        (acc = "", [key, value]): string =>
          `${acc}{white-bg}{black-fg}${key}{/} ${value} `
      )
    )({
      i: isDebugVisible ? "Hide details" : "Show details",
      "Space|Enter": "Run",
      "C-c": "Exit",
    })

    return [
      <box
        key="shortcuts"
        class={[baseStyle]}
        top="100%-1"
        left="0"
        width="50%"
        content={actions}
      />,
      <box
        key="title"
        class={[baseStyle]}
        top="100%-1"
        right="0"
        width="50%"
        content={`{right}${name} v${version} | ${`${Math.round(
          memory / 1048576
        )}MB`}{/right}`}
      />,
    ]
  }

  memoryTimer = setInterval(() => {
    this.setState({
      memory: process.memoryUsage().rss,
    })
  }, 1000)
}

export { UIMenu }
