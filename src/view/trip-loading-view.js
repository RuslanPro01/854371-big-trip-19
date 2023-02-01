import AbstractView from '../framework/view/abstract-view.js';

const createTripListEmpty = () => '<p class="trip-events__msg">Loading...</p>';

export default class TripLoadingView extends AbstractView {
  get template() {
    return createTripListEmpty();
  }
}
