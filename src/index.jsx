// @flow

const debug = require("debug")("TapeUI:Index")

import * as React from "react"
import blessed from "neo-blessed"
import { resolve, join } from "path"
import { createBlessedRenderer } from "react-blessed"

import { MainPage } from "./main.page/main.page"
import { Store } from "./store"

//
const screen = blessed.screen({
  title: "Tape UI",
  tabSize: 2,
  autoPadding: true,
  smartCSR: true,
  dockBorders: true,
  fullUnicode: true,
})

screen.key(["escape", "q", "C-c"], () => {
  process.exit(0)
})

//
const render = createBlessedRenderer(blessed)

type PropType = {
  require: string[],
  path: string,
  pattern: string,
}

export default ({ require, path, pattern }: PropType) => {
  render(
    <Store
      require={require}
      pattern={pattern}
      root={resolve(join(process.cwd(), path))}>
      <MainPage />
    </Store>,
    screen
  )
}
