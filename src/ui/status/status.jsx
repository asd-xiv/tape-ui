import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import figures from "figures"
import { is } from "@mutant-ws/m"

import * as style from "./status.style"

const asciiFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]

const UIStatus = ({
  top,
  left,
  width,
  totalCount,
  failCount,
  runningCount,
  isLoading,
}) => {
  const [spinnerCharIndex, setSpinnerCharIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSpinnerCharIndex(prev => (prev + 1) % asciiFrames.length)
    }, 70)

    if (!isLoading && is(interval)) {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [isLoading, spinnerCharIndex])

  const status = `${failCount} fails out of ${totalCount}`

  return (
    <box
      tags={true}
      class={
        isLoading ? style.isRun : failCount === 0 ? style.isPass : style.isFail
      }
      top={top}
      left={left}
      width={width}
      height={1}
      content={
        isLoading
          ? ` ${asciiFrames[spinnerCharIndex]} ${runningCount} running`
          : failCount === 0
          ? ` ${figures.tick} ${status}`
          : ` ${figures.cross} ${status}`
      }
    />
  )
}

UIStatus.propTypes = {
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  totalCount: PropTypes.number.isRequired,
  failCount: PropTypes.number.isRequired,
  runningCount: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
}

UIStatus.defaultProps = {
  isLoading: false,
}

export { UIStatus }
