// @flow

import * as React from "react"
import figures from "figures"

import * as style from "./list__item.style"

type ListItem = {|
  id: string,
  label: string,
  code?: number,
  isLoading: boolean,
|}

type Props = {|
  ...ListItem,
  top: number | string,
  isSelected?: boolean,
|}

class UIListItem extends React.PureComponent<Props> {
  static defaultProps = {
    code: -1,
    isSelected: false,
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
    const { label, code, top, isSelected, isLoading } = this.props

    const color = isLoading
      ? "{blue-fg}"
      : code === 0
      ? "{green-fg}"
      : "{red-fg}"
    const underline = isSelected ? "{underline}" : ""

    return (
      <box
        class={[style.item, isSelected && style.selected]}
        top={top}
        keyable={false}
        content={`${color}${
          figures.squareSmallFilled
        }{/} ${underline}${label}{/}`}
      />
    )
  }
}

export type { ListItem }
export { UIListItem }
