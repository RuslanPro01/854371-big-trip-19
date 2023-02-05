import AbstractView from '../framework/view/abstract-view.js';
import {getFormatDate} from '../utils/common-utils.js';

const createTemplateAboutTrip = (allPoints, destinations, offers) => {
  const pointsLength = allPoints.length;
  const getTripDates = (points) => ({
    begin: getFormatDate(points[0].dayFrom),
    end: getFormatDate(points[pointsLength - 1].dayFrom)
  });
  const datesTrip = getTripDates(allPoints);

  const getTotalPrice = () => {
    let sumBasePrice = 0;
    let sumOffers = 0;
    allPoints.forEach((point) => {
      sumBasePrice += point.basePrice;
      const pointTypeOffer = offers.find((offer) => offer.type === point.type);
      const checkedOffers = point.offers;

      pointTypeOffer.offers.forEach((offer) => {
        if (checkedOffers.some((checkedOffer) => checkedOffer === offer.id)) {
          sumOffers += offer.price;
        }
      });
    });

    return sumBasePrice + sumOffers;
  };

  const cities = {
    firstCity: destinations.find((destination) => destination.id === allPoints[0].destination).name,
    secondCity() {
      if (pointsLength > 1 && pointsLength <= 2) {
        return `&mdash; ${destinations.find((destination) => destination.id === allPoints[1].destination).name}`;
      }
      if (pointsLength > 2 && pointsLength <= 3) {
        return `&mdash; ${destinations.find((destination) => destination.id === allPoints[1].destination).name} &mdash;`;
      }
      return '&mdash; &hellip; &mdash;';
    },
    thirdCity: destinations.find((destination) => destination.id === allPoints[pointsLength - 1].destination).name
  };

  return `
  <section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${cities.firstCity} ${pointsLength >= 2 ? cities.secondCity() : ''} ${pointsLength >= 3 ? cities.thirdCity : ''}</h1>

      <p class="trip-info__dates">${datesTrip.begin}${pointsLength > 1 ? `&nbsp;&mdash;&nbsp; ${datesTrip.end}` : ''}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalPrice()}</span>
    </p>
  </section>
`;
};

export default class AboutTripView extends AbstractView {
  #points = null;
  #destinations = null;
  #offers = null;

  constructor({points, destinations, offers}) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTemplateAboutTrip(this.#points, this.#destinations, this.#offers);
  }
}
