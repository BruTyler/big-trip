import StatsView from '../view/stats.js';
import {render, remove} from '../utils/render.js';
import {RenderPosition, ModelType, TabNavItem} from '../const.js';

export default class Stats {
  constructor(statsContainer, modelStore) {
    this._statsContainer = statsContainer;
    this._pointsModel = modelStore.get(ModelType.POINTS);
    this._menuModel = modelStore.get(ModelType.MENU);

    this._statsComponent = null;

    this._menuEventHandler = this._menuEventHandler.bind(this);
  }

  init() {
    this._menuModel.addObserver(this._menuEventHandler);
  }

  _renderStats() {
    if (this._statsComponent) {
      return;
    }

    this._statsComponent = new StatsView(this._pointsModel.getItems());
    render(this._statsContainer, this._statsComponent, RenderPosition.BEFORE_END);
  }

  destroy() {
    if (this._statsComponent === null) {
      return;
    }

    remove(this._statsComponent);
    this._statsComponent = null;
  }

  _menuEventHandler(_event, menuItem) {
    switch (menuItem) {
      case TabNavItem.STATS:
        this._renderStats();
        break;
      default:
        this.destroy();
        break;
    }
  }
}
