// @flow

import * as React from "react"

import { baseStyle } from "./label.style"

const asciiFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]

type PropsType = {|
  text: string,
  top: number | string,
  left: number | string,
  isLoading: boolean,
|}

type StateType = {|
  frameNumber: number,
|}

export class UILabel extends React.PureComponent<PropsType, StateType> {
  static defaultProps = {
    isLoading: false,
  }

  state = {
    frameNumber: 0,
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
    const { isLoading } = this.props

    this.setupLoadingTimer(isLoading)
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
  componentDidUpdate = (prevProps: PropsType) => {
    const { isLoading } = this.props

    if (isLoading !== prevProps.isLoading) {
      this.setupLoadingTimer(isLoading)
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
    const { text, top, left, isLoading } = this.props
    const { frameNumber } = this.state

    return (
      <box
        class={baseStyle}
        top={top}
        left={left}
        content={
          isLoading
            ? `{bold}{blue-fg}${asciiFrames[frameNumber]}{/} ${text}`
            : text
        }
      />
    )
  }

  /**
   * { function_description }
   *
   * @param  {boolean}  isLoading  Indicates if loading boolean
   *
   * @return {undefined}
   */
  setupLoadingTimer = (isLoading: boolean) => {
    clearInterval(this.spinnerInterval)

    if (!isLoading) {
      this.setState({
        frameNumber: 0,
      })
    }

    if (isLoading) {
      this.spinnerInterval = setInterval(() => {
        this.setState(
          (prevState): $Shape<StateType> => ({
            frameNumber: (prevState.frameNumber + 1) % asciiFrames.length,
          })
        )
      }, 70)
    }
  }

  spinnerInterval = undefined
}
