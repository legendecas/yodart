var AudioFocus = require('@yodaos/application').AudioFocus
var speechSynthesis = require('@yodaos/speech-synthesis').speechSynthesis
var logger = require('logger')('player')

var constant = require('../constant')
var GetStreamChannel = constant.GetStreamChannel
var TtsStatusChannel = constant.TtsStatusChannel
var StatusCode = constant.StatusCode

module.exports = function TtsStream () {
  var focus = new AudioFocus(AudioFocus.Type.TRANSIENT)
  focus.onGain = () => {
    var utter = speechSynthesis.playStream()
      .on('start', () => {
        this.agent.post(TtsStatusChannel, [ StatusCode.start ])
      })
      .on('cancel', () => {
        logger.info('on cancel')
        this.agent.post(TtsStatusChannel, [ StatusCode.cancel ])
        focus.abandon()
      })
      .on('error', () => {
        logger.info('on error')
        this.agent.post(TtsStatusChannel, [ StatusCode.error ])
        focus.abandon()
      })
      .on('end', () => {
        logger.info('on end')
        this.agent.post(TtsStatusChannel, [ StatusCode.end ])
        focus.abandon()
      })
    this.agent.declareMethod(GetStreamChannel, (req, res) => {
      logger.info('on get stream channel', utter.id)
      res.end(0, [utter.id])
    })
  }
  focus.onLoss = () => {
    speechSynthesis.cancel()
    this.agent.removeMethod(GetStreamChannel)
    this.finishVoice(focus)
  }
  focus.request()

  return focus
}
