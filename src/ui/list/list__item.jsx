// @flow

const debug = require("debug")("TapeUI:UIListItem")

import * as React from "react"

import { baseStyle, isSelectedStyle } from "./list__item.style"

type PropsType = {|
  id: string,
  label: string,
  top: number,
  isSelected?: boolean,
  onClick?: (id: string, event: Object) => void,
  onDblClick?: (id: string, event: Object) => void,
|}

export class UIListItem extends React.PureComponent<PropsType> {
  static defaultProps = {
    isSelected: false,
    onClick: undefined,
    onDblClick: undefined,
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
      this.refBox.on("click", this.handleMouseClick)
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
    const { label, top, isSelected } = this.props

    return (
      <box
        ref={this.handleRef}
        class={[baseStyle, isSelected && isSelectedStyle]}
        top={top}
        content={label}
      />
    )
  }

  /**
   * { function_description }
   *
   * @param  {Object}  ref  The reference object
   *
   * @return {undefined}
   */
  handleRef = (ref: Object) => {
    this.refBox = ref
  }

  /**
   * { function_description }
   *
   * @param  {Object}  event  The event object
   *
   * @return {undefined}
   */
  handleMouseClick = (event: Object) => {
    const { id, isSelected, onClick, onDblClick } = this.props

    onClick && onClick(id, event)
    onDblClick && isSelected && onDblClick(id, event)
  }

  // reference to the blessed element
  refBox = undefined
}
