// @flow

import * as React from "react"
import { isEmpty } from "@asd14/m"

import * as style from "./file.style"

type Props = {|
  label: string,
  path: string,
  top: number | string,
  left: number | string,
  width: number | string,
  height: number | string,
  content: string,
  code: number,
  isLoading: boolean,
|}

class UIFile extends React.PureComponent<Props> {
  static defaultProps = {
    content: "",
    code: NaN,
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
        key="file-log"
        ref={this.linkRefBox}
        label={`${isEmpty(label) ? "no file selected" : label}`}
        class={style.file}
        top={top}
        left={left}
        width={width}
        height={height}
        scrollOnInput={true}
        content={content}
      />
    )
  }

  /**
   * Link to blessed Log object
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
