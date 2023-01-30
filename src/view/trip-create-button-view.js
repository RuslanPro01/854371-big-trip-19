import AbstractView from '../framework/view/abstract-view.js';

const createTemplateButton = () => (`
  <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
`);

export default class TripCreateButtonView extends AbstractView {
  #createButtonHandler = null;
  constructor({onCreateButtonClick}) {
    super();
    this.#createButtonHandler = onCreateButtonClick;
    this.element.addEventListener('click', this.#createButtonHandler);
  }

  get template() {
    return createTemplateButton();
  }
}
