import FilterView from '../view/event-filter.js';
import {render, replace, remove} from '../utils/render.js';
import {UpdateType, RenderPosition, ModelType, FilterType} from '../const.js';
import {getFilterRule} from '../utils/trip.js';

export default class Filter {
  constructor(filterContainer, modelStore) {
    this._filterContainer = filterContainer;
    this._filterModel = modelStore.get(ModelType.FILTER);
    this._pointsModel = modelStore.get(ModelType.POINTS);
    this._currentFilter = null;

    this._filterComponent = null;

    this._modelEventHandler = this._modelEventHandler.bind(this);
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);

    this._filterModel.addObserver(this._modelEventHandler);
  }

  init() {
    const filters = this._getFilters();
    this._currentFilter = this._filterModel.getItem();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(this._currentFilter, filters);
    this._filterComponent.setFilterTypeChangeHandler(this._filterTypeChangeHandler);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFORE_END);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  destroy() {
    if (this._filterComponent === null) {
      return;
    }

    remove(this._filterComponent);
    this._filterComponent = null;
  }

  _modelEventHandler() {
    this.init();
  }

  _filterTypeChangeHandler(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setItem(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const points = this._pointsModel.getItems();

    const filters = {};

    Object
      .values(FilterType)
      .forEach((filterTitle) => {
        const isFilteredTasksExist = points.some(getFilterRule(filterTitle));
        filters[filterTitle] = isFilteredTasksExist;
        return;
      });

    return filters;
  }
}
