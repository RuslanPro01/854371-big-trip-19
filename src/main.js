import TripPresenter from './presentor/trip-presenter.js';
import PointModel from './model/point-model.js';

const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const pointsModel = new PointModel();

const tripPresenter = new TripPresenter({
  filtersContainer: tripControlsFiltersElement,
  tripEventsContainer: tripEventsElement,
  pointsModel
});
tripPresenter.init();
