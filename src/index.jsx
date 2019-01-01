// @flow

const debug = require("debug")("TapeUI:Index")

import * as React from "react"
import blessed from "neo-blessed"
import { resolve } from "path"
import { createBlessedRenderer } from "react-blessed"

import { MainPage } from "./main.page/main.page"
import { Store } from "./state"

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

render(
  <Store pattern={/.*.test.js/} root={resolve("src/asd")}>
    <MainPage />
  </Store>,
  screen
)
