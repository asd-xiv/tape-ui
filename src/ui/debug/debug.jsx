/* eslint-disable react/forbid-prop-types */

import React from "react"
import PropTypes from "prop-types"
import { map, pipe, join } from "@mutant-ws/m"

import * as style from "./debug.style"

const UIDebug = ({ label, value, top, left, width, height }) => {
  return (
    <box
      class={style.debug}
      label={label}
      top={top}
      left={left}
      width={width}
      height={height}
      content={pipe(
        Object.entries,
        map(
          ([entryKey, entryValue]) =>
            `${entryKey}: ${JSON.stringify(entryValue)}`
        ),
        join("\n")
      )(value)}
    />
  )
}

UIDebug.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

UIDebug.defaultProps = {
  top: "center",
  left: "center",
  width: "50%",
  height: "50%",
}

export { UIDebug }
