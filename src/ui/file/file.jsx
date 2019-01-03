// @flow

const debug = require("debug")("TapeUI:UIFile")

import * as React from "react"
import unicode from "figures"
import chalk from "chalk"
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
|}

type StateType = {|
  isDetailsVisible: boolean,
|}

class UIFile extends React.Component<PropsType, StateType> {
  static defaultProps = {
    code: NaN,
    signal: "-",
  }

  state = {
    isDetailsVisible: false,
  }

  /**
   * This function will be called only once in the whole life-cycle of a given
   * component and it being called signalizes that the component and all its
   * sub-components rendered properly.
   *
   * DO
   *  - cause side effects (AJAX calls etc.)
   *
   * DON'T
   *  - call this.setState as it will result in a re-render
   */
  componentDidMount = () => {
    if (this.refBox) {
      // this.refBox
    }
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
    const { label, path, top, left, width, height, content, code } = this.props
    const { isDetailsVisible } = this.state

    const color = isEmpty(code)
      ? chalk.blue
      : code === 0
      ? chalk.green
      : chalk.red

    return [
      <text
        key="file-content"
        ref={this.linkRefBox}
        class={baseStyle}
        label={
          isEmpty(label)
            ? ` | no file selected |`
            : ` | ${color(unicode.square)} ${label} | `
        }
        top={top}
        left={left}
        width={width}
        height={height}
        content={content.join("\n")}
      />,
      isDetailsVisible ? <text key="file-info">path: {path}</text> : null,
    ]
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
