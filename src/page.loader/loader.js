const blessed = require("neo-blessed")
const {
  flatten,
  distinct,
  count,
  map,
  read,
  prepend,
  countWith,
  is,
  join,
  push,
  pipe,
} = require("@asd14/m")

const loaderPage = ({ parent }) => {
  // Parent of all component's UI elements
  const ref = blessed.element({
    parent,
  })

  blessed.box({
    parent: ref,
    align: "left",
    top: "10%",
    left: "center",
    width: 49,
    height: 10,
    content: `
████████╗ █████╗ ██████╗ ███████╗    ██╗   ██╗██╗
╚══██╔══╝██╔══██╗██╔══██╗██╔════╝    ██║   ██║██║
   ██║   ███████║██████╔╝█████╗      ██║   ██║██║
   ██║   ██╔══██║██╔═══╝ ██╔══╝      ██║   ██║██║
   ██║   ██║  ██║██║     ███████╗    ╚██████╔╝██║
   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚══════╝     ╚═════╝ ╚═╝

       --- Reactive test runner for Tape ---`,
  })

  const progress = blessed.box({
    parent: ref,
    top: "10%+11",
    align: "left",
    left: "center",
    width: 60,
    tags: true,
  })

  return [
    ref,
    ({ fileGlob, files, isLoaded, isFileDependencyScanFinished }) => {
      const sourceFileCount = pipe(
        map(read("dependsOnFiles", [])),
        flatten,
        distinct,
        count
      )(files)

      const testFilesTraversed = countWith({ dependsOnFiles: is }, files)

      progress.setContent(
        pipe(
          push(
            `${isLoaded ? "{bold}{green-fg}✓{/green-fg}" : " "} Scanning ... ${
              files.length
            } test files found{/}`
          ),
          push("{007-fg}"),
          push(""),
          push("  // Files matching:"),
          push(map(prepend("  //   - "), fileGlob)),
          push("{/}"),

          push(""),

          push(
            `{bold}${
              isFileDependencyScanFinished ? "{green-fg}✓{/green-fg}" : " "
            } Building dependency tree ... ${testFilesTraversed}/${
              files.length
            } files{/}`
          ),
          push(""),
          push(
            `{007-fg}  // Will watch for changes of ${sourceFileCount} source files{/}`
          ),

          flatten,
          join("\n")
        )([])
      )
    },
  ]
}

module.exports = { loaderPage }
