// @flow

import * as React from "react"
import { pipe, reduce } from "@asd14/m"

import { baseStyle } from "./menu.style"

type PropsType = {|
  name: string,
  version: string,
  isDebugVisible?: boolean,
|}

class UIMenu extends React.PureComponent<PropsType> {
  static defaultProps = {
    isDebugVisible: false,
  }

  /**
   * When called, it should examine this.props and this.state and return a
   * single React element. This element can be either a representation of a
   * native DOM component, such as <div />, or another composite component
   * that you've defined yourself.
   *
   * @return {Component}
   */
  render = (): React.Node => {
    const { name, version, isDebugVisible } = this.props

    const actions = pipe(
      Object.entries,
      reduce(
        (acc = "", [key, value]): string =>
          `${acc}{white-bg}{black-fg}${key}{/} ${value} `
      )
    )({
      i: isDebugVisible ? "Hide details" : "Show details",
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
        top="100%"
        right="0"
        width="50%"
        content={`{right}${name} v${version}{/right}`}
      />,
    ]
  }
}

export { UIMenu }
