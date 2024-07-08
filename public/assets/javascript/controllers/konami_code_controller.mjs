import { Controller } from "https://unpkg.com/@hotwired/stimulus/dist/stimulus.js";

export default class extends Controller {
  initialize() {
    this.input = "";
    this.code = "38384040373937396665";
  }

  keydown(event) {
    this.input += ("" + event.keyCode);
    if (this.input === this.code) {
      return event.target.classList.toggle("rotated");
    }
    if (!this.code.indexOf(this.input)) return;
    this.input = ("" + event.keyCode);
  }
}
