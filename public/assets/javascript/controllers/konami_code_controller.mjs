import { Controller } from "../stimulus-3.2.2.mjs";

export default class extends Controller {
  static values = {
    callback: String,
  };

  initialize() {
    this.input = "";
    this.code = "38384040373937396665";
  }

  keydown(event) {
    this.input += "" + event.keyCode;
    if (this.input === this.code) {
      return window[this.callbackValue](event.target);
    }
    if (!this.code.indexOf(this.input)) return;
    this.input = "" + event.keyCode;
  }
}
