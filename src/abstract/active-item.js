export const mixActiveItem = (superclass = Object) => class extends superclass {
  constructor() {
    super();
    this._activeItem = null;
  }

  setItem(updateType, item) {
    this._activeItem = item;
    if (this._notify) {
      this._notify(updateType, item);
    }
  }

  getItem() {
    return this._activeItem;
  }
};

export default mixActiveItem(Object);
