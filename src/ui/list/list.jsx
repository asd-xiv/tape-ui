// @flow

import * as React from "react"
import { min, max, map, filter, replace, findIndexBy, isEmpty } from "@asd14/m"

import { UIListItem } from "./list__item"
import { UILabel } from "../label/label"

import { baseStyle, donnoStyle } from "./list.style"

type UIListItemType = {|
  id: string,
  label: string,
  code?: number,
  isLoading: boolean,
|}

type PropsType = {|
  selectedId: string,
  label: string,
  filter: string,
  top: number | string,
  left: number | string,
  width: number | string,
  height: number | string,
  items: UIListItemType[],
  isLoading: boolean,
  onSelect: (id: string) => void,
|}

type StateType = {
  hoverPosition: number,
}

class UIList extends React.Component<PropsType, StateType> {
  static defaultProps = {
    selectedId: "",
    label: "",
    filter: "",
    top: "center",
    left: "center",
    width: "50%",
    height: "50%",
    isLoading: false,
  }

  state = {
    hoverPosition: 0,
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
    const pageSize = this.refList.height - 2

    this.refList.scrollTo(0)

    this.refList.on("keypress", this.handleMoveKeys)

    // hook into children mouse wheel events
    this.refList.on("element wheeldown", (/* el, mouse */) => {
      this.refList.scroll(pageSize)
    })

    this.refList.on("element wheelup", (/* el, mouse */) => {
      this.refList.scroll(-pageSize)
    })
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
  componentDidUpdate = (prevProps: PropsType, prevState: StateType) => {
    const { hoverPosition } = this.state

    if (hoverPosition !== prevState.hoverPosition) {
      this.refList.scrollTo(hoverPosition)
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
      filter: query,
      top,
      left,
      width,
      height,
      items: allItems,
      isLoading,
    } = this.props
    const { hoverPosition } = this.state

    const items = isEmpty(query)
      ? allItems
      : filter(
          (item: UIListItemType): boolean => item.id.indexOf(query) !== -1
        )(allItems)
    const filesCountLabel = `${allItems.length} files`

    return [
      <box
        key="files-list-items"
        ref={this.linkRefList}
        class={baseStyle}
        top={top}
        left={left}
        width={width}
        height={height}>
        {isEmpty(items) && !isEmpty(query) ? (
          <box content="¯\_(ツ)_/¯" class={donnoStyle} />
        ) : null}
        {map(
          (item: UIListItemType, index: number): React.Node => (
            <UIListItem
              key={item.id}
              id={item.id}
              code={item.code}
              label={replace(query, `{bold}${query}{/bold}`)(item.label)}
              top={index}
              isSelected={selectedId === item.id}
              isHovered={hoverPosition === index}
              isLoading={item.isLoading}
              onClick={this.handleItemClick}
              onKeypress={this.handleMoveKeys}
            />
          )
        )(items)}
      </box>,
      <UILabel
        key="files-list-label"
        top={top}
        left={isLoading ? left : `${left}+2`}
        text={
          isEmpty(label) ? filesCountLabel : `${label} - ${filesCountLabel}`
        }
        isLoading={isLoading}
      />,
    ]
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
    const { items, onSelect } = this.props
    const { hoverPosition } = this.state

    const pageSize = this.refList.height - 2

    switch (key.full) {
      case "enter":
      case "space":
        onSelect(items[hoverPosition].id)
        break
      case "home":
        this.setState({
          hoverPosition: 0,
        })
        break
      case "end":
        this.setState({
          hoverPosition: items.length - 1,
        })
        break
      case "k":
      case "up":
        this.setState(
          (prevState): $Shape<StateType> => ({
            hoverPosition: max([0, prevState.hoverPosition - 1]),
          })
        )
        break
      case "j":
      case "down":
        this.setState(
          (prevState): $Shape<StateType> => ({
            hoverPosition: min([items.length - 1, prevState.hoverPosition + 1]),
          })
        )
        break
      case "pageup":
        this.setState(
          (prevState): $Shape<StateType> => ({
            hoverPosition: max([0, prevState.hoverPosition - pageSize]),
          })
        )
        break
      case "pagedown":
        this.setState(
          (prevState): $Shape<StateType> => ({
            hoverPosition: min([
              items.length - 1,
              prevState.hoverPosition + pageSize,
            ]),
          })
        )
        break
      default:
    }
  }

  /**
   * { function_description }
   *
   * @param  {string}  id     The identifier
   * @param  {Object}  event  The event
   *
   * @return {undefined}
   */
  handleItemClick = (id: string /* , event: Object */) => {
    const { items, onSelect } = this.props

    this.setState(
      {
        hoverPosition: findIndexBy({ id })(items),
      },
      () => {
        onSelect(id)
      }
    )
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

export type { UIListItemType }
export { UIList }
