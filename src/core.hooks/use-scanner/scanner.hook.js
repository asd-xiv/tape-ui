const { fork } = require("child_process")

module.exports = {
  useScanner: ({ onFinish }) => {
    const worker = fork(`${__dirname}/scanner.worker.js`)

    worker.on("message", onFinish)

    return worker
  },
}
