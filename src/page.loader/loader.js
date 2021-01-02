const blessed = require("neo-blessed")
const {
  flatten,
  distinct,
  count,
  map,
  read,
  countWith,
  is,
  join,
  all,
  hasKey,
  pipe,
} = require("m.xyz")

const { FileList, store } = require("../index.state")

const loaderPage = ({ parent, glob, onFilesLoaded }) => {
  //
  const state = { isLoaded: null, isLoading: null }

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
    height: 9,
    content: `████████╗ █████╗ ██████╗ ███████╗    ██╗   ██╗██╗
╚══██╔══╝██╔══██╗██╔══██╗██╔════╝    ██║   ██║██║
   ██║   ███████║██████╔╝█████╗      ██║   ██║██║
   ██║   ██╔══██║██╔═══╝ ██╔══╝      ██║   ██║██║
   ██║   ██║  ██║██║     ███████╗    ╚██████╔╝██║
   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚══════╝     ╚═════╝ ╚═╝

       --- Reactive test runner for Tape ---`,
  })

  const table = blessed.table({
    parent: ref,
    top: "10%+11",
    align: "left",
    left: "center",
    width: 60,
    tags: true,
    style: {
      cell: { padding: 0 },
    },
  })

  return [
    ref,
    () => {
      const fileListSelect = FileList.selector(store.getState())
      const files = fileListSelect.items()
      const isLoading = fileListSelect.isLoading()
      const isLoaded = fileListSelect.isLoaded()

      /*
       * useEffect(() => {
       *   ...
       * }, [isLoading, isLoaded])
       */

      if (state.isLoading !== isLoading || state.isLoaded !== isLoaded) {
        if (!isLoading && !isLoaded) {
          // logger.log("{bold}Scanning files")
          // logger.log("==={/}")
          // logger.log("")

          // forEach(item => logger.log(`- ${item}`))(glob)
          // logger.log("")

          FileList.read(glob)
        }

        if (isLoaded) {
          // logger.log(`> Found ${files.length} test files`)

          onFilesLoaded(map(read("id"), files))
        }
      }

      const testFilesTraversed = countWith({
        dependsOnFiles: is,
      })(files)

      const sourceFileCount = pipe(
        map(read("dependsOnFiles", [])),
        flatten,
        distinct,
        count
      )(files)

      const isScanFinished = all(hasKey("dependsOnFiles"), files)

      table.setData([
        [
          isLoaded ? "{green-fg}{bold}✓{/}" : "",
          `{bold}Scanning{/} ... [${files.length} files found]`,
        ],
        ["", `  {#909090-fg}// Matching globs: ${join(", ")(glob)}{/}`],

        [
          isScanFinished ? "{green-fg}{bold}✓{/}" : "",
          `{bold}Building dependency tree{/} ... [${testFilesTraversed}/${files.length} files traversed]`,
        ],
        [
          "",
          `  {#909090-fg}// Will watch and react to changes of ${sourceFileCount} source files{/}`,
        ],
      ])

      //
      state.isLoaded = isLoaded
      state.isLoading = isLoading
    },
  ]
}

module.exports = { loaderPage }
