// @flow

import * as React from "react"

type PropsType = {|
  name: string,
  version: string,
|}

type StateType = {
  memory: number,
}

class UITitle extends React.PureComponent<PropsType, StateType> {
  state = {
    memory: process.memoryUsage().rss,
  }

  componentWillUnmount = () => {
    clearInterval(this.memoryTimer)
  }

  render = (): React.Node => {
    const { name, version } = this.props
    const { memory } = this.state

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

  memoryTimer = setInterval(() => {
    this.setState({
      memory: process.memoryUsage().rss,
    })
  }, 1000)
}

export { UITitle }
