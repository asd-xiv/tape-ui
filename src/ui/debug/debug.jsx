// @flow

import * as React from "react"
import { deepEqual, map, pipe, join } from "@asd14/m"

import * as style from "./debug.style"

type Props = {|
  label: string,
  value: Object,
  top?: number | string,
  left?: number | string,
  width?: number | string,
  height?: number | string,
|}

class UIDebug extends React.Component<Props> {
  static defaultProps = {
    top: "center",
    left: "center",
    width: "50%",
    height: "50%",
  }

  shouldComponentUpdate = (nextProps: Props) =>
    !deepEqual(this.props)(nextProps)

  /**
   * Examine this.props and this.state and return a single React element. This
   * element can be either a representation of a native DOM component, such as
   * <div />, or another composite component that you've defined yourself.
   *
   * @return {React.Node}
   */
  render = () => {
    const { label, value, top, left, width, height } = this.props

    return (
      <box
        class={style.debug}
        label={label}
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
