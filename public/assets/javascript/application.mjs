import { Application, Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js";

import KonamiCodeController from "./controllers/konami_code_controller.mjs";

window.Stimulus = Application.start();
Stimulus.register("konami-code", KonamiCodeController);
