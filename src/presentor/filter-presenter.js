import {
  FilterType,
  UpdateType
} from '../const.js';
import {filter} from '../utils/utils-filter.js';
import TripFiltersView from '../view/trip-filters-view.js';
import {
  remove,
  render,
  replace
} from '../framework/render.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointModel = null;

  #filterComponent = null;

  constructor({filterContainer, filterModel, pointModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointModel = pointModel;

    this.#pointModel.addObserver(this.#handleFilterModel);
    this.#filterModel.addObserver(this.#handleFilterModel);
  }

  get filters() {
    const points = this.#pointModel.points;

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything',
        count: points ? filter[FilterType.EVERYTHING](points).length : ''
      },
      {
        type: FilterType.FUTURE,
        name: 'Future',
        count: points ? filter[FilterType.FUTURE](points).length : ''
      },
      {
        type: FilterType.PRESENT,
        name: 'Present',
        count: points ? filter[FilterType.PRESENT](points).length : ''
      },
      {
        type: FilterType.PAST,
        name: 'Past',
        count: points ? filter[FilterType.PAST](points).length : ''
      },
    ];
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new TripFiltersView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleFilterModel = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
