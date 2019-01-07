import * as React from "react"
import neoBlessed from "neo-blessed"
import { resolve, join } from "path"
import { createBlessedRenderer } from "react-blessed"

import { AppContainer } from "./app/app.container"

const pkg = require(`../package.json`)
const projectPkg = require(`${process.cwd()}/package.json`)

//
export default ({ requireModules, rootPath, filePattern }) => {
  createBlessedRenderer(neoBlessed)(
    <AppContainer
      name={pkg.name}
      version={pkg.version}
      projectName={projectPkg.name}
      projectVersion={projectPkg.version}
      requireModules={requireModules}
      filePattern={filePattern}
      rootPath={resolve(join(process.cwd(), rootPath))}
    />,
    neoBlessed.screen({
      title: `Tape UI v${pkg.version}`,
      tabSize: 2,
      autoPadding: true,
      smartCSR: true,
      dockBorders: true,
      fullUnicode: true,
    })
  )
}
