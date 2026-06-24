const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')

function clone(value) {
  if (value === undefined) {
    return undefined
  }

  return JSON.parse(JSON.stringify(value))
}

function createWxMock(initialStorage = {}) {
  const storage = new Map()
  const calls = {
    showToast: [],
    showModal: [],
    navigateTo: [],
    redirectTo: [],
    reLaunch: [],
    navigateBack: []
  }

  Object.keys(initialStorage).forEach((key) => {
    storage.set(key, clone(initialStorage[key]))
  })

  return {
    calls,
    getStorageSync(key) {
      return clone(storage.get(key))
    },
    setStorageSync(key, value) {
      storage.set(key, clone(value))
    },
    removeStorageSync(key) {
      storage.delete(key)
    },
    clearStorageSync() {
      storage.clear()
    },
    showToast(options = {}) {
      calls.showToast.push(options)
    },
    showModal(options = {}) {
      calls.showModal.push(options)
      if (typeof options.success === 'function') {
        options.success({ confirm: true, cancel: false })
      }
    },
    navigateTo(options = {}) {
      calls.navigateTo.push(options)
      if (typeof options.success === 'function') {
        options.success()
      }
    },
    redirectTo(options = {}) {
      calls.redirectTo.push(options)
    },
    reLaunch(options = {}) {
      calls.reLaunch.push(options)
    },
    navigateBack(options = {}) {
      calls.navigateBack.push(options)
      if (typeof options.fail === 'function') {
        options.fail()
      }
    }
  }
}

function clearModule(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath)
  delete require.cache[require.resolve(absolutePath)]
}

function requireFresh(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath)
  delete require.cache[require.resolve(absolutePath)]
  return require(absolutePath)
}

function loadPage(relativePath, wxMock = createWxMock()) {
  let pageConfig = null

  global.wx = wxMock
  global.Page = (config) => {
    pageConfig = config
  }

  requireFresh(relativePath)

  if (!pageConfig) {
    throw new Error(`Page config not captured: ${relativePath}`)
  }

  const page = {
    data: clone(pageConfig.data || {}),
    setData(nextData, callback) {
      this.data = {
        ...this.data,
        ...clone(nextData)
      }

      if (typeof callback === 'function') {
        callback.call(this)
      }
    }
  }

  Object.keys(pageConfig).forEach((key) => {
    if (key === 'data') {
      return
    }

    page[key] = typeof pageConfig[key] === 'function'
      ? pageConfig[key].bind(page)
      : clone(pageConfig[key])
  })

  delete global.Page

  return page
}

function makeEvent(dataset = {}, value = '') {
  return {
    currentTarget: {
      dataset
    },
    detail: {
      value
    }
  }
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(projectRoot, relativePath), 'utf8'))
}

module.exports = {
  projectRoot,
  createWxMock,
  clearModule,
  requireFresh,
  loadPage,
  makeEvent,
  readJson
}
