import PointsListPresenter from './presentor/points-list-presenter.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presentor/filter-presenter.js';

const tripMainContainer = document.querySelector('.trip-main');
const tripControlsFiltersElement = tripMainContainer.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const pointsModel = new PointModel();
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filterContainer: tripControlsFiltersElement,
  filterModel: filterModel,
  pointModel: pointsModel
});

const tripPresenter = new PointsListPresenter({
  tripMainContainer: tripMainContainer,
  tripEventsContainer: tripEventsElement,
  pointsModel
});

filterPresenter.init();
tripPresenter.init();
