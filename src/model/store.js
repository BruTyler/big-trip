import {ModelType} from '../const';

export default class Store {
  constructor() {
    this._store = new Map();
  }

  set(model) {
    const modelName = model.constructor.name;

    if (!Object.values(ModelType).includes(modelName)) {
      throw new Error(`Unknown model name`);
    }

    return this._store.set(modelName, model);
  }

  get(modelName) {
    return this._store.get(modelName);
  }

  delete(modelName) {
    return this._store.delete(modelName);
  }

  has(modelName) {
    return this._store.has(modelName);
  }
}
