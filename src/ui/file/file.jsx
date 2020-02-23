import React from "react"
import PropTypes from "prop-types"

import * as style from "./file.style"

const UIFile = ({ top, left, width, height, content }) => {
  return (
    <log
      class={style.file}
      top={top}
      left={left}
      width={width}
      height={height}
      scrollOnInput={true}
      content={content}
    />
  )
}

UIFile.propTypes = {
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  content: PropTypes.string,
}

UIFile.defaultProps = {
  content: "",
}

export { UIFile }
