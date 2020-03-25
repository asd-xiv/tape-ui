import React, { useRef, useEffect } from "react"
import PropTypes from "prop-types"
import { isEmpty, is } from "@mutant-ws/m"

import { labelStyle, inputStyle, wrapperStyle } from "./input.style"

const UIInput = ({
  value,
  label,
  top,
  left,
  width,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const inputRef = useRef()

  const handleInputAdd = code => {
    onChange(`${value}${code}`)
  }

  const handleInputPop = () => {
    onChange(value.substr(0, value.length - 1))
  }

  useEffect(() => {
    if (is(inputRef.current)) {
      inputRef.current.focus()
    }
  })

  return (
    <element
      keyable={true}
      class={wrapperStyle}
      width={width}
      top={top}
      left={left}>
      {!isEmpty(label) && (
        <box class={labelStyle} width={label.length} content={label} />
      )}
      <textbox
        ref={inputRef}
        class={inputStyle}
        left={label.length}
        inputOnFocus={true}
        width={`100%-${label.length + 4}`}
        content={value}
        onKeypress={(code, key) => {
          if (!isEmpty(code) && /[\d .=A-Za-z\-]/.test(code)) {
            handleInputAdd(code)
          }
          if (key.full === "backspace") {
            handleInputPop()
          }
        }}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </element>
  )
}

UIInput.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

UIInput.defaultProps = {
  value: "",
  label: "",
  top: "center",
  left: "center",
  width: "50%",
}

export { UIInput }
