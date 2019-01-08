// @flow

import * as React from "react"
import { isEmpty } from "@asd14/m"

import { baseStyle } from "./file.style"

type PropsType = {|
  label: string,
  path: string,
  top: number | string,
  left: number | string,
  width: number | string,
  height: number | string,
  content: string[],
  code: number,
  signal: string,
  isLoading: boolean,
|}

class UIFile extends React.Component<PropsType> {
  static defaultProps = {
    content: [],
    code: NaN,
    signal: "-",
    isLoading: false,
  }

  /**
   * Examine this.props and this.state and return a single React element. This
   * element can be either a representation of a native DOM component, such as
   * <div />, or another composite component that you've defined yourself.
   *
   * @return {React.Node}
   */
  render = (): React.Node => {
    const { label, top, left, width, height, content } = this.props

    return (
      <log
        ref={this.linkRefBox}
        class={baseStyle}
        label={`[ ${isEmpty(label) ? "no file selected" : label} ]`}
        top={top}
        left={left}
        width={width}
        height={height}
        scrollOnInput={true}
        content={content.join("\n")}
      />
    )
  }

  /**
   * Links a reference box.
   *
   * @param  {Object}  ref  The reference object
   *
   * @return {undefined}
   */
  linkRefBox = (ref: Object) => {
    this.refBox = ref
  }

  refBox = {}
}

export { UIFile }
