'use strict'

var logger = require('logger')('lightService')

var LIGHT_SOURCE = '/opt/light/'

var setAwake = require(`${LIGHT_SOURCE}awake.js`)
var setSpeaking = require(`${LIGHT_SOURCE}setSpeaking.js`)

function Light (options) {
  this.playerHandle = {}
  this.options = options
  this.prev = null
  this.degree = 0
  this.init()
}

Light.prototype.init = function () {
  // TODO
  this.setHide()
}

Light.prototype.stopPrev = function (keep) {
  if (this.prev) {
    if (typeof this.prev === 'function') {
      this.prev(keep)
    } else if (this.prev && typeof this.prev.stop === 'function') {
      this.prev.stop(keep)
    }
    this.prev = null
  }
}

Light.prototype.loadfile = function (uri, data, callback) {
  var handle
  try {
    handle = require(uri)
    this.stopPrev()
    this.prev = handle(this.options.effect, data || {}, callback)
  } catch (error) {
    logger.error(`load effect file error from path: ${uri}`, error)
    callback(error)
  }
}

Light.prototype.setAwake = function () {
  this.stopPrev()
  this.prev = setAwake(this.options.effect)
  this.prev.name = 'setAwake'
}

Light.prototype.setDegree = function (degree) {
  if (this.prev && this.prev.name === 'setAwake') {
    this.degree = +degree
    this.prev.setDegree(+degree)
  }
}

Light.prototype.setHide = function () {
  this.stopPrev()
  this.options.effect.stop()
  this.options.effect.clear()
  this.options.effect.render()
}

Light.prototype.setLoading = function () {
  if (this.prev) {
    if (typeof this.prev === 'object' && this.prev.name === 'setAwake') {
      this.stopPrev(true)
    } else {
      this.stopPrev()
    }
  }
  var hook = require(`${LIGHT_SOURCE}loading.js`)
  this.prev = hook(this.options.effect, {
    degree: this.degree || 0
  })
}

Light.prototype.setStandby = function () {
  this.stopPrev()
  var hook = require(`${LIGHT_SOURCE}setStandby.js`)
  this.prev = hook(this.options.effect)
}

Light.prototype.setVolume = function (volume) {
  if (this.prev) {
    if (typeof this.prev === 'object' && this.prev.name === 'setVolume') {
      this.stopPrev(true)
    } else {
      this.stopPrev()
    }
  }
  var hook = require(`${LIGHT_SOURCE}setVolume.js`)
  this.prev = hook(this.options.effect, {
    volume: +volume
  })
  this.prev.name = 'setVolume'
}

Light.prototype.setConfigFree = function () {
  this.stopPrev()
  this.options.effect.stop()
  this.options.effect.clear()
  this.options.effect.render()
}

Light.prototype.setWelcome = function () {
  this.stopPrev()
  var hook = require(`${LIGHT_SOURCE}setWelcome.js`)
  this.prev = hook(this.options.effect)
}

Light.prototype.appSound = function (appId, name) {
  if (this.playerHandle[appId]) {
    try {
      // if the frequency is too fast, an error will occur.
      this.playerHandle[appId].stop()
      delete this.playerHandle[appId]
    } catch (error) {
      // if the previous one did not stop, ignore this time
      logger.log(`ignore request: appId [${appId}] sound: [${name}]`)
      return false
    }
  }
  var player = this.options.effect.sound(name)
  // free the player handle after playbackcomplete or error event
  player.on('playbackcomplete', () => {
    this.playerHandle[appId].stop()
    delete this.playerHandle[appId]
  })
  player.on('error', () => {
    this.playerHandle[appId].stop()
    delete this.playerHandle[appId]
  })

  this.playerHandle[appId] = player
  return true
}

Light.prototype.setPickup = function (duration, callback) {
  this.stopPrev()
  var hook = require(`${LIGHT_SOURCE}setPickup.js`)
  this.prev = hook(this.options.effect, {
    duration: duration,
    degree: this.degree
  }, callback)
}

Light.prototype.setSpeaking = function () {
  this.stopPrev(true)
  this.prev = setSpeaking(this.options.effect)
}

module.exports = Light
