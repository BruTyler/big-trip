import AbstractView from './abstract.js';
import {capitilizeFirstLetter} from '../utils/common.js';
import {SortType, DefaultValues} from '../const.js';

const createEventSorterTemplate = (selectedSortType) => {
  const sortItemsTemplate = Object
    .values(SortType)
    .map((sortItem) =>
      `<div class="trip-sort__item  trip-sort__item--${sortItem}">
        <input id="sort-${sortItem}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortItem}" ${selectedSortType === sortItem ? `checked` : ``}>
        <label class="trip-sort__btn" for="sort-${sortItem}">${capitilizeFirstLetter(sortItem)}</label>
      </div>`)
    .join(`\n`);

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${sortItemsTemplate}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class EventSorter extends AbstractView {
  constructor(selectedSortType = DefaultValues.SORT_TYPE) {
    super();

    this._selectedSortType = selectedSortType;
  }

  getTemplate() {
    return createEventSorterTemplate(this._selectedSortType);
  }
}
