const { fork } = require("child_process")

module.exports = {
  useRunner: ({ runArgs, onFinish }) => {
    const worker = fork(`${__dirname}/runner.worker.js`, runArgs)

    worker.on("message", onFinish)

    return worker
  },
}
