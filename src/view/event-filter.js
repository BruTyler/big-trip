import AbstractView from '../abstract/simple-view.js';
import {FilterType} from '../const.js';

const createFilterItemTemplate = (title, currentFilterType) => {
  return (
    `<div class="trip-filters__filter">
        <input id="filter-${title}" type="radio" name="trip-filter"
          class="trip-filters__filter-input  visually-hidden"
          value="${title}"
          ${title === currentFilterType ? `checked` : ``}
        >
        <label class="trip-filters__filter-label" for="filter-${title}">
          ${title.toUpperCase()}
        </label>
      </div>`
  );
};

const createEventFilterTemplate = (currentFilterType) => {
  const filterItemsTemplate = Object
    .values(FilterType)
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join(``);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class EventFilter extends AbstractView {
  constructor(currentFilterType) {
    super();

    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createEventFilterTemplate(this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
