import AbstractView from '../framework/view/abstract-view.js';

const createTemplateButton = () => (`
  <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
`);

export default class TripCreateButtonView extends AbstractView {
  constructor(onCreateButtonClick) {
    super();
    this.element.addEventListener('click', onCreateButtonClick);
  }

  get template() {
    return createTemplateButton();
  }
}
