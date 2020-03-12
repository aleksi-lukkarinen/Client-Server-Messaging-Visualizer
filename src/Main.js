/**
 * The main module.
 *
 * @module Main
 */

import * as Config from "./Config.js";
import Bootstrapper from "./Bootstrapper.js";



/*
 * After the document is ready, start the {@link Bootstrapper}
 * to initialize the visualizations.
 */
$(document).ready(function() {
  "use strict";

  const setupData = document[Config.SETUP_DATA_ROOT_KEY];
  const bs = new Bootstrapper(setupData);

  bs.execute();
});
