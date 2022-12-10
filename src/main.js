import TripPresenter from './presentor/trip-presenter.js';

const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const tripPresenter = new TripPresenter({
  filtersContainer: tripControlsFiltersElement,
  tripEventsContainer: tripEventsElement
});
tripPresenter.init();
