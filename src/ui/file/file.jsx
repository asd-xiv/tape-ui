// @flow

import * as React from "react"

import * as style from "./file.style"

type Props = {|
  path: string,
  top: number | string,
  left: number,
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
    const { top, left, width, height, content } = this.props

    return (
      <log
        class={style.file}
        top={top}
        left={left + 1}
        width={width}
        height={height}
        scrollOnInput={true}
        content={content}
      />
    )
  }
}

export { UIFile }
