import {createElement} from '../render.js';

const createTripListEmpty = () => (`
  <p class="trip-events__msg">Click New Event to create your first point</p>
  `);

export default class TripListEmptyView {
  #element = null;

  get template() {
    return createTripListEmpty();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  remove() {
    this.#element = null;
  }
}
