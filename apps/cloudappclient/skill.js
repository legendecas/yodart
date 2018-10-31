var logger = require('logger')('cloudAppClient-skill')
var EventEmitter = require('events').EventEmitter
var inherits = require('util').inherits

function Skill (exe, nlp, action) {
  logger.log(action.appId + ' was create')
  EventEmitter.call(this)
  this.appId = action.appId
  this.form = action.response.action.form
  this.shouldEndSession = action.response.action.shouldEndSession
  this.directives = []
  this.paused = false
  this.isSkillActive = true
  // identify if there are still tasks currently executing. such as media playing
  this.task = 0
  // identify if this skill has a player
  this.hasPlayer = false
  this.exe = exe
  this.handleEvent()
  this.transform(action.response.action.directives || [])
}
inherits(Skill, EventEmitter)

Skill.prototype.onrequest = function (action, append) {
  var directives = action.response.action.directives || []
  if (directives === undefined || directives.length <= 0) {
    return
  }
  logger.log(`--> shouldEndSession: ${this.shouldEndSession}`)
  // exit self if shouldEndSession is true
  if (this.shouldEndSession) {
    return this.emit('exit')
  }
  this.shouldEndSession = action.response.action.shouldEndSession
  logger.log(`--> update shouldEndSession: ${this.shouldEndSession}`)
  logger.log(`skill ${this.appId} onrequest`)
  this.transform(directives || [], append)
  if (this.paused === false) {
    logger.log('onrequest nextTick', this.directives)
    /**
     * fixed: tts.say -> eventReq(media.play) -> media.stop
     *                                         /----nextTick----\
     * now the order of execution is : tts.say -> media.stop -> eventReq(media.play)
     */
    process.nextTick(() => {
      logger.log('onrequest nextTick start', this.directives)
      this.emit('start')
    })
  }
}

Skill.prototype.handleEvent = function () {
  this.on('start', () => {
    logger.log(this.appId + ' emit start', this.directives)
    this.paused = false
    // In order to identify how many tasks are currently running
    this.task++
    // should not resume when user manually pause or stop media
    var resume = true
    this.directives.forEach((value) => {
      // when dt have media, should not exe media resume
      if (value.type === 'media' && ['stop', 'pause', 'resume', 'play'].indexOf(value.action) > -1) {
        resume = false
      }
    })
    this.exe.execute(this.directives, 'frontend', () => {
      // A task is completed
      this.task--
      logger.info('execute end', this.appId, this.directives, this.paused)
      // If the skill is in the pause state, then nothing is done.
      if (this.paused === true) {
        return
      }
      if (this.shouldEndSession) {
        return this.emit('exit')
      }
      // If there are still tasks that are not completed, do nothind.
      if (this.task > 0) {
        // The media should resume after playing tts
        if (this.shouldEndSession === false && resume && this.isSkillActive) {
          logger.log('media need resume, exe media.resume')
          this.exe.execute([{
            type: 'media',
            action: 'resume',
            data: {}
          }], 'frontend')
        }
        return
      }
      // continue perform the remaining tasks, if any.
      if (this.directives.length > 0) {
        logger.log('continue run directives')
        return this.emit('start')
      }
      this.directives = []
      logger.log(`${this.appId} exit because exe complete`)
      // exit self. nothing to do
      this.emit('exit')
    })
  })
  this.on('pause', (isAppPause) => {
    logger.log(this.appId + ' emit pause')
    var dts = []
    // should cancel tts if app is paused
    if (isAppPause) {
      // stop tts first. because tts needs faster response speed.
      dts.push({
        type: 'tts',
        action: 'cancel',
        data: {}
      })
    }
    // need pause player if this skill has player
    if (this.hasPlayer) {
      dts.push({
        type: 'media',
        action: 'pause',
        data: {}
      })
    }
    // nothing to do if dts is empty
    if (dts.length > 0) {
      this.exe.execute(dts, 'frontend')
    }
    this.paused = true
  })
  this.on('resume', () => {
    logger.log(this.appId + ' emit resume')
    this.paused = false
    if (this.isSkillActive) {
      this.exe.execute([{
        type: 'media',
        action: 'resume',
        data: {}
      }], 'frontend')
      if (this.directives.length > 0) {
        // In order to identify how many tasks are currently running
        this.task++
        this.exe.execute(this.directives, 'frontend', () => {
          // A task is completed
          this.task--
          // If the skill is in the pause state, then nothing is done.
          if (this.paused === true) {
            return
          }
          if (this.shouldEndSession) {
            return this.emit('exit')
          }
          // If there are still tasks that are not completed, do nothind.
          if (this.task > 0) {
            return
          }
          // continue perform the remaining tasks, if any.
          if (this.directives.length > 0) {
            return this.emit('start')
          }
          this.directives = []
          // exit self. nothing to do
          this.emit('exit')
        })
      }
    } else {
      logger.info('user manually pause or stop media, should not resume')
    }
  })
  this.on('destroy', () => {
    logger.log(this.appId + ' emit destroy')
    var dts = [{
      type: 'tts',
      action: 'cancel',
      data: {}
    }]
    // need stop player if this skill has player
    if (this.hasPlayer) {
      dts.push({
        type: 'media',
        action: 'cancel',
        data: {}
      })
    }
    this.exe.execute(dts, 'frontend')
  })
}

Skill.prototype.transform = function (directives, append) {
  logger.log(`transform start: ${this.appId} append: ${append} ${directives}`)
  if (append !== true) {
    logger.log('cover directives')
    this.directives.splice(0, this.directives.length)
  }
  if (directives === undefined || directives.length <= 0) {
    logger.log('empty directives, nothong to do')
    return
  }
  var ttsActMap = {
    'PLAY': 'say',
    'STOP': 'cancel'
  }
  var mediaActMap = {
    'PAUSE': 'pause',
    'PLAY': 'play',
    'RESUME': 'resume',
    'STOP': 'stop'
  }
  directives.forEach((ele) => {
    var tdt = {}
    if (ele.type === 'voice') {
      tdt = {
        type: 'tts',
        action: ttsActMap[ele.action],
        data: ele
      }
      tdt.data.appId = this.appId
      this.directives.push(tdt)
    } else if (ele.type === 'media') {
      tdt = {
        type: 'media',
        action: mediaActMap[ele.action],
        data: ele
      }
      tdt.data.appId = this.appId
      this.directives.push(tdt)
      // identify if this skill has player
      if (ele.action === 'PLAY') {
        this.hasPlayer = true
      }
      // identify if this skill is active
      if (['STOP', 'PAUSE'].indexOf(ele.action) > -1) {
        logger.log('skill active set false')
        this.isSkillActive = false
      }
      if (['PLAY', 'RESUME'].indexOf(ele.action) > -1) {
        logger.log('skill active set true')
        this.isSkillActive = true
      }
    } else if (ele.type === 'confirm') {
      tdt = {
        type: 'confirm',
        action: '',
        data: ele
      }
      tdt.data.appId = this.appId
      this.directives.push(tdt)
    } else if (ele.type === 'pickup') {
      tdt = {
        type: 'pickup',
        action: '',
        data: ele
      }
      tdt.data.appId = this.appId
      this.directives.push(tdt)
    } else if (ele.type === 'native') {
      tdt = {
        type: 'native',
        action: '',
        data: ele
      }
      tdt.data.appId = this.appId
      this.directives.push(tdt)
    }
  })
}

module.exports = Skill
