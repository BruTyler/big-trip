export const mixSimpleCollection = (superclass = Object) => class extends superclass {
  constructor() {
    super();
    this._items = [];
  }

  setItems(items) {
    this._items = items.slice();
  }

  getItems() {
    return this._items;
  }
};

export default mixSimpleCollection(Object);
