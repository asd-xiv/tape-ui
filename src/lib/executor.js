/**
 * Runs via process.fork inside the main app.
 *
 * The overhead of starting >100 test files using process.spawn inside the
 * main process is not negligible and will block the UI.
 * Using a secondary acid long-running process will fully eliminate that overhead from
 * the main app.
 */

import { spawn } from "child_process"

const runOne = ({ path, runArgs }) => {
  const fileSpawn = spawn("node", [path, ...runArgs], {
    detached: false,
    cwd: process.cwd(),
    env: {},
  })

  const stdout = []
  const stderr = []

  fileSpawn.stdout.on("data", data => {
    stdout.push(data.toString())
  })

  fileSpawn.stderr.on("data", data => {
    stderr.push(data.toString())
  })

  fileSpawn.on("exit", code => {
    process.send({
      path,
      code,
      stdout: stdout.join("\n"),
      stderr: stderr.join("\n"),
    })
  })
}

process.on("message", ({ path, runArgs }) => {
  runOne({ path, runArgs })
})
