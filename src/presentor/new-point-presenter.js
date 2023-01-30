import AddPointView from '../view/add-point-view.js';
import {
  BLANK_POINT,
  UpdateType,
  UserAction
} from '../const.js';
import {destinations} from '../mock/destinations.js';
import {offers} from '../mock/offer.js';
import {
  remove,
  render,
  RenderPosition
} from '../framework/render.js';
import {getNewId} from '../utils/utils-mock.js';

export default class NewPointPresenter {
  #tripListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #addPointView = null;

  constructor({tripEventsContainer, onDataChange, onDestroy}) {
    this.#tripListContainer = tripEventsContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#addPointView !== null) {
      return;
    }

    this.#addPointView = new AddPointView({
      point: BLANK_POINT,
      destinations,
      offers,
      cancelButtonHandler: this.#handleDeleteClick,
      formSubmitHandler: this.#handleFormSubmit
    });

    render(this.#addPointView, this.#tripListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#addPointView === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#addPointView);
    this.#addPointView = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: getNewId(), ...point},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}

