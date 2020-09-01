export const updateItem = (items, updatedItem) => {
  if (items.length === 0) {
    return items;
  }

  const index = items.findIndex((currentItem) => currentItem.id === updatedItem.id);

  if (index === -1) {
    throw new Error(`Can't update unexisting item by id`);
  }

  return [
    ...items.slice(0, index),
    updatedItem,
    ...items.slice(index + 1)
  ];
};

export const deleteItem = (items, deletedItem) => {
  if (items.length === 0) {
    return items;
  }

  return items.filter((currentItem) => currentItem.id !== deletedItem.id);
};

export const addItem = (items, newItem) => {
  return [
    newItem,
    ...items
  ];
};
