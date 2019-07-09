var EventEmitter = require('events')
var flora = require('@yoda/flora')
var floraDisposable = require('@yoda/flora/disposable')

var PICKUP_CHANNEL = 'rokid.turen.pickup'
var MIC_MUTE_CHANNEL = 'rokid.turen.mute'
var DISABLE_WAKEUP_ENGINE_CHANNEL = 'rokid.turen.disable.wakeupEngine'

/**
 * @event oppress
 */
class VoiceInterface extends EventEmitter {
  constructor (appId) {
    super()
    this.appId = appId
  }

  pickup (pickup) {
    floraDisposable.post(PICKUP_CHANNEL, [ pickup ? 1 : 0 ], flora.MSGTYPE_PERSIST)
  }

  getPickingUp () {
    return floraDisposable.once(PICKUP_CHANNEL)
      .then(msg => {
        return msg[0] === 1
      })
  }

  micMute (mute) {
    floraDisposable.post(MIC_MUTE_CHANNEL, [ mute ? 1 : 0 ], flora.MSGTYPE_PERSIST)
  }

  getMicMuted () {
    return floraDisposable.once(MIC_MUTE_CHANNEL)
      .then(msg => {
        return msg[0] === 1
      })
  }

  setWakeupEngineEnabled (enabled) {
    floraDisposable.post(DISABLE_WAKEUP_ENGINE_CHANNEL, [ enabled ? 0 : 1 ], flora.MSGTYPE_PERSIST)
  }

  getWakeupEngineEnabled () {
    return floraDisposable.once(DISABLE_WAKEUP_ENGINE_CHANNEL)
      .then(msg => {
        return msg[0] === 0
      })
  }
}

var voiceInterface
Object.defineProperty(module.exports, 'voiceInterface', {
  enumerable: true,
  configurable: true,
  get: () => {
    if (voiceInterface == null) {
      var appId = global[Symbol.for('yoda#api')].appId
      voiceInterface = new VoiceInterface(appId)
    }
    return voiceInterface
  }
})
