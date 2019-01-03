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
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(0)
})

//
const render = createBlessedRenderer(blessed)

type PropType = {
  requireModules: string[],
  path: string,
  pattern: string,
}

export default ({ requireModules, path, pattern }: PropType) => {
  render(
    <Store
      requireModules={requireModules}
      pattern={pattern}
      root={resolve(join(process.cwd(), path))}>
      <MainPage />
    </Store>,
    screen
  )
}
