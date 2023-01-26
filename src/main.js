import PointsListPresenter from './presentor/points-list-presenter.js';
import PointModel from './model/point-model.js';

const tripMainContainer = document.querySelector('.trip-main');
const tripControlsFiltersElement = tripMainContainer.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const pointsModel = new PointModel();

const tripPresenter = new PointsListPresenter({
  tripMainContainer: tripMainContainer,
  filtersContainer: tripControlsFiltersElement,
  tripEventsContainer: tripEventsElement,
  pointsModel
});
tripPresenter.init();
