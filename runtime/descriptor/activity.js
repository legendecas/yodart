'use strict'

/**
 * @namespace yodaRT.activity
 */

var Descriptor = require('../lib/descriptor')

/**
 * @memberof yodaRT.activity
 * @classdesc The `Activity` is the APIs for apps developer.
 * ```js
 * module.exports = api => {
 *   api.on('create', () => {
 *     console.log('app is created')
 *   })
 *   api.on('destroy', () => {
 *     console.log('app is destroyed')
 *   })
 * }
 * ```
 * @class Activity
 * @hideconstructor
 */
class ActivityDescriptor extends Descriptor {
  constructor (runtime) {
    super(runtime, 'activity')
  }

  exit (ctx) {
    var appId = ctx.appId
    return this.component.appScheduler.suspendApp(appId)
  }

  openUrl (ctx) {
    var url = ctx.args[0]
    var options = ctx.args[1]
    if (typeof options === 'string') {
      options = { form: options }
    }
    return this.runtime.openUrl(url, options)
  }
}

ActivityDescriptor.values = {
  /**
   * Get current `appId`.
   * @memberof yodaRT.activity.Activity
   * @instance
   * @member {string} appId - appId of current app.
   */
  appId: {},
  /**
   * Get home directory of current app.
   * @memberof yodaRT.activity.Activity
   * @instance
   * @member {string} appHome - home directory of current app.
   */
  appHome: {}
}

ActivityDescriptor.events = {
  /**
   * When an activity is created.
   * @event yodaRT.activity.Activity#created
   */
  created: {},
  /**
   * When an activity is about been destroyed.
   * @event yodaRT.activity.Activity#destroyed
   */
  destroyed: {},
  /**
   * Fires on url requests.
   *
   * > URL offer a potential attack vector into your app, so make
   * > sure to validate all URL parameters and discard any malformed
   * > URLs. In addition, limit the available actions to those that
   * > do not risk the user’s data. For example, do not allow other
   * > apps to directly delete content or access sensitive information
   * > about the user. When testing your URL-handling code, make sure
   * > your test cases include improperly formatted URLs.
   *
   * @event yodaRT.activity.Activity#url
   * @param {module:url~UrlWithParsedQuery} url
   */
  url: {}
}
ActivityDescriptor.methods = {
  /**
   * Exits the current application and marks the app could not handle subsequent
   * events until a fresh restart.
   * @memberof yodaRT.activity.Activity
   * @instance
   * @function exit
   * @returns {Promise<void>}
   */
  exit: {
    returns: 'promise'
  },
  /**
   * Use this method to open the specified resource. If the specified URL could
   * be handled by another app, YodaOS launches that app and passes the URL to it.
   * (Launching the app brings the other app to the foreground.) If no app is
   * capable of handling the specified scheme, the returning promise is resolved
   * with false.
   *
   * @memberof yodaRT.activity.Activity
   * @instance
   * @function openUrl
   * @param {string} url - the YodaOS url to open.
   * @returns {Promise<boolean>}
   */
  openUrl: {
    returns: 'promise'
  }
}

module.exports = ActivityDescriptor
