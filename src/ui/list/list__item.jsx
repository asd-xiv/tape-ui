// @flow

import * as React from "react"
import figures from "figures"

import { baseStyle, isSelectedStyle, statusIconStyle } from "./list__item.style"

type PropsType = {|
  id: string,
  label: string,
  code: number,
  top: number,
  isSelected?: boolean,
  isLoading?: boolean,
  onClick?: (id: string, event: Object) => void,
|}

export class UIListItem extends React.PureComponent<PropsType> {
  static defaultProps = {
    code: -1,
    isSelected: false,
    isLoading: false,
    onClick: undefined,
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
    if (this.labelRef) {
      this.labelRef.on("click", this.handleMouseClick)
    }
    if (this.statusRef) {
      this.statusRef.on("click", this.handleMouseClick)
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
    const { id, label, code, top, isSelected, isLoading } = this.props

    const color = isLoading
      ? "{blue-fg}"
      : code === 0
      ? "{green-fg}"
      : "{red-fg}"

    return [
      <box
        key={`item-status-${id}`}
        ref={this.handleStatusRef}
        class={statusIconStyle}
        top={top}
        content={`${color}${figures.squareSmallFilled}{/}`}
      />,
      <box
        key={`item-label-${id}`}
        ref={this.handleLabelRef}
        class={[baseStyle, isSelected && isSelectedStyle]}
        top={top}
        content={label}
      />,
    ]
  }

  /**
   * { function_description }
   *
   * @param  {Object}  ref  The reference object
   *
   * @return {undefined}
   */
  handleLabelRef = (ref: Object) => {
    this.labelRef = ref
  }

  handleStatusRef = (ref: Object) => {
    this.statusRef = ref
  }

  /**
   * { function_description }
   *
   * @param  {Object}  event  The event object
   *
   * @return {undefined}
   */
  handleMouseClick = (event: Object) => {
    const { id, onClick } = this.props

    onClick && onClick(id, event)
  }

  // reference to the blessed element
  labelRef = {}

  statusRef = {}
}
