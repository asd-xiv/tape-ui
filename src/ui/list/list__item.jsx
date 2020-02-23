import React from "react"
import PropTypes from "prop-types"
import figures from "figures"

import * as style from "./list__item.style"

const UIListItem = ({ label, code, top, isSelected, isLoading }) => {
  const color = isLoading
    ? "{blue-fg}"
    : code === -1
    ? "{white-fg}"
    : code === 0
    ? "{green-fg}"
    : "{red-fg}"
  const underline = isSelected ? "{underline}" : ""

  return (
    <box
      class={[style.item, isSelected && style.selected]}
      top={top}
      keyable={false}
      content={`${color}{bold}${figures.squareSmallFilled}{/} ${underline}${label}{/}`}
    />
  )
}

UIListItem.propTypes = {
  label: PropTypes.string.isRequired,
  code: PropTypes.number,
  top: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  isLoading: PropTypes.bool,
}

UIListItem.defaultProps = {
  code: -1,
  isSelected: false,
  isLoading: false,
}

export { UIListItem }
