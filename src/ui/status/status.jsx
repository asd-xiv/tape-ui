// @flow

import * as React from "react"
import figures from "figures"

import * as style from "./status.style"

const asciiFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]

type Props = {|
  top: string | number,
  left: string | number,
  width: string | number,
  total: number,
  fail: number,
  run: number,
  isLoading: boolean,
|}

type State = {
  frame: number,
}

class UIStatus extends React.PureComponent<Props, State> {
  state = {
    frame: 0,
  }

  componentDidMount = () => {
    const { isLoading } = this.props

    this.setupLoadingTimer(isLoading)
  }

  componentDidUpdate = (prevProps: Props) => {
    const { isLoading } = this.props

    if (isLoading !== prevProps.isLoading) {
      this.setupLoadingTimer(isLoading)
    }
  }

  render = () => {
    const { top, left, width, total, fail, run, isLoading } = this.props
    const { frame } = this.state

    const status = `${fail} fails, out of ${total}`

    return (
      <box
        tags={true}
        class={
          isLoading ? style.isRun : fail === 0 ? style.isPass : style.isFail
        }
        top={top}
        left={left}
        width={width}
        height={1}
        content={
          isLoading
            ? ` ${asciiFrames[frame]} ${run} running`
            : fail === 0
            ? ` ${figures.tick} ${status}`
            : ` ${figures.cross} ${status}`
        }
      />
    )
  }

  setupLoadingTimer = (isLoading: boolean) => {
    clearInterval(this.spinnerInterval)

    if (isLoading) {
      this.spinnerInterval = setInterval(() => {
        this.setState(state => ({
          frame: (state.frame + 1) % asciiFrames.length,
        }))
      }, 70)
    }
  }

  spinnerInterval = undefined
}

export { UIStatus }
