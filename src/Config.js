/**
 * Constants for internal configuration.
 *
 * @module Config
 */


/** Constants related to the application as a whole. */
export const application = {
  NAME:                           "Client-Server Messaging Visualizer",
}




/** Constants representing CSS classes used by the application. */
export const cssClasses = {
  CSMV_VISUALIZATION:             "csmv-visualization",
  CSMV_OUTER_FRAME:               "csmv-outer-frame",
  CSMV_VIS_TITLE:                 "csmv-visualization-title",
  CSMV_VIS_DESCRIPTION:           "csmv-visualization-description",
  CSMV_ANIMATION_FRAME:           "csmv-animation-frame",
  CSMV_CONTROL_FRAME:             "csmv-control-frame",
  CSMV_BUTTON:                    "csmv-button",
  CSMV_BUTTON_TO_FIRST_STEP:      "csmv-button-first-step",
  CSMV_BUTTON_TO_PREVIOUS_STEP:   "csmv-button-previous-step",
  CSMV_BUTTON_TO_NEXT_STEP:       "csmv-button-next-step",
  CSMV_BUTTON_TO_LAST_STEP:       "csmv-button-last-step",
  CSMV_ENABLED:                   "csmv-enabled",
  CSMV_DISABLED:                  "csmv-disabled",
}




/** Constants representing CSS properties used by the application. */
export const cssProperties = {
  WIDTH:                          "width",
  HEIGHT:                         "height",
}




/** Constants representing event names used by the application. */
export const eventNames = {
  INITIALIZATION_BEGINS:          "CSMesVis-initialization-begins",
  INITIALIZATION_FINISHED:        "CSMesVis-initialization-finished",
  TO_FIRST_STEP_CLICKED:          "CSMesVis-to-first-step-button-clicked",
  TO_PREVIOUS_STEP_CLICKED:       "CSMesVis-to-previous-step-button-clicked",
  TO_NEXT_STEP_CLICKED:           "CSMesVis-to-next-step-button-clicked",
  TO_LAST_STEP_CLICKED:           "CSMesVis-to-last-step-button-clicked",
  MODEL_CHANGED:                  "CSMesVis-model-changed",
}

// Create a convenience constant that contains all event names.
let allEvents = "";
for (let n in eventNames) {
  if (eventNames.hasOwnProperty(n)) {
    allEvents = allEvents + " " + eventNames[n];
  }
}
eventNames.ALL_EVENTS = allEvents.substring(0, allEvents.length);




/** Constants representing HTML attributes used by the application. */
export const htmlAttributes = {
  VISUALIZATION_NAME:             "cmsv-name",
  CLASS:                          "class",
  DISABLED:                       "disabled",
}




/** Constants representing HTML tags used by the application. */
export const htmlTags = {
  TAG_START:                      "<",
  SINGLE_TAG_END:                 "/>",
  DIV:                            "div",
  BUTTON:                         "button",
}




/** Constants representing the strings that identify log events. */
export const loggingKeys = {
  METADATA:                       "Metadata",
  INITIALIZATION_BEGINS:          "Initialization begins",
  INITIALIZATION_FINISHED:        "Initialization finished",
  TO_FIRST_STEP_CLICKED:          "'First' button clicked",
  TO_PREVIOUS_STEP_CLICKED:       "'Previous' button clicked",
  TO_NEXT_STEP_CLICKED:           "'Next' button clicked",
  TO_LAST_STEP_CLICKED:           "'Last' button clicked",
}




/**
 * Constant representing the name of the document object property
 * that must contain the setup data array for the visualizations.
 */
export const SETUP_DATA_ROOT_KEY = "CSMesVisSetupData";

/**
 * Constants representing keys used in the setup data array
 * for the visualizations.
 */
export const setupDataKeys = {
  VIS_NAME:                       "name",
  VIS_TITLE:                      "title",
  VIS_DESCRIPTION:                "description",
  VIS_ENV:                        "environment",
  VIS_ANIMATION_FRAME:            "animationFrame",
  WIDTH:                          "width",
  HEIGHT:                         "height",
  BUTTONS:                        "buttons",
  TO_FIRST_STEP_TITLE:            "toFirstStepTitle",
  TO_PREVIOUS_STEP_TITLE:         "toPreviousStepTitle",
  TO_NEXT_STEP_TITLE:             "toNextStepTitle",
  TO_LAST_STEP_TITLE:             "toLastStepTitle",
  VIS_ACTORS:                     "actors",
}




/**
 * Constants representing texts visible in
 * the user interface of the application.
 */
export const uiTexts = {
  TO_FIRST_STEP_TITLE:            "First Step",
  TO_PREVIOUS_STEP_TITLE:         "Previous Step",
  TO_NEXT_STEP_TITLE:             "Next Step",
  TO_LAST_STEP_TITLE:             "Last Step",
}
