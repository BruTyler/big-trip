import SmartView from '../abstract/smart-view.js';
import {capitilizeFirstLetter} from '../utils/common.js';
import {SortType} from '../const.js';

const createEventSorterTemplate = (selectedSortType) => {
  const dayLabel = selectedSortType === SortType.EVENT ? `Day` : ``;
  const sortItemsTemplate = Object
    .values(SortType)
    .map((sortItem) =>
      `<div class="trip-sort__item  trip-sort__item--${sortItem}">
        <input type="radio" name="trip-sort" class="trip-sort__input  visually-hidden" 
          id="sort-${sortItem}" 
          value="${sortItem}" 
          ${selectedSortType === sortItem ? `checked` : ``}
        >
        <label class="trip-sort__btn" for="sort-${sortItem}">
          ${capitilizeFirstLetter(sortItem)}
        </label>
      </div>`)
    .join(`\n`);

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">${dayLabel}</span>
      ${sortItemsTemplate}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class EventSorter extends SmartView {
  constructor(initSortType) {
    super();

    this._currentSortType = initSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createEventSorterTemplate(this._currentSortType);
  }

  restoreHandlers() {
    this.setSortTypeChangeHandler(this._callback.sortTypeChange);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    this._currentSortType = evt.target.value;
    this.updateElement();
    this._callback.sortTypeChange(this._currentSortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }
}
