const { createStore, combineReducers } = require("redux")

const { FileList } = require("./ui.files/files.list")

// Global state store
const store = createStore(
  combineReducers({
    "USE-STATE": (state = {}, { type, payload: { id, value } = {} }) => {
      switch (type) {
        case "USE-STATE.SET":
          return {
            ...state,
            [id]: value,
          }
        default:
          return state
      }
    },
    [FileList.name]: FileList.reducer,
  })
)

// Link list to app store
FileList.set({ dispatch: store.dispatch })

module.exports = { store }
