// @flow

export const list = {
  keyable: true,
  vi: true,
  tags: true,
  scrollable: true,
  padding: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  scrollbar: {
    ch: " ",
    inverse: true,
  },
  style: {
    border: {
      fg: -1,
    },
  },
}

export const listHasFocus = {
  style: {
    border: {
      fg: "white",
    },
  },
}

export const donnoLabel = {
  bold: true,
  height: 3,
  shrink: true,
  left: "center",
  top: "center",
  style: {
    fg: "yellow",
  },
}
