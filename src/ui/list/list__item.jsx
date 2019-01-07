// @flow

import * as React from "react"
import figures from "figures"

import { baseStyle, isSelectedStyle, isHoveredStyle } from "./list__item.style"

type PropsType = {|
  id: string,
  label: string,
  code: number,
  top: number,
  isSelected?: boolean,
  isHovered?: boolean,
  isLoading?: boolean,
  onClick: (id: string, event: Object) => void,
  onKeypress: (code: string, key: Object) => void,
|}

export class UIListItem extends React.PureComponent<PropsType> {
  static defaultProps = {
    code: -1,
    isSelected: false,
    isHovered: false,
    isLoading: false,
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
    const { onKeypress } = this.props

    this.labelRef.on("keypress", onKeypress)
    this.labelRef.on("click", this.handleClick)
  }

  /**
   * Examine this.props and this.state and return a single React element. This
   * element can be either a representation of a native DOM component, such as
   * <div />, or another composite component that you've defined yourself.
   *
   * @return {React.Node}
   */
  render = (): React.Node => {
    const { label, code, top, isSelected, isHovered, isLoading } = this.props

    const color = isLoading
      ? "{blue-fg}"
      : code === 0
      ? "{green-fg}"
      : "{red-fg}"

    return (
      <box
        ref={this.handleLabelRef}
        class={[
          baseStyle,
          isSelected && isSelectedStyle,
          isHovered && isHoveredStyle,
        ]}
        top={top}
        content={`${color}${figures.squareSmallFilled}{/} ${label}`}
      />
    )
  }

  handleClick = (event: Object) => {
    const { id, onClick } = this.props

    onClick(id, event)
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

  labelRef = {}
}
