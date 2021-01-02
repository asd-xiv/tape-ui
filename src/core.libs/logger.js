const { createLogger, format, transports } = require("winston")

module.exports = {
  logger: createLogger({
    format: format.json(),
    transports: [new transports.File({ filename: "tape-ui.log" })],
  }),
}
