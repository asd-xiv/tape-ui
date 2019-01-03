// @flow

const debug = require("debug")("TapeUI:UIDebug")

import * as React from "react"
import { map, pipe, join } from "@asd14/m"

import { baseStyle } from "./debug.style"

type PropsType = {|
  label: string,
  value?: Object,
  top?: number | string,
  left?: number | string,
  width?: number | string,
  height?: number | string,
|}

class UIDebug extends React.PureComponent<PropsType> {
  static defaultProps = {
    value: {},
    top: "center",
    left: "center",
    width: "50%",
    height: "50%",
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
    const { label, value, top, left, width, height } = this.props

    return (
      <box
        class={[baseStyle]}
        label={`[ ${label} ]`}
        top={top}
        left={left}
        width={width}
        height={height}
        content={pipe(
          Object.entries,
          map(
            ([entryKey, entryValue]): string =>
              `${entryKey}: ${JSON.stringify(entryValue)}`
          ),
          join("\n")
        )(value)}
      />
    )
  }
}

export { UIDebug }
