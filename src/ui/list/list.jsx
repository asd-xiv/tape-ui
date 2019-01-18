// @flow

import * as React from "react"
import {
  max,
  min,
  map,
  findIndexBy,
  pipe,
  get,
  head,
  tail,
  isEmpty,
} from "@asd14/m"

import { UIListItem } from "./list__item"
import type { ListItem } from "./list__item"

import { UILabel } from "../label/label"

import * as style from "./list.style"

type Props = {|
  selectedId: string,
  label: string,
  items: ListItem[],
  top: number | string,
  left: number | string,
  width: number | string,
  height: number | string,
  isLoading: boolean,
  onChange: (path: string) => void,
  onSelect: (path: string) => void,
|}

type State = {
  position: number,
  hasFocus: boolean,
}

class UIList extends React.Component<Props, State> {
  static defaultProps = {
    selectedId: "",
    label: "",
    top: "center",
    left: "center",
    width: "50%",
    height: "50%",
    isLoading: false,
  }

  state = {
    position: 0,
    hasFocus: false,
  }

  static getDerivedStateFromProps = (props: Props) => {
    const { selectedId, items } = props
    const newPosition = findIndexBy({ id: selectedId })(items)

    return {
      position: newPosition === -1 ? 0 : newPosition,
    }
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
    this.refList.scrollTo(0)
    this.refList.focus()
    this.refList.on("keypress", this.handleMoveKeys)
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
  componentDidUpdate = (prevProps: Props) => {
    const { selectedId, items } = this.props
    const { position } = this.state

    if (
      selectedId !== prevProps.selectedId ||
      items.length !== prevProps.items.length
    ) {
      this.refList.scrollTo(position)
    }
  }

  /**
   * Examine this.props and this.state and return a single React element. This
   * element can be either a representation of a native DOM component, such as
   * <div />, or another composite component that you've defined yourself.
   *
   * @return {React.Node}
   */
  render = (): React.Node => {
    const {
      selectedId,
      label,
      top,
      left,
      width,
      height,
      items,
      isLoading,
    } = this.props
    const { hasFocus } = this.state

    return [
      <box
        key="files-list-items"
        ref={this.linkRefList}
        class={[style.list, hasFocus && style.listHasFocus]}
        top={top}
        left={left}
        width={width}
        height={height}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}>
        {isEmpty(items) ? (
          <box content="¯\_(ツ)_/¯" class={style.donnoLabel} />
        ) : null}
        {map(
          (item: ListItem, index: number): React.Node => (
            <UIListItem
              key={item.id}
              id={item.id}
              code={item.code}
              label={item.label}
              top={index}
              isSelected={selectedId === item.id}
              isLoading={item.isLoading}
            />
          )
        )(items)}
      </box>,
      <UILabel
        key="files-list-label"
        top={top}
        left={isLoading ? `${left}+1` : `${left}+4`}
        text={label}
        isLoading={isLoading}
      />,
    ]
  }

  handleFocus = () => {
    this.setState({
      hasFocus: true,
    })
  }

  handleBlur = () => {
    this.setState({
      hasFocus: false,
    })
  }

  /**
   * { function_description }
   *
   * @param  {string}   code  The code string
   * @param  {Object}  key   The key object
   *
   * @return {undefined}
   */
  handleMoveKeys = (code: string, key: Object) => {
    const { items, onChange, onSelect } = this.props
    const { position } = this.state

    const pageSize = this.refList.height - 2

    switch (key.full) {
      case "enter":
      case "space":
        onSelect(items[position].id)
        break
      case "home":
        onChange(
          pipe(
            head,
            get("id")
          )(items)
        )
        break
      case "end":
        onChange(
          pipe(
            tail,
            get("id")
          )(items)
        )
        break
      case "k":
      case "up":
        onChange(items[max([0, position - 1])].id)
        break
      case "j":
      case "down":
        onChange(items[min([items.length - 1, position + 1])].id)
        break
      case "pageup":
        onChange(items[max([0, position - pageSize])].id)
        break
      case "pagedown":
        onChange(min([items.length - 1, position + pageSize]))
        break
      default:
    }
  }

  /**
   * Link to blessed wrapper list object
   *
   * @param  {Object}  ref  The reference object
   *
   * @return {undefined}
   */
  linkRefList = (ref: Object) => {
    this.refList = ref
  }

  refList = {}
}

export type { UIListItem }
export { UIList }
