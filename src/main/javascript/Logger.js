/**
 * Logger class module.
 *
 * @module Logger
 */

import * as Config from "./Config.js";
import * as EnvInfo from "./EnvironmentInfo.js";




const TWO_ARGUMENTS = 2;




/** To be used for creating a log of user's actions. */
export default class Logger {

  constructor(visualizationName) {
    this.log = [];

    this.add(Config.loggingKeys.METADATA, {
      webPage: {
        location: {
          url:            EnvInfo.documentURL,
/* eslint multiline-comment-style: "off", capitalized-comments: "off" */
/*
          protocol:       EnvInfo.locationProtocol,
          host:           EnvInfo.locationHost,
          hostname:       EnvInfo.locationHostname,
          port:           EnvInfo.locationPort,
          pathname:       EnvInfo.locationPathname,
          hash:           EnvInfo.locationHash,
          query:          EnvInfo.locationQuery,
*/
        },
        referrer:         EnvInfo.documentReferrer,
        title:            EnvInfo.documentTitle,
        charSet:          EnvInfo.documentCharacterSet,
      },
      navigator: {
        userAgent:        EnvInfo.userAgent,
        platform:         EnvInfo.platform,
        appName:          EnvInfo.appName,
        appVersion:       EnvInfo.appVersion,
        product:          EnvInfo.product,
      },
      screen: {
        totalHeight:      EnvInfo.totalScreenHeight,
        totalWidth:       EnvInfo.totalScreenWidth,
        colorDepth:       EnvInfo.colorDepth,
      },
      visualization: {
        name:             visualizationName,
      },
    });
  }

  addModelInitializationBeginsEvent() {
    this.add(Config.loggingKeys.MODEL_INITIALIZATION_BEGINS);
  }

  addModelInitializationFinishedEvent() {
    this.add(Config.loggingKeys.MODEL_INITIALIZATION_FINISHED);
  }

  addUIInitializationBeginsEvent() {
    this.add(Config.loggingKeys.UI_INITIALIZATION_BEGINS);
  }

  addUIInitializationFinishedEvent() {
    this.add(Config.loggingKeys.UI_INITIALIZATION_FINISHED);
  }

  addToFirstClickedEvent() {
    this.add(Config.loggingKeys.TO_FIRST_STEP_CLICKED);
  }

  addToPreviousClickedEvent() {
    this.add(Config.loggingKeys.TO_PREVIOUS_STEP_CLICKED);
  }

  addToNextClickedEvent() {
    this.add(Config.loggingKeys.TO_NEXT_STEP_CLICKED);
  }

  addToLastClickedEvent() {
    this.add(Config.loggingKeys.TO_LAST_STEP_CLICKED);
  }

  add(type, data) {
    const timestamp = Date.now();
    const timezoneOffset = new Date(timestamp).getTimezoneOffset();
    const logEntry = [timestamp, timezoneOffset, type];

    if (arguments.length === TWO_ARGUMENTS) {
      if ($.isArray(data)) {
        for (const item of data) {
          logEntry.push(item);
        }
      }
      else {
        logEntry.push(data);
      }
    }

    this.log.push(logEntry);
  }

  get() {
    return this.log;
  }

}
