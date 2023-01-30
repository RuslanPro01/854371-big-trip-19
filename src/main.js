import PointsListPresenter from './presentor/points-list-presenter.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presentor/filter-presenter.js';
import TripCreateButtonView from './view/trip-create-button-view.js';
import {render} from './framework/render.js';

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
  pointsModel: pointsModel,
  filterModel: filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const newTripCreateButtonView = new TripCreateButtonView({
  onCreateButtonClick: handleNewPointButtonClick.bind(this)
});

function handleNewPointButtonClick(evt) {
  evt.preventDefault();
  tripPresenter.createPoint();
  newTripCreateButtonView.element.disabled = true;
}

function handleNewPointFormClose() {
  newTripCreateButtonView.element.disabled = false;
}

render(newTripCreateButtonView, tripMainContainer);

filterPresenter.init();
tripPresenter.init();
