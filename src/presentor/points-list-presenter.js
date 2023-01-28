import {
  remove,
  render,
  RenderPosition
} from '../framework/render.js';
import TripFiltersView from '../view/trip-filters-view.js';
import TripSortView from '../view/trip-sort-view.js';
import TripListView from '../view/trip-list-view.js';
import TripListEmptyView from '../view/trip-list-empty-view.js';
import PointPresenter from './point-presenter.js';
import {
  BLANK_POINT,
  Mode,
  NUMBER_POINTS_CREATED,
  SortType,
  UpdateType,
  UserAction
} from '../const.js';
import {
  sortPriceDown,
  sortTimeDown
} from '../utils/utils-point-view.js';
import TripCreateButtonView from '../view/trip-create-button-view.js';
import {destinations} from '../mock/destinations.js';
import {offers} from '../mock/offer.js';
import AddPointView from '../view/add-point-view.js';

export default class PointsListPresenter {
  #tripMainContainer = null;
  #filtersContainer = null;
  #tripEventsContainer = null;
  #pointsModel = null;
  #tripFiltersView = null;

  #tripSortView = null;
  #tripListView = new TripListView();
  #tripListEmptyView = new TripListEmptyView();
  #pointPresenter = null;
  #pointPresenters = new Map();

  #currentSortType = SortType.DEFAULT;
  #newPointComponent = null;
  #newPointComponentState = Mode.DEFAULT;

  // TripCreateButtonView => PointsListPresenter => handler (44) => createNewEditView => renderNewEditView
  constructor({tripMainContainer, filtersContainer, tripEventsContainer, pointsModel}) {
    this.#tripMainContainer = tripMainContainer;
    this.#filtersContainer = filtersContainer;
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortPriceDown);
      case SortType.DURATION:
        return [...this.#pointsModel.points].sort(sortTimeDown);
    }

    return this.#pointsModel.points;
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
    if (this.points) {
      this.#tripFiltersView = new TripFiltersView({points: this.points});

      render(this.#tripFiltersView, this.#filtersContainer);
      render(this.#tripCreateButtonView, this.#tripMainContainer);
      this.#renderSort();
      render(this.#tripListView, this.#tripEventsContainer);
      this.#renderPoints();
    } else {
      render(this.#tripListEmptyView, this.#tripEventsContainer);
    }
  }

  #renderPoints() {
    for (let i = 0; i < NUMBER_POINTS_CREATED; i++) {
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

  #removeAddPointView = () => {
    remove(this.#newPointComponent);
    this.#newPointComponentState = Mode.DEFAULT;
    this.#tripCreateButtonView.element.disabled = false;
  };

  #handleModChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    if (this.#newPointComponentState === Mode.EDITING) {
      this.#removeAddPointView();
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch(actionType) {
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
    switch(updateType) {
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
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#tripListEmptyView);
    remove(this.#tripFiltersView);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderSpaceTrip() {
    this.#tripFiltersView = new TripFiltersView({points: this.points});
    render(this.#tripFiltersView, this.#filtersContainer);
    this.#renderPoints();
  }

  #handlerEventAddButton = (evt) => {
    evt.target.disabled = true;
    this.#newPointComponent = new AddPointView({
      point: BLANK_POINT,
      destinations: destinations,
      offers: offers,
      cancelButtonHandler: this.#removeAddPointView
    });
    render(this.#newPointComponent, this.#tripListView.element, RenderPosition.AFTERBEGIN);
    this.#handleModChange();
    this.#newPointComponentState = Mode.EDITING;
  };

  #tripCreateButtonView = new TripCreateButtonView(this.#handlerEventAddButton);

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
