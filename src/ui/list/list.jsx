// @flow

import * as React from "react"
import { map } from "@asd14/m"

import { UIListItem } from "./list__item"
import { baseStyle } from "./list.style"

type UIListItemType = {|
  id: string,
  label: string,
  code?: number,
  isLoading: boolean,
|}

type PropsType = {|
  selectedId?: string,
  top?: number | string,
  left?: number | string,
  width?: number | string,
  height?: number | string,
  items: UIListItemType[],
  onSelect?: Function,
|}

type StateType = {|
  itemSelectedId?: string,
|}

class UIList extends React.Component<PropsType, StateType> {
  static defaultProps = {
    selectedId: undefined,
    top: "center",
    left: "center",
    width: "50%",
    height: "50%",
    onSelect: undefined,
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
    // hook into children mouse wheel events
    this.refBox.on("element wheeldown", (/* el, mouse */) => {
      this.refBox.scroll(this.refBox.getScrollHeight() / 2)
    })

    this.refBox.on("element wheelup", (/* el, mouse */) => {
      this.refBox.scroll(-this.refBox.getScrollHeight() / 2)
    })
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
    const { selectedId, top, left, width, height, items } = this.props

    return (
      <box
        ref={this.linkRefBox}
        class={baseStyle}
        label={`[ ${items.length} files ]`}
        top={top}
        left={left}
        width={width}
        height={height}>
        {map(
          (item: UIListItemType, index: number): React.Node => (
            <UIListItem
              key={item.id}
              id={item.id}
              code={item.code}
              label={item.label}
              top={index}
              isSelected={selectedId === item.id}
              isLoading={item.isLoading}
              onClick={this.handleItemClick}
            />
          )
        )(items)}
      </box>
    )
  }

  /**
   * { function_description }
   *
   * @param  {string}  id     The identifier
   * @param  {Object}  event  The event
   *
   * @return {undefined}
   */
  handleItemClick = (id: string, event: Object) => {
    const { onSelect } = this.props

    onSelect && onSelect(id, event)
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

export type { UIListItemType }
export { UIList }
