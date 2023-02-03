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
  dateSortDown,
  sortPriceDown,
  sortTimeDown
} from '../utils/utils-point-view.js';
import {filter} from '../utils/utils-filter.js';
import NewPointPresenter from './new-point-presenter.js';
import TripLoadingView from '../view/trip-loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class PointsListPresenter {
  #tripMainContainer = null;
  #tripEventsContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #tripSortView = null;
  #tripListView = new TripListView();
  #tripListEmptyView = null;
  #tripLoadingView = new TripLoadingView();
  #pointPresenter = null;
  #pointPresenters = new Map();

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #newPointPresenter = null;
  #isLoading = true;
  #isCreatePoint = false;

  #UiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({tripMainContainer, tripEventsContainer, pointsModel, filterModel, onNewPointDestroy}) {
    this.#tripMainContainer = tripMainContainer;
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#newPointPresenter = new NewPointPresenter({
      tripEventsContainer: this.#tripListView.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy,
      pointsModel: this.#pointsModel
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  createPoint() {
    this.#isCreatePoint = true;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
    this.#removeSort();
    this.#renderSort();
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    if (!points) {
      this.#filterType = 'ERROR';
      return points;
    }
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return [...filteredPoints].sort(sortPriceDown);
      case SortType.DURATION:
        return [...filteredPoints].sort(sortTimeDown);
    }

    return filteredPoints.sort(dateSortDown);
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
    if (this.#isLoading) {
      this.#renderLoadingView();
      return;
    }
    if (!this.#tripSortView) {
      this.#renderSort();
    }
    render(this.#tripListView, this.#tripEventsContainer);
    this.renderListEmpty();
  }

  #renderPoints() {
    this.points.forEach((point) => {
      this.#pointPresenter = new PointPresenter({
        offer: this.offers,
        destinations: this.destinations,
        tripListView: this.#tripListView,
        onDataChange: this.#handleViewAction,
        onModeChange: this.#handleModChange
      });
      this.#pointPresenter.init(point);
      this.#pointPresenters.set(point.id, this.#pointPresenter);
    });
  }

  renderListEmpty() {
    if (this.#isCreatePoint) {
      return;
    }
    if (this.points === null || this.points.length === 0) {
      this.#tripListEmptyView = new TripListEmptyView({
        filterType: this.#filterType
      });

      render(this.#tripListEmptyView, this.#tripEventsContainer);
    } else if (this.#tripListEmptyView !== null) {
      remove(this.#tripListEmptyView);
    }
  }

  disablePointCreationFlag() {
    this.#isCreatePoint = false;
  }

  #renderLoadingView() {
    render(this.#tripLoadingView, this.#tripEventsContainer);
  }

  #handleModChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#UiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (error) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (error) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (error) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#UiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#tripLoadingView);
        this.#renderSpaceTrip();
        break;
    }
  };

  #clearSpaceTrip({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#tripLoadingView);

    remove(this.#tripListEmptyView);

    if (resetSortType) {
      this.#removeSort();
      this.#renderSort();
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderSpaceTrip() {
    this.#installEnvironmentTemplate();
    if (!this.points) {
      return;
    }
    this.#renderPoints();
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

  #removeSort() {
    this.#currentSortType = SortType.DEFAULT;
    remove(this.#tripSortView);
  }

  #clearPointsList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}
