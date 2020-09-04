import AbstractView from '../abstract/simple-view.js';

const createFilterItemTemplate = (title, currentFilterType, isFilteredTaskExist) => {
  return (
    `<div class="trip-filters__filter">
        <input id="filter-${title}" type="radio" name="trip-filter"
          class="trip-filters__filter-input  visually-hidden"
          value="${title}"
          ${title === currentFilterType ? `checked` : ``}
          ${isFilteredTaskExist ? `` : `disabled`}
        >
        <label for="filter-${title}"
          class="trip-filters__filter-label  ${isFilteredTaskExist ? `` : `trip-filters__filter-label--empty`}" 
        >
          ${title}
        </label>
      </div>`
  );
};

const createEventFilterTemplate = (currentFilterType, filters) => {
  const filterItemsTemplate = Object
    .entries(filters)
    .map(([filterTitle, isFilteredTaskExist]) => createFilterItemTemplate(filterTitle, currentFilterType, isFilteredTaskExist))
    .join(``);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class EventFilter extends AbstractView {
  constructor(currentFilterType, filters) {
    super();

    this._currentFilter = currentFilterType;
    this._filters = filters;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createEventFilterTemplate(this._currentFilter, this._filters);
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
