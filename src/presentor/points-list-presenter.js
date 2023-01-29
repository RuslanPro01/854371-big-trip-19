import {
  remove,
  render,
  RenderPosition
} from '../framework/render.js';
import TripSortView from '../view/trip-sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripListEmptyView from '../view/trip-list-empty-view.js';
import PointPresenter from './point-presenter.js';
import {
  FilterType,
  SortType,
  UpdateType,
  UserAction
} from '../const.js';
import {
  sortPriceDown,
  sortTimeDown
} from '../utils/utils-point-view.js';
import {filter} from '../utils/utils-filter.js';
import NewPointPresenter from './new-point-presenter.js';

export default class PointsListPresenter {
  #tripMainContainer = null;
  #tripEventsContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #tripSortView = null;
  #tripListView = new TripListView();
  #tripListEmptyView = null;
  #pointPresenter = null;
  #pointPresenters = new Map();

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #newPointPresenter = null;

  constructor({tripMainContainer, tripEventsContainer, pointsModel, filterModel, onNewPointDestroy}) {
    this.#tripMainContainer = tripMainContainer;
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#newPointPresenter = new NewPointPresenter({
      tripEventsContainer: this.#tripListView.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  createPoint() {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortPriceDown);
      case SortType.DURATION:
        return filteredPoints.sort(sortTimeDown);
    }

    return filteredPoints;
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init() {
    this.#installEnvironmentTemplate();
  }

  #installEnvironmentTemplate() {
    this.#renderSort();
    render(this.#tripListView, this.#tripEventsContainer);
    this.#renderPoints();
  }

  #renderPoints() {
    for (let i = 0; i < this.points.length; i++) {
      this.#pointPresenter = new PointPresenter({
        offer: this.offers,
        destinations: this.destinations,
        tripListView: this.#tripListView,
        onDataChange: this.#handleViewAction,
        onModeChange: this.#handleModChange
      });
      this.#pointPresenter.init(this.points[i]);
      this.#pointPresenters.set(this.points[i].id, this.#pointPresenter);
    }
  }

  #renderListEmpty() {
    this.#tripListEmptyView = new TripListEmptyView({
      filterType: this.#filterType
    });

    render(this.#tripListEmptyView, this.#tripEventsContainer);
  }

  #handleModChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, update) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(update.id).init(update);
        break;
      case UpdateType.MINOR:
        this.#clearSpaceTrip();
        this.#renderSpaceTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearSpaceTrip({resetSortType: true});
        this.#renderSpaceTrip();
        break;
    }
  };

  #clearSpaceTrip({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    if (this.#tripListEmptyView) {
      remove(this.#tripListEmptyView);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderSpaceTrip() {
    this.#renderPoints();
    if (this.points.length === 0) {
      this.#renderListEmpty();
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointsList();
    this.#renderPoints();
  };

  #renderSort() {
    this.#tripSortView = new TripSortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#tripSortView, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}
