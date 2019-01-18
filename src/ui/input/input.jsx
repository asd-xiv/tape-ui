// @flow

import * as React from "react"
import { isEmpty } from "@asd14/m"

import { labelStyle, inputStyle, wrapperStyle } from "./input.style"

type Props = {|
  label: string,
  value: string,
  top: number | string,
  left: number | string,
  width: number | string,
  onChange: (value: string) => void,
  onSubmit: (value: string) => void,
  onCancel: (value: string) => void,
|}

export class UIInput extends React.PureComponent<Props> {
  static defaultProps = {
    label: "",
    top: "center",
    left: "center",
    width: "50%",
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
    const { value } = this.props

    this.refFilterInput.on("keypress", (code, key) => {
      if (!isEmpty(code) && /[a-zA-Z0-9 \-=\.]/.test(code)) {
        this.handleInputAdd(code)
      }
      if (key.full === "backspace") {
        this.handleInputPop()
      }
    })

    this.refFilterInput.setValue(value)
    this.refFilterInput.focus()
  }

  /**
   * Examine this.props and this.state and return a single React element. This
   * element can be either a representation of a native DOM component, such as
   * <div />, or another composite component that you've defined yourself.
   *
   * @return {React.Node}
   */
  render = (): React.Node => {
    const { value, label, top, left, width, onSubmit, onCancel } = this.props

    return (
      <element
        ref={this.linkRefFilterWraper}
        keyable={true}
        class={wrapperStyle}
        width={width}
        top={top}
        left={left}>
        {!isEmpty(label) && (
          <box class={labelStyle} width={label.length} content={label} />
        )}
        <textbox
          ref={this.linkRefFilterInput}
          class={inputStyle}
          left={label.length}
          inputOnFocus={true}
          width={`100%-${label.length + 4}`}
          content={value}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </element>
    )
  }

  handleInputAdd = (code: string) => {
    const { value, onChange } = this.props

    onChange(`${value}${code}`)
  }

  handleInputPop = () => {
    const { value, onChange } = this.props

    onChange(value.substr(0, value.length - 1))
  }

  linkRefFilterInput = (ref: Object) => {
    this.refFilterInput = ref
  }

  linkRefFilterWraper = (ref: Object) => {
    this.refFilterWrapper = ref
  }

  refFilterInput = {}

  refFilterWrapper = {}
}
