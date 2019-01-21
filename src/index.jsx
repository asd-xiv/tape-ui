import * as React from "react"
import neoBlessed from "neo-blessed"
import { join } from "path"
import { createBlessedRenderer } from "react-blessed"

import { AppContainer } from "./app/app.container"

const pkg = require(`../package.json`)
const projectPkg = require(`${process.cwd()}/package.json`)

const screen = neoBlessed.screen({
  title: `${pkg.name} v${pkg.version}`,
  tabSize: 2,
  autoPadding: true,

  // Whether the focused element grabs all keypresses
  grabKeys: true,

  smartCSR: true,
  dockBorders: true,
  fullUnicode: true,
  ignoreLocked: ["C-c", "tab"],
})

export default ({ requireModules, rootPath, filePattern }) => {
  createBlessedRenderer(neoBlessed)(
    <AppContainer
      screen={screen}
      name={projectPkg.name}
      version={projectPkg.version}
      requireModules={requireModules}
      filePattern={filePattern}
      rootPath={join(process.cwd(), rootPath)}
    />,
    screen
  )
}
