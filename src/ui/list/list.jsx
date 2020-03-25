import React, { useEffect, useRef } from "react"
import PropTypes from "prop-types"
import {
  max,
  min,
  map,
  findIndexWith,
  pipe,
  get,
  head,
  tail,
  isEmpty,
  is,
} from "@mutant-ws/m"

import { UIListItem } from "./list__item"

import * as style from "./list.style"

const UIList = ({
  selectedId,
  width,
  height,
  top,
  left,
  items,
  onChange,
  onSelect,
}) => {
  const ref = useRef()
  const position = findIndexWith({ id: selectedId })(items)

  useEffect(() => {
    if (is(ref.current)) {
      ref.current.scrollTo(0)
      ref.current.focus()
    }
  })

  useEffect(() => {
    if (is(ref.current)) {
      ref.current.scrollTo(position === -1 ? 0 : position)
    }
  }, [position])

  const handleMoveKeys = (code, key) => {
    const pageSize = ref.current.height - 2

    switch (key.full) {
      case "M-r":
        onSelect(map(get("id"))(items))
        break
      case "r":
        onSelect(items[position].id)
        break
      case "home":
        onChange(pipe(head, get("id"))(items))
        break
      case "end":
        onChange(pipe(tail, get("id"))(items))
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

  return [
    <box
      key="files-list-items"
      ref={ref}
      class={style.list}
      top={top}
      left={left}
      width={width}
      height={height}
      onKeypress={handleMoveKeys}>
      {isEmpty(items) ? (
        <box content="¯\_(ツ)_/¯" class={style.donnoLabel} />
      ) : null}
      {map((item, index) => (
        <UIListItem
          key={item.id}
          id={item.id}
          code={item.code}
          label={item.label}
          top={`${top}+${index}`}
          isSelected={selectedId === item.id}
          isLoading={item.isLoading}
        />
      ))(items)}
    </box>,
  ]
}

UIList.propTypes = {
  selectedId: PropTypes.string,
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      code: PropTypes.number.isRequired,
      isLoading: PropTypes.bool.isRequired,
    })
  ),
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
}

UIList.defaultProps = {
  selectedId: "",
  label: "",
  top: "center",
  left: "center",
  width: "50%",
  height: "50%",
}

export { UIList }
