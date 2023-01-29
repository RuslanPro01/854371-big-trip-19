import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter, currentFilterType) {
  const {type, name, count} = filter;
  return(`
    <div class="trip-filters__filter">
      <input id="filter-everything"
      class="trip-filters__filter-input visually-hidden"
      type="radio"
      name="trip-filter"
      value="${type}"
      ${count ? '' : 'disabled'}
      ${type === currentFilterType ? 'checked' : ''}>
      <label class="trip-filters__filter-label"
      for="filter-everything">${name} ${count ? count : ''}</label>
    </div>
  `);
}

function createTripControlsFiltersTemplate(filters, currentFilterType) {

  const createFiltersTemplate = filters
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${createFiltersTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class TripFiltersView extends AbstractView {
  #filters = null;
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor({filters, currentFilterType, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#onFilterTypeChange);
  }

  get template() {
    return createTripControlsFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  #onFilterTypeChange = (evt) => {
    this.#handleFilterTypeChange(evt.target.value);
  };
}
