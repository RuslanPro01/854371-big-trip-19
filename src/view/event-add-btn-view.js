import {createElement} from '../render.js';

function createEventAddBtnView() {
  return (
    '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>'
  );
}

export default class EventAddBtnView {
  getTemplate() {
    return createEventAddBtnView();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
