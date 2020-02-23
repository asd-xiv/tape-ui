import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"

const UITitle = ({ name, version }) => {
  const [memory, setMemory] = useState(process.memoryUsage().rss)

  useEffect(() => {
    const memoryTimer = setInterval(() => {
      setMemory(process.memoryUsage().rss)
    }, 1000)

    return () => clearInterval(memoryTimer)
  }, [])

  return (
    <box
      tags={true}
      top="0"
      right="0"
      width="50%"
      content={`{right}${name} v${version} | ${`${Math.round(
        memory / 1048576
      )}MB`}{/right}`}
    />
  )
}

UITitle.propTypes = {
  name: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
}

export { UITitle }
