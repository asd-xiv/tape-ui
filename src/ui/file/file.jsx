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
  code?: number,
  signal?: string,
  isLoading?: boolean,
|}

class UIFile extends React.Component<PropsType, {}> {
  static defaultProps = {
    code: NaN,
    signal: "-",
    isLoading: false,
  }

  /**
   * Due to the fact that this is the only function that is guaranteed to be
   * called only once in each re-render cycle it is recommended to use this
   * function for any side-effect causing operations. Similarly to
   * componentWillUpdate and componentWillReceiveProps this function is called
   * with object-maps of previous props, state and context, even if no actual
   * change happened to those values.
   *
   * DO
   *  - cause side effects (AJAX calls etc.)
   *
   * DON'T
   *  - call this.setState as it will result in a re-render
   *
   * @param  {Object}   prevProps    Previous props
   * @param  {Object}   prevState    Previous state
   * @param  {Object}   prevContext  Previous context
   *
   * @return {undefined}
   */
  componentDidUpdate = (prevProps: PropsType) => {
    const { content } = this.props

    if (this.refBox && prevProps.content.length !== content.length) {
      this.refBox.setScrollPerc(100)
    }
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
    const { label, top, left, width, height, content } = this.props

    return (
      <box
        ref={this.linkRefBox}
        class={baseStyle}
        label={`[ ${isEmpty(label) ? "no file selected" : label} ]`}
        top={top}
        left={left}
        width={width}
        height={height}
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
