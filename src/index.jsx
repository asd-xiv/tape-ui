// @flow

import * as React from "react"
import blessed from "neo-blessed"
import { resolve, join } from "path"
import { createBlessedRenderer } from "react-blessed"

import { App } from "./app/app"
import { Store, Consumer } from "./app/store"
import pkg from "../package.json"

import type { StoreStateType } from "./app/store"

//
const screen = blessed.screen({
  title: "Tape UI",
  tabSize: 2,
  autoPadding: true,
  smartCSR: true,
  dockBorders: true,
  fullUnicode: true,
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
      <Consumer>
        {(storeState: StoreStateType): React.Node => (
          <App name="Tape UI" version={pkg.version} {...storeState} />
        )}
      </Consumer>
    </Store>,
    screen
  )
}
