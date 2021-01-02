/**
 * Runs via process.fork inside the main app.
 *
 * The overhead of starting >100 test files using process.spawn inside the
 * main process is not negligible and will block the UI.
 * Using a secondary long-running process will reduce that overhead from the
 * main app.
 */

const { spawn } = require("child_process")
const { logger } = require("../../core.libs/logger")

const runOne = ({ path, runArgs }) => {
  logger.info({
    date: new Date(),
    path,
    runArgs,
  })

  const child = spawn("node", [...runArgs, path], {
    detached: false,
    cwd: process.cwd(),
    env: {},
  })

  const stdout = []
  const stderr = []

  child.stdout.on("data", data => {
    stdout.push(data.toString())
  })

  child.stderr.on("data", data => {
    stderr.push(data.toString())
  })

  child.on("exit", code => {
    process.send({
      path,
      code,
      stdout: stdout.join(""),
      stderr: stderr.join(""),
    })
  })
}

process.on("message", ({ path, runArgs }) => {
  runOne({ path, runArgs })
})
