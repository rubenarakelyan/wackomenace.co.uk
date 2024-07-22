import { Application } from "./stimulus-3.2.2.mjs";

import KonamiCodeController from "./controllers/konami_code_controller.mjs";

window.Stimulus = Application.start();
Stimulus.register("konami-code", KonamiCodeController);

function konamiCodeCallback(target) {
  target.classList.toggle("rotated");
}

Object.assign(window, { konamiCodeCallback })
