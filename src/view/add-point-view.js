import {getFormatDate} from '../utils/common-utils.js';
import {
  BLANK_POINT,
  DateFormat
} from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';

function createEditPointTemplate(point, destinations, allOffers) {
  const {basePrice, dayFrom, dayTo, type, offers} = point;
  const pointTypeOffer = allOffers.find((offer) => offer.type === type);
  const pointDestination = destinations.find((destination) => destination.id === point.destination[0]) ? destinations.find((destination) => destination.id === point.destination[0]) : {};
  const {description = '', name = '', pictures = ''} = pointDestination;

  let offerTypes = Object.values(allOffers).map((offer) => offer.type);
  let offersByType = pointTypeOffer ? [...pointTypeOffer.offers] : '';
  let cities = Object.values(destinations).map((destination) => destination.name);
  let picturesPoint = [...pictures];

  if (!offersByType) {
    offersByType = '';
  } else {
    offersByType = offersByType.map((offer) => {
      const checkedClass = offers.includes(offer.id) ? 'checked' : '';
      return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${offer.id}" type="checkbox" name="event-offer-${type}" ${checkedClass}>
      <label class="event__offer-label" for="event-offer-${type}-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
    }).join('');
  }

  offerTypes = offerTypes.map((typeOffer) => {
    let capitalizeTypeOffer = typeOffer.split('');
    capitalizeTypeOffer.splice(0, 1, typeOffer[0].toUpperCase());
    capitalizeTypeOffer = capitalizeTypeOffer.join('');
    return (`
      <div class="event__type-item">
        <input id="event-type-${typeOffer}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeOffer}" ${typeOffer === type ? 'checked' : ''} data-type-offer="${typeOffer}">
        <label class="event__type-label  event__type-label--${typeOffer}" for="event-type-${typeOffer}-1">${capitalizeTypeOffer}</label>
      </div>
`);
  }).join('');

  cities = cities.map((city) => (`
  <option value="${city}" ${city === name ? 'selected' : ''}></option>
  `)).join('');

  picturesPoint = picturesPoint.map((picture) => (`
    <img class="event__photo" src="${picture.src}" alt="${picture.description}">
    `)).join('');

  return (`
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${offerTypes}

              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <datalist id="destination-list-1">
              ${cities}
            </datalist>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1" data-base-value="${name}">
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getFormatDate(dayFrom, DateFormat.INTERNATIONAL_WITH_TIME)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getFormatDate(dayTo, DateFormat.INTERNATIONAL_WITH_TIME)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
        </header>
        <section class="event__details">
          <section class="event__section  event__section--offers" ${!offersByType ? 'style="display: none"' : ''}>
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${offersByType}
            </div>
          </section>

          <section class="event__section  event__section--destination" ${!description ? 'style="display: none"' : ''}>
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            <div class="event__photos-container" ${!picturesPoint ? 'style="display: none"' : ''}>
              <div class="event__photos-tape">
                ${picturesPoint}
              </div>
            </div>
          </section>
        </section>
      </form>
    </li>
`);
}

export default class AddPointView extends AbstractStatefulView {
  #point = null;
  #destinations = null;
  #offers = null;
  #handleClick = null;
  #onCancelButtonClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({point = BLANK_POINT, destinations, offers, cancelButtonHandler}) {
    super();
    this._setState(AddPointView.parsePointToState(point));
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onCancelButtonClick = cancelButtonHandler;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#destinations, this.#offers);
  }

  static parsePointToState(point) {
    return {...point};
  }

  static parseStateToPoint(state) {
    return {...state};
  }

  #onEditPointComponentSubmit = (evt) => {
    evt.preventDefault();
    this.#handleClick(AddPointView.parseStateToPoint(this._state));
  };

  #onEventTypeWrapperClick = (evt) => {
    const selectorType = evt.target.dataset.typeOffer;
    if (selectorType) {
      this.updateElement({
        type: selectorType,
        offers: []
      });
    }
  };

  #onEventInputDestinationChange = (evt) => {
    const inputValue = evt.target.value;
    const submitFormButton = this.element.querySelector('.event__save-btn');
    if (evt.target.dataset.baseValue === inputValue) {
      submitFormButton.disabled = false;
      return;
    }
    const cities = Object.values(this.#destinations).map((destination) => destination.name);
    if (cities.some((cityName) => cityName === inputValue)) {
      this.updateElement({
        destination: [cities.indexOf(inputValue) + 1]
      });
    } else {
      submitFormButton.disabled = true;
    }

  };

  #onInputDateFromChange = ([userDate]) => {
    this.updateElement({
      dayFrom: userDate,
    });
  };

  #onInputDateToChange = ([userDate]) => {
    this.updateElement({
      dayTo: userDate,
    });
  };

  #setDatePicker() {
    this.#datepickerFrom = flatpickr(this.element.querySelector('.event__input--time[name=event-start-time]'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dayFrom,
        maxDate: this._state.dayTo,
        onChange: this.#onInputDateFromChange,
        // eslint-disable-next-line camelcase
        time_24hr: true
      },
    );

    this.#datepickerTo = flatpickr(this.element.querySelector('.event__input--time[name=event-end-time]'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dayTo,
        minDate: this._state.dayFrom,
        onChange: this.#onInputDateToChange,
        // eslint-disable-next-line camelcase
        time_24hr: true
      },
    );
  }

  #onEventInputPriceChange = (evt) => {
    evt.preventDefault();
    const priceValue = evt.target.value;
    this._setState({
      basePrice: priceValue
    });
  };

  reset(point) {
    this.updateElement(
      AddPointView.parsePointToState(point),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event--edit').addEventListener('submit', this.#onEditPointComponentSubmit);
    this.element.querySelector('.event__type-wrapper').addEventListener('click', this.#onEventTypeWrapperClick);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#onEventInputDestinationChange);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#onEventInputPriceChange);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onCancelButtonClick);

    this.#setDatePicker();
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }
}
